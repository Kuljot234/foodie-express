import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Dummy data for demo purposes
const SAMPLE_RESTAURANTS = [
  {
    id: "rest1",
    name: "Spice Garden",
    description: "Authentic Indian cuisine with traditional flavors",
    cuisine_type: "Indian",
    address: "123 Food Street, Delhi",
    phone: "+91 9876543210",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50c3xlbnwwfHx8fDE3NTM3NzY4NTd8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.5,
    delivery_time: "25-35 mins",
    vendor_id: "vendor1",
    is_active: true
  },
  {
    id: "rest2", 
    name: "Pizza Corner",
    description: "Fresh baked pizzas and Italian delights",
    cuisine_type: "Italian",
    address: "456 Pizza Ave, Mumbai",
    phone: "+91 9876543211",
    image_url: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    rating: 4.2,
    delivery_time: "30-40 mins",
    vendor_id: "vendor2",
    is_active: true
  },
  {
    id: "rest3",
    name: "Burger Palace",
    description: "Juicy burgers and crispy fries with gourmet toppings",
    cuisine_type: "American",
    address: "789 Burger Street, Bangalore",
    phone: "+91 9876543212",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50c3xlbnwwfHx8fDE3NTM3NzY4NTd8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.3,
    delivery_time: "20-30 mins",
    vendor_id: "vendor3",
    is_active: true
  },
  {
    id: "rest4",
    name: "Dragon Wok",
    description: "Authentic Chinese cuisine with fresh noodles and dumplings",
    cuisine_type: "Chinese",
    address: "321 China Town, Chennai",
    phone: "+91 9876543213",
    image_url: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    rating: 4.4,
    delivery_time: "35-45 mins",
    vendor_id: "vendor4",
    is_active: true
  },
  {
    id: "rest5",
    name: "Taco Fiesta",
    description: "Mexican street food with authentic spices and fresh ingredients",
    cuisine_type: "Mexican",
    address: "555 Salsa Street, Pune",
    phone: "+91 9876543214",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50c3xlbnwwfHx8fDE3NTM3NzY4NTd8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.1,
    delivery_time: "25-35 mins",
    vendor_id: "vendor5",
    is_active: true
  },
  {
    id: "rest6",
    name: "Sushi Master",
    description: "Fresh sushi and Japanese delicacies made by expert chefs",
    cuisine_type: "Japanese",
    address: "888 Tokyo Lane, Hyderabad",
    phone: "+91 9876543215",
    image_url: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    rating: 4.7,
    delivery_time: "40-50 mins",
    vendor_id: "vendor6",
    is_active: true
  },
  {
    id: "rest7",
    name: "Biryani House",
    description: "Traditional Hyderabadi biryani with aromatic basmati rice",
    cuisine_type: "Indian",
    address: "999 Biryani Boulevard, Lucknow",
    phone: "+91 9876543216",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50c3xlbnwwfHx8fDE3NTM3NzY4NTd8MA&ixlib=rb-4.1.0&q=85",
    rating: 4.6,
    delivery_time: "30-40 mins",
    vendor_id: "vendor7",
    is_active: true
  },
  {
    id: "rest8",
    name: "Healthy Bites",
    description: "Fresh salads, smoothie bowls, and healthy meal options",
    cuisine_type: "Healthy",
    address: "444 Green Street, Gurgaon",
    phone: "+91 9876543217",
    image_url: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg",
    rating: 4.0,
    delivery_time: "15-25 mins",
    vendor_id: "vendor8",
    is_active: true
  }
];

