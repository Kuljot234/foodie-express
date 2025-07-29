# FoodieExpress - Complete Food Delivery Platform

## 🚀 Project Overview
A complete food delivery platform with Customer App, Vendor Dashboard, and Delivery Partner interface built with React + FastAPI + MongoDB.

## 📁 Project Structure
```
foodie-express/
├── backend/                 # FastAPI Backend
│   ├── server.py           # Main FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/               # React Frontend
│   ├── public/            # Static assets
│   ├── src/               # React source code
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json       # Node.js dependencies
│   ├── tailwind.config.js # Tailwind configuration
│   ├── postcss.config.js  # PostCSS configuration
│   └── .env               # Frontend environment variables
└── README.md              # Project documentation
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or cloud)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Update .env file with your MongoDB URL:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=foodie_express_db
   ```

5. Start the backend server:
   ```bash
   uvicorn server:app --reload --host 0.0.0.0 --port 8001
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Update .env file with backend URL:
   ```
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## 🌟 Features

### Customer App
- Browse restaurants by city and cuisine
- View detailed menus with categories
- Add items to cart with quantity controls
- Place orders and track status
- Order history and real-time updates

### Vendor Dashboard
- Manage restaurant menu items
- View and process incoming orders
- Update order status (Accept → Preparing → Ready)
- Add/edit/delete menu items

### Delivery Partner App
- View available delivery orders
- Accept orders and track earnings
- Mark orders as delivered
- View delivery history and performance metrics

## 🍽️ Available Restaurants & Cuisines

### Indian Cuisine
- **Spice Garden** (Delhi) - Butter Chicken, Paneer Tikka, Dal Makhani
- **Biryani House** (Lucknow) - Hyderabadi Biryani, Mutton Biryani

### Chinese Cuisine
- **Dragon Wok** (Chennai) - Chicken Chowmein, Veg Hakka Noodles, Manchurian

### American Cuisine
- **Burger Palace** (Bangalore) - Classic Cheeseburger, Chicken Burger, Loaded Fries

### Italian Cuisine
- **Pizza Corner** (Mumbai) - Margherita Pizza, Pepperoni Pizza, Chicken Alfredo

### Mexican Cuisine
- **Taco Fiesta** (Pune) - Chicken Tacos, Beef Burrito, Nachos Supreme

### Japanese Cuisine
- **Sushi Master** (Hyderabad) - Salmon Sushi Roll, Chicken Teriyaki, Vegetable Tempura

### Healthy Options
- **Healthy Bites** (Gurgaon) - Greek Salad, Grilled Chicken Salad, Acai Bowl

## 🎯 Key Technologies Used

### Backend
- FastAPI (Python web framework)
- Motor (Async MongoDB driver)
- Pydantic (Data validation)
- CORS middleware

### Frontend
- React 18
- Tailwind CSS
- Axios (HTTP client)
- React Router

### Database
- MongoDB (NoSQL database)
- UUID-based identifiers

## 🔧 API Endpoints

### Users
- `POST /api/users` - Create user
- `GET /api/users/{user_id}` - Get user by ID

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant
- `GET /api/restaurants/{restaurant_id}` - Get restaurant by ID

### Menu Items
- `GET /api/menu-items/restaurant/{restaurant_id}` - Get menu items
- `POST /api/menu-items` - Create menu item
- `PUT /api/menu-items/{item_id}` - Update menu item
- `DELETE /api/menu-items/{item_id}` - Delete menu item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/customer/{customer_id}` - Get customer orders
- `GET /api/orders/restaurant/{restaurant_id}` - Get restaurant orders
- `PUT /api/orders/{order_id}/status` - Update order status

## 🚀 Deployment Notes

1. **Production Environment Variables**: Update URLs in .env files
2. **Database**: Use MongoDB Atlas for cloud deployment
3. **CORS**: Configure appropriate origins for production
4. **Static Files**: Serve React build files properly

## 📱 Mobile Responsive
The entire platform is mobile-responsive and works perfectly on all device sizes.

## 🎨 UI/UX Features
- Modern Swiggy-inspired design
- Smooth animations and transitions
- Intuitive navigation between app types
- Real-time cart updates
- Professional color scheme (orange/red gradients)

## 💡 Future Enhancements
- Real-time notifications
- Payment gateway integration
- GPS tracking for delivery
- Restaurant ratings and reviews
- Push notifications
- Advanced search and filters

---

**Built with ❤️ for the ultimate food delivery experience!**