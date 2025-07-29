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