const SAMPLE_MENU_ITEMS = {
  "rest1": [
    {
      id: "item1",
      restaurant_id: "rest1",
      name: "Butter Chicken",
      description: "Creamy tomato curry with tender chicken pieces",
      price: 299,
      category: "Main Course",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item2",
      restaurant_id: "rest1", 
      name: "Paneer Tikka",
      description: "Grilled cottage cheese with spices",
      price: 249,
      category: "Starter",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    },
    {
      id: "item17",
      restaurant_id: "rest1",
      name: "Dal Makhani",
      description: "Rich and creamy black lentils cooked with butter",
      price: 199,
      category: "Main Course",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    },
    {
      id: "item18",
      restaurant_id: "rest1",
      name: "Chicken Biryani",
      description: "Aromatic basmati rice with spiced chicken pieces",
      price: 349,
      category: "Rice & Biryani",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    }
  ],
  "rest2": [
    {
      id: "item3",
      restaurant_id: "rest2",
      name: "Margherita Pizza",
      description: "Classic pizza with mozzarella and basil",
      price: 399,
      category: "Pizza",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    },
    {
      id: "item19",
      restaurant_id: "rest2",
      name: "Pepperoni Pizza",
      description: "Classic pizza with spicy pepperoni and cheese",
      price: 449,
      category: "Pizza",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item20",
      restaurant_id: "rest2",
      name: "Chicken Alfredo Pasta",
      description: "Creamy white sauce pasta with grilled chicken",
      price: 329,
      category: "Pasta",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    }
  ],
  "rest3": [
    {
      id: "item4",
      restaurant_id: "rest3",
      name: "Classic Cheeseburger",
      description: "Juicy beef patty with cheese, lettuce, tomato and special sauce",
      price: 299,
      category: "Burgers",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item5",
      restaurant_id: "rest3",
      name: "Chicken Burger",
      description: "Grilled chicken breast with mayo and fresh vegetables",
      price: 279,
      category: "Burgers",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item6",
      restaurant_id: "rest3",
      name: "Veg Deluxe Burger",
      description: "Plant-based patty with avocado and fresh veggies",
      price: 259,
      category: "Burgers",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    },
    {
      id: "item7",
      restaurant_id: "rest3",
      name: "Loaded Fries",
      description: "Crispy fries topped with cheese, bacon and sour cream",
      price: 179,
      category: "Sides",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    }
  ],
  "rest4": [
    {
      id: "item8",
      restaurant_id: "rest4",
      name: "Chicken Chowmein",
      description: "Stir-fried noodles with chicken and mixed vegetables",
      price: 229,
      category: "Noodles",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item9",
      restaurant_id: "rest4",
      name: "Veg Hakka Noodles",
      description: "Indo-Chinese style noodles with fresh vegetables",
      price: 199,
      category: "Noodles",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    },
    {
      id: "item10",
      restaurant_id: "rest4",
      name: "Chicken Manchurian",
      description: "Crispy chicken balls in spicy and tangy sauce",
      price: 269,
      category: "Main Course",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item11",
      restaurant_id: "rest4",
      name: "Veg Fried Rice",
      description: "Wok-tossed rice with mixed vegetables and soy sauce",
      price: 179,
      category: "Rice",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    }
  ],
  "rest5": [
    {
      id: "item12",
      restaurant_id: "rest5",
      name: "Chicken Tacos",
      description: "Soft corn tortillas with grilled chicken and salsa",
      price: 249,
      category: "Tacos",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item13",
      restaurant_id: "rest5",
      name: "Beef Burrito",
      description: "Large flour tortilla with seasoned beef and beans",
      price: 299,
      category: "Burritos",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item21",
      restaurant_id: "rest5",
      name: "Nachos Supreme",
      description: "Crispy tortilla chips with cheese, jalapeños and sour cream",
      price: 219,
      category: "Appetizers",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    }
  ],
  "rest6": [
    {
      id: "item14",
      restaurant_id: "rest6",
      name: "Salmon Sushi Roll",
      description: "Fresh salmon with avocado and cucumber",
      price: 399,
      category: "Sushi",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item15",
      restaurant_id: "rest6",
      name: "Chicken Teriyaki",
      description: "Grilled chicken with teriyaki sauce and steamed rice",
      price: 349,
      category: "Main Course",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item22",
      restaurant_id: "rest6",
      name: "Vegetable Tempura",
      description: "Crispy battered and fried seasonal vegetables",
      price: 279,
      category: "Appetizers",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    }
  ],
  "rest7": [
    {
      id: "item16",
      restaurant_id: "rest7",
      name: "Hyderabadi Chicken Biryani",
      description: "Aromatic basmati rice with tender chicken pieces and saffron",
      price: 379,
      category: "Biryani",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item23",
      restaurant_id: "rest7",
      name: "Mutton Biryani",
      description: "Premium mutton pieces cooked with fragrant basmati rice",
      price: 449,
      category: "Biryani",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item24",
      restaurant_id: "rest7",
      name: "Vegetable Biryani",
      description: "Mixed vegetables and paneer cooked with aromatic spices",
      price: 299,
      category: "Biryani",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    }
  ],
  "rest8": [
    {
      id: "item25",
      restaurant_id: "rest8",
      name: "Greek Salad Bowl",
      description: "Fresh lettuce, olives, feta cheese with olive oil dressing",
      price: 199,
      category: "Salads",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    },
    {
      id: "item26",
      restaurant_id: "rest8",
      name: "Grilled Chicken Salad",
      description: "Lean grilled chicken with mixed greens and vinaigrette",
      price: 249,
      category: "Salads",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: false
    },
    {
      id: "item27",
      restaurant_id: "rest8",
      name: "Acai Smoothie Bowl",
      description: "Antioxidant-rich acai with granola and fresh berries",
      price: 179,
      category: "Smoothie Bowls",
      image_url: "https://images.pexels.com/photos/1542252/pexels-photo-1542252.jpeg",
      is_available: true,
      is_veg: true
    }
  ]
};

const SAMPLE_ORDERS = [
  {
    id: "order1",
    customer_id: "customer1",
    restaurant_id: "rest1",
    items: [
      { menu_item_id: "item1", name: "Butter Chicken", price: 299, quantity: 1 },
      { menu_item_id: "item2", name: "Paneer Tikka", price: 249, quantity: 1 }
    ],
    total_amount: 548,
    delivery_address: "123 Home Street, Delhi",
    customer_phone: "+91 9876543999",
    status: "preparing",
    created_at: new Date().toISOString(),
    estimated_delivery: "25-35 mins"
  }
];

const CITIES = [
  { id: 'delhi', name: 'Delhi', restaurants: ['rest1', 'rest7'] },
  { id: 'mumbai', name: 'Mumbai', restaurants: ['rest2', 'rest8'] },
  { id: 'bangalore', name: 'Bangalore', restaurants: ['rest3', 'rest6'] },
  { id: 'chennai', name: 'Chennai', restaurants: ['rest4'] },
  { id: 'pune', name: 'Pune', restaurants: ['rest5'] },
  { id: 'hyderabad', name: 'Hyderabad', restaurants: ['rest6', 'rest7'] },
  { id: 'all', name: 'All Cities', restaurants: ['rest1', 'rest2', 'rest3', 'rest4', 'rest5', 'rest6', 'rest7', 'rest8'] }
];

const CUISINES = ['All', 'Indian', 'Italian', 'American', 'Chinese', 'Mexican', 'Japanese', 'Healthy'];

function App() {
  const [currentView, setCurrentView] = useState('customer');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [restaurants, setRestaurants] = useState(SAMPLE_RESTAURANTS);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('All');

  // Customer App Component
  const CustomerApp = () => {
    const addToCart = (item) => {
      const existingItem = cart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        setCart(cart.map(cartItem => 
          cartItem.id === item.id 
            ? {...cartItem, quantity: cartItem.quantity + 1}
            : cartItem
        ));
      } else {
        setCart([...cart, {...item, quantity: 1}]);
      }
    };

    const removeFromCart = (itemId) => {
      setCart(cart.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId, newQuantity) => {
      if (newQuantity === 0) {
        removeFromCart(itemId);
      } else {
        setCart(cart.map(item => 
          item.id === itemId ? {...item, quantity: newQuantity} : item
        ));
      }
    };

    const getTotalAmount = () => {
      return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const placeOrder = () => {
      if (cart.length === 0) return;
      
      const newOrder = {
        id: `order${orders.length + 1}`,
        customer_id: "customer1",
        restaurant_id: selectedRestaurant.id,
        items: cart.map(item => ({
          menu_item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_amount: getTotalAmount(),
        delivery_address: "123 Home Street, Delhi",
        customer_phone: "+91 9876543999",
        status: "pending",
        created_at: new Date().toISOString(),
        estimated_delivery: "30-45 mins"
      };

      setOrders([...orders, newOrder]);
      setCart([]);
      setSelectedRestaurant(null);
      alert("Order placed successfully!");
    };

    // Filter restaurants based on selected city and cuisine
    const filteredRestaurants = restaurants.filter(restaurant => {
      const cityMatch = selectedCity === 'all' || 
        CITIES.find(city => city.id === selectedCity)?.restaurants.includes(restaurant.id);
      const cuisineMatch = selectedCuisine === 'All' || restaurant.cuisine_type === selectedCuisine;
      return cityMatch && cuisineMatch;
    });

    if (selectedRestaurant) {
      const menuItems = SAMPLE_MENU_ITEMS[selectedRestaurant.id] || [];
      
      return (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-md p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="text-orange-500 hover:text-orange-600"
              >
                ← Back to Restaurants
              </button>
              <h1 className="text-xl font-bold text-gray-800">{selectedRestaurant.name}</h1>
              <div className="relative">
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                  Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
                </button>
              </div>
            </div>
          </header>

          <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Menu</h2>
              <div className="space-y-4">
                {menuItems.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                          <p className="text-orange-500 font-bold mt-2">₹{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${item.is_veg ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {item.is_veg ? 'VEG' : 'NON-VEG'}
                          </span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart */}
            <div className="bg-white rounded-lg shadow-md p-4 h-fit">
              <h3 className="font-bold text-lg mb-4">Your Cart</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total: ₹{getTotalAmount()}</span>
                    </div>
                    <button 
                      onClick={placeOrder}
                      className="w-full bg-orange-500 text-white py-2 rounded-lg mt-3 hover:bg-orange-600"
                    >
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Order food online from your favorite restaurants
            </h1>
            <p className="text-xl mb-8">Fast delivery • Wide variety • Great taste</p>
            
            {/* City and Location Selection */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <select 
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 text-lg"
                >
                  {CITIES.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="Enter your exact location"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cuisine Filter */}
        <section className="max-w-6xl mx-auto p-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {CUISINES.map(cuisine => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={`px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedCuisine === cuisine
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'
                }`}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </section>

        {/* Restaurants Grid */}
        <section className="max-w-6xl mx-auto px-6 pb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {selectedCity !== 'all' 
                ? `Restaurants in ${CITIES.find(c => c.id === selectedCity)?.name}` 
                : 'All Restaurants'
              }
              {selectedCuisine !== 'All' && ` - ${selectedCuisine} Cuisine`}
            </h2>
            <p className="text-gray-500">{filteredRestaurants.length} restaurants found</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <div 
                key={restaurant.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105 duration-200"
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                <img 
                  src={restaurant.image_url} 
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-xl">{restaurant.name}</h3>
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-sm">
                      {restaurant.cuisine_type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-green-600 font-medium">★ {restaurant.rating}</span>
                    <span className="text-orange-500 font-medium">{restaurant.delivery_time}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-2">📍 {restaurant.address}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No restaurants found matching your criteria</p>
              <button 
                onClick={() => {setSelectedCity('all'); setSelectedCuisine('All')}}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                View All Restaurants
              </button>
            </div>
          )}
        </section>

        {/* Order History */}
        <section className="max-w-6xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Recent Orders</h2>
          <div className="space-y-4">
            {orders.filter(order => order.customer_id === "customer1").map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">Order #{order.id}</h3>
                    <p className="text-gray-600">{order.items.map(item => item.name).join(', ')}</p>
                    <p className="text-sm text-gray-500">Total: ₹{order.total_amount}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  // Vendor App Component
  const VendorApp = () => {
    const [newMenuItem, setNewMenuItem] = useState({
      name: '',
      description: '',
      price: '',
      category: '',
      is_veg: true
    });

    const vendorOrders = orders.filter(order => order.restaurant_id === "rest1");

    const updateOrderStatus = (orderId, newStatus) => {
      setOrders(orders.map(order => 
        order.id === orderId ? {...order, status: newStatus} : order
      ));
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800">Vendor Dashboard - Spice Garden</h1>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Incoming Orders</h2>
            <div className="space-y-4">
              {vendorOrders.map(order => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">Order #{order.id}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      order.status === 'pending' ? 'bg-red-100 text-red-600' :
                      order.status === 'accepted' ? 'bg-blue-100 text-blue-600' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="mb-3">
                    {order.items.map((item, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {item.quantity}x {item.name} - ₹{item.price * item.quantity}
                      </p>
                    ))}
                  </div>
                  <p className="font-bold mb-2">Total: ₹{order.total_amount}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Delivery: {order.delivery_address} | Phone: {order.customer_phone}
                  </p>
                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Accept
                      </button>
                    )}
                    {order.status === 'accepted' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Ready for Pickup
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Menu Management</h2>
            
            {/* Add New Item Form */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Add New Menu Item</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="Description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="flex space-x-3">
                  <input
                    type="number"
                    placeholder="Price"
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  />
                  <select
                    value={newMenuItem.category}
                    onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                    className="flex-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="">Select Category</option>
                    <option value="Starter">Starter</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newMenuItem.is_veg}
                    onChange={(e) => setNewMenuItem({...newMenuItem, is_veg: e.target.checked})}
                    className="mr-2"
                  />
                  <label>Vegetarian</label>
                </div>
                <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
                  Add Item
                </button>
              </div>
            </div>

            {/* Current Menu Items */}
            <div>
              <h3 className="font-medium mb-3">Current Menu Items</h3>
              <div className="space-y-2">
                {SAMPLE_MENU_ITEMS["rest1"]?.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-blue-500 text-sm">Edit</button>
                      <button className="text-red-500 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delivery Partner App Component
  const DeliveryApp = () => {
    const availableOrders = orders.filter(order => order.status === 'ready' && !order.delivery_partner_id);
    const assignedOrders = orders.filter(order => order.delivery_partner_id === 'partner1');

    const acceptOrder = (orderId) => {
      setOrders(orders.map(order => 
        order.id === orderId 
          ? {...order, delivery_partner_id: 'partner1', status: 'picked_up'} 
          : order
      ));
    };

    const markDelivered = (orderId) => {
      setOrders(orders.map(order => 
        order.id === orderId ? {...order, status: 'delivered'} : order
      ));
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-md p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Delivery Partner Dashboard</h1>
            <div className="text-right">
              <p className="text-sm text-gray-500">Today's Earnings</p>
              <p className="text-xl font-bold text-green-600">₹850</p>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="bg-cover bg-center h-48" style={{backgroundImage: `url('https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnl8ZW58MHx8fHwxNzUzNzc2ODAzfDA&ixlib=rb-4.1.0&q=85')`}}>
          <div className="bg-black bg-opacity-50 h-full flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">Ready to deliver happiness?</h2>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Available Orders</h2>
            <div className="space-y-4">
              {availableOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders available right now</p>
              ) : (
                availableOrders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">Order #{order.id}</h3>
                      <span className="text-green-600 font-bold">₹{Math.floor(order.total_amount * 0.1)} delivery fee</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Pickup: {restaurants.find(r => r.id === order.restaurant_id)?.address}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Drop: {order.delivery_address}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Order Value: ₹{order.total_amount} | Distance: ~2.3 km
                    </p>
                    <button 
                      onClick={() => acceptOrder(order.id)}
                      className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                      Accept Order
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Your Assigned Orders</h2>
            <div className="space-y-4">
              {assignedOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No assigned orders</p>
              ) : (
                assignedOrders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">Order #{order.id}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        order.status === 'picked_up' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {order.status === 'picked_up' ? 'In Transit' : 'Delivered'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Customer: {order.customer_phone}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      Drop: {order.delivery_address}
                    </p>
                    {order.status === 'picked_up' && (
                      <div className="space-y-2">
                        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                          View Route on Maps
                        </button>
                        <button 
                          onClick={() => markDelivered(order.id)}
                          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                        >
                          Mark as Delivered
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Delivery History */}
        <section className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Delivery History & Earnings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">12</p>
                <p className="text-sm text-gray-600">Today's Deliveries</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">₹850</p>
                <p className="text-sm text-gray-600">Today's Earnings</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">4.8★</p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
            </div>
            <div className="space-y-3">
              {orders.filter(order => order.status === 'delivered' && order.delivery_partner_id === 'partner1').map(order => (
                <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">Delivered • ₹{Math.floor(order.total_amount * 0.1)} earned</p>
                  </div>
                  <span className="text-green-600">✓ Completed</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-500">FoodieExpress</h1>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentView('customer')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'customer' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Customer
              </button>
              <button
                onClick={() => setCurrentView('vendor')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'vendor' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Vendor
              </button>
              <button
                onClick={() => setCurrentView('delivery')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  currentView === 'delivery' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Delivery Partner
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Render Current View */}
      {currentView === 'customer' && <CustomerApp />}
      {currentView === 'vendor' && <VendorApp />}
      {currentView === 'delivery' && <DeliveryApp />}
    </div>
  );
}

export default App;