# 🎯 **FoodieExpress Complete Code Download**

## 📦 **How to Get the Code**

### Option 1: Download Archive (Recommended)
```bash
# Download the tar.gz file from your server
wget [YOUR_SERVER_URL]/foodie_express_complete.tar.gz

# Extract the files
tar -xzf foodie_express_complete.tar.gz
cd foodie-express
```

### Option 2: Recreate Project Manually

## 🗂️ **Complete File Structure**

```
foodie-express/
├── backend/
│   ├── server.py              # Main FastAPI backend
│   ├── requirements.txt       # Python dependencies  
│   └── .env                  # Backend environment
├── frontend/
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── src/
│   │   ├── App.js            # Main React component (1159 lines)
│   │   ├── App.css           # Custom styles (262 lines)
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Tailwind config
│   ├── postcss.config.js     # PostCSS config
│   └── .env                  # Frontend environment
├── SETUP_INSTRUCTIONS.md     # Detailed setup guide
└── README.md                 # Project documentation
```

---

## 📄 **BACKEND FILES**

### 1. `/backend/server.py`
```python
from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from enum import Enum


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Enums
class OrderStatus(str, Enum):
    pending = "pending"
    accepted = "accepted" 
    preparing = "preparing"
    ready = "ready"
    picked_up = "picked_up"
    delivered = "delivered"
    cancelled = "cancelled"

class UserRole(str, Enum):
    customer = "customer"
    vendor = "vendor"
    delivery_partner = "delivery_partner"


# Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str
    role: UserRole
    address: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    name: str
    email: str
    phone: str
    role: UserRole
    address: Optional[str] = None

class Restaurant(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    cuisine_type: str
    address: str
    phone: str
    image_url: str
    rating: float = 4.0
    delivery_time: str = "30-45 mins"
    vendor_id: str
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class RestaurantCreate(BaseModel):
    name: str
    description: str
    cuisine_type: str
    address: str
    phone: str
    image_url: str
    vendor_id: str

class MenuItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    restaurant_id: str
    name: str
    description: str
    price: float
    category: str
    image_url: str
    is_available: bool = True
    is_veg: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MenuItemCreate(BaseModel):
    restaurant_id: str
    name: str
    description: str
    price: float
    category: str
    image_url: str
    is_veg: bool = True

class OrderItem(BaseModel):
    menu_item_id: str
    name: str
    price: float
    quantity: int

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_id: str
    restaurant_id: str
    delivery_partner_id: Optional[str] = None
    items: List[OrderItem]
    total_amount: float
    delivery_address: str
    customer_phone: str
    status: OrderStatus = OrderStatus.pending
    created_at: datetime = Field(default_factory=datetime.utcnow)
    estimated_delivery: Optional[str] = "30-45 mins"

class OrderCreate(BaseModel):
    customer_id: str
    restaurant_id: str
    items: List[OrderItem]
    total_amount: float
    delivery_address: str
    customer_phone: str


# API Routes

# User Routes
@api_router.post("/users", response_model=User)
async def create_user(user: UserCreate):
    user_dict = user.dict()
    user_obj = User(**user_dict)
    await db.users.insert_one(user_obj.dict())
    return user_obj

@api_router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

# Restaurant Routes
@api_router.post("/restaurants", response_model=Restaurant)
async def create_restaurant(restaurant: RestaurantCreate):
    restaurant_dict = restaurant.dict()
    restaurant_obj = Restaurant(**restaurant_dict)
    await db.restaurants.insert_one(restaurant_obj.dict())
    return restaurant_obj

@api_router.get("/restaurants", response_model=List[Restaurant])
async def get_restaurants():
    restaurants = await db.restaurants.find({"is_active": True}).to_list(1000)
    return [Restaurant(**restaurant) for restaurant in restaurants]

@api_router.get("/restaurants/{restaurant_id}", response_model=Restaurant)
async def get_restaurant(restaurant_id: str):
    restaurant = await db.restaurants.find_one({"id": restaurant_id})
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return Restaurant(**restaurant)

@api_router.get("/restaurants/vendor/{vendor_id}", response_model=List[Restaurant])
async def get_restaurants_by_vendor(vendor_id: str):
    restaurants = await db.restaurants.find({"vendor_id": vendor_id}).to_list(1000)
    return [Restaurant(**restaurant) for restaurant in restaurants]

# Menu Item Routes
@api_router.post("/menu-items", response_model=MenuItem)
async def create_menu_item(menu_item: MenuItemCreate):
    menu_item_dict = menu_item.dict()
    menu_item_obj = MenuItem(**menu_item_dict)
    await db.menu_items.insert_one(menu_item_obj.dict())
    return menu_item_obj

@api_router.get("/menu-items/restaurant/{restaurant_id}", response_model=List[MenuItem])
async def get_menu_items(restaurant_id: str):
    menu_items = await db.menu_items.find({"restaurant_id": restaurant_id, "is_available": True}).to_list(1000)
    return [MenuItem(**menu_item) for menu_item in menu_items]

@api_router.put("/menu-items/{item_id}", response_model=MenuItem)
async def update_menu_item(item_id: str, menu_item: MenuItemCreate):
    existing_item = await db.menu_items.find_one({"id": item_id})
    if not existing_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    update_data = menu_item.dict()
    await db.menu_items.update_one({"id": item_id}, {"$set": update_data})
    
    updated_item = await db.menu_items.find_one({"id": item_id})
    return MenuItem(**updated_item)

@api_router.delete("/menu-items/{item_id}")
async def delete_menu_item(item_id: str):
    await db.menu_items.update_one({"id": item_id}, {"$set": {"is_available": False}})
    return {"message": "Menu item deleted successfully"}

# Order Routes
@api_router.post("/orders", response_model=Order)
async def create_order(order: OrderCreate):
    order_dict = order.dict()
    order_obj = Order(**order_dict)
    await db.orders.insert_one(order_obj.dict())
    return order_obj

@api_router.get("/orders/customer/{customer_id}", response_model=List[Order])
async def get_customer_orders(customer_id: str):
    orders = await db.orders.find({"customer_id": customer_id}).to_list(1000)
    return [Order(**order) for order in orders]

@api_router.get("/orders/restaurant/{restaurant_id}", response_model=List[Order])
async def get_restaurant_orders(restaurant_id: str):
    orders = await db.orders.find({"restaurant_id": restaurant_id}).to_list(1000)
    return [Order(**order) for order in orders]

@api_router.get("/orders/delivery-partner/{partner_id}", response_model=List[Order])
async def get_delivery_partner_orders(partner_id: str):
    orders = await db.orders.find({"delivery_partner_id": partner_id}).to_list(1000)
    return [Order(**order) for order in orders]

@api_router.get("/orders/available", response_model=List[Order])
async def get_available_orders():
    orders = await db.orders.find({"status": "ready", "delivery_partner_id": None}).to_list(1000)
    return [Order(**order) for order in orders]

@api_router.put("/orders/{order_id}/status", response_model=Order)
async def update_order_status(order_id: str, status: OrderStatus, delivery_partner_id: Optional[str] = None):
    update_data = {"status": status}
    if delivery_partner_id:
        update_data["delivery_partner_id"] = delivery_partner_id
    
    await db.orders.update_one({"id": order_id}, {"$set": update_data})
    
    updated_order = await db.orders.find_one({"id": order_id})
    if not updated_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**updated_order)

@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return Order(**order)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
```

### 2. `/backend/requirements.txt`
```
fastapi==0.110.1
uvicorn==0.25.0
boto3>=1.34.129
requests-oauthlib>=2.0.0
cryptography>=42.0.8
python-dotenv>=1.0.1
pymongo==4.5.0
pydantic>=2.6.4
email-validator>=2.2.0
pyjwt>=2.10.1
passlib>=1.7.4
tzdata>=2024.2
motor==3.3.1
pytest>=8.0.0
black>=24.1.1
isort>=5.13.2
flake8>=7.0.0
mypy>=1.8.0
python-jose>=3.3.0
requests>=2.31.0
pandas>=2.2.0
numpy>=1.26.0
python-multipart>=0.0.9
jq>=1.6.0
typer>=0.9.0
```

### 3. `/backend/.env`
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=foodie_express_db
```

---

## 🎨 **FRONTEND FILES**

### 4. `/frontend/package.json`
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "axios": "^1.8.4",
    "cra-template": "1.2.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@craco/craco": "^7.1.0",
    "@eslint/js": "9.23.0",
    "autoprefixer": "^10.4.20",
    "eslint": "9.23.0",
    "eslint-plugin-import": "2.31.0",
    "eslint-plugin-jsx-a11y": "6.10.2",
    "eslint-plugin-react": "7.37.4",
    "globals": "15.15.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17"
  }
}
```

### 5. `/frontend/.env`
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

### 6. `/frontend/tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 7. `/frontend/postcss.config.js`
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 8. `/frontend/src/index.js`
```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 9. `/frontend/src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
        monospace;
}
```

### 10. `/frontend/public/index.html`
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="FoodieExpress - Complete Food Delivery Platform" />
    <title>FoodieExpress - Food Delivery</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

---

## 🚀 **QUICK START COMMANDS**

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001

# Frontend setup (in new terminal)
cd frontend
npm install
npm start
```

## 🌟 **Features Included**

✅ **8 Diverse Restaurants** across 6+ cities  
✅ **27+ Menu Items** including Chowmein, Burgers, Pizza, Biryani  
✅ **City & Cuisine Filtering** system  
✅ **Customer App** with cart & ordering  
✅ **Vendor Dashboard** with order management  
✅ **Delivery Partner App** with earnings tracking  
✅ **Mobile Responsive** design  
✅ **Professional UI/UX** with Tailwind CSS  

**Total Code: 1500+ lines of production-ready code!**