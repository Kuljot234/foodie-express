#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Food Delivery Platform
Tests all endpoints with realistic data and error cases
"""

import requests
import json
import uuid
from datetime import datetime
from typing import Dict, List, Any

# Backend URL from frontend/.env
BASE_URL = "https://f8c772e5-aa0b-47dd-96e5-de802d815d8c.preview.emergentagent.com/api"

class FoodDeliveryAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_data = {}
        self.results = []
        
    def log_result(self, test_name: str, success: bool, message: str, response_data: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def test_user_management(self):
        """Test user creation and retrieval"""
        print("\n=== Testing User Management ===")
        
        # Test 1: Create Customer
        customer_data = {
            "name": "Sarah Johnson",
            "email": "sarah.johnson@email.com",
            "phone": "+1-555-0123",
            "role": "customer",
            "address": "123 Oak Street, Downtown, NY 10001"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users", json=customer_data)
            if response.status_code == 200:
                customer = response.json()
                self.test_data['customer'] = customer
                self.log_result("Create Customer", True, f"Customer created with ID: {customer['id']}", customer)
            else:
                self.log_result("Create Customer", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Customer", False, f"Exception: {str(e)}")
        
        # Test 2: Create Vendor
        vendor_data = {
            "name": "Marco Rossi",
            "email": "marco.rossi@restaurant.com",
            "phone": "+1-555-0456",
            "role": "vendor",
            "address": "456 Main Street, Business District, NY 10002"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users", json=vendor_data)
            if response.status_code == 200:
                vendor = response.json()
                self.test_data['vendor'] = vendor
                self.log_result("Create Vendor", True, f"Vendor created with ID: {vendor['id']}", vendor)
            else:
                self.log_result("Create Vendor", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Vendor", False, f"Exception: {str(e)}")
        
        # Test 3: Create Delivery Partner
        delivery_partner_data = {
            "name": "Alex Chen",
            "email": "alex.chen@delivery.com",
            "phone": "+1-555-0789",
            "role": "delivery_partner"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/users", json=delivery_partner_data)
            if response.status_code == 200:
                delivery_partner = response.json()
                self.test_data['delivery_partner'] = delivery_partner
                self.log_result("Create Delivery Partner", True, f"Delivery partner created with ID: {delivery_partner['id']}", delivery_partner)
            else:
                self.log_result("Create Delivery Partner", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Delivery Partner", False, f"Exception: {str(e)}")
        
        # Test 4: Get User by ID
        if 'customer' in self.test_data:
            try:
                customer_id = self.test_data['customer']['id']
                response = self.session.get(f"{self.base_url}/users/{customer_id}")
                if response.status_code == 200:
                    user = response.json()
                    self.log_result("Get User by ID", True, f"Retrieved user: {user['name']}", user)
                else:
                    self.log_result("Get User by ID", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Get User by ID", False, f"Exception: {str(e)}")
        
        # Test 5: Get Non-existent User (Error Case)
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.get(f"{self.base_url}/users/{fake_id}")
            if response.status_code == 404:
                self.log_result("Get Non-existent User", True, "Correctly returned 404 for non-existent user")
            else:
                self.log_result("Get Non-existent User", False, f"Expected 404, got {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Non-existent User", False, f"Exception: {str(e)}")
    
    def test_restaurant_management(self):
        """Test restaurant creation and retrieval"""
        print("\n=== Testing Restaurant Management ===")
        
        if 'vendor' not in self.test_data:
            self.log_result("Restaurant Tests", False, "No vendor available for restaurant tests")
            return
        
        # Test 1: Create Restaurant
        restaurant_data = {
            "name": "Bella Italia Ristorante",
            "description": "Authentic Italian cuisine with fresh ingredients and traditional recipes passed down through generations",
            "cuisine_type": "Italian",
            "address": "789 Culinary Avenue, Little Italy, NY 10003",
            "phone": "+1-555-0321",
            "image_url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
            "vendor_id": self.test_data['vendor']['id']
        }
        
        try:
            response = self.session.post(f"{self.base_url}/restaurants", json=restaurant_data)
            if response.status_code == 200:
                restaurant = response.json()
                self.test_data['restaurant'] = restaurant
                self.log_result("Create Restaurant", True, f"Restaurant created with ID: {restaurant['id']}", restaurant)
            else:
                self.log_result("Create Restaurant", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Restaurant", False, f"Exception: {str(e)}")
        
        # Test 2: Get All Restaurants
        try:
            response = self.session.get(f"{self.base_url}/restaurants")
            if response.status_code == 200:
                restaurants = response.json()
                self.log_result("Get All Restaurants", True, f"Retrieved {len(restaurants)} restaurants", restaurants)
            else:
                self.log_result("Get All Restaurants", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get All Restaurants", False, f"Exception: {str(e)}")
        
        # Test 3: Get Restaurant by ID
        if 'restaurant' in self.test_data:
            try:
                restaurant_id = self.test_data['restaurant']['id']
                response = self.session.get(f"{self.base_url}/restaurants/{restaurant_id}")
                if response.status_code == 200:
                    restaurant = response.json()
                    self.log_result("Get Restaurant by ID", True, f"Retrieved restaurant: {restaurant['name']}", restaurant)
                else:
                    self.log_result("Get Restaurant by ID", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Get Restaurant by ID", False, f"Exception: {str(e)}")
        
        # Test 4: Get Restaurants by Vendor
        try:
            vendor_id = self.test_data['vendor']['id']
            response = self.session.get(f"{self.base_url}/restaurants/vendor/{vendor_id}")
            if response.status_code == 200:
                restaurants = response.json()
                self.log_result("Get Restaurants by Vendor", True, f"Retrieved {len(restaurants)} restaurants for vendor", restaurants)
            else:
                self.log_result("Get Restaurants by Vendor", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Restaurants by Vendor", False, f"Exception: {str(e)}")
        
        # Test 5: Get Non-existent Restaurant (Error Case)
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.get(f"{self.base_url}/restaurants/{fake_id}")
            if response.status_code == 404:
                self.log_result("Get Non-existent Restaurant", True, "Correctly returned 404 for non-existent restaurant")
            else:
                self.log_result("Get Non-existent Restaurant", False, f"Expected 404, got {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Non-existent Restaurant", False, f"Exception: {str(e)}")
    
    def test_menu_items(self):
        """Test menu item CRUD operations"""
        print("\n=== Testing Menu Items ===")
        
        if 'restaurant' not in self.test_data:
            self.log_result("Menu Item Tests", False, "No restaurant available for menu item tests")
            return
        
        restaurant_id = self.test_data['restaurant']['id']
        
        # Test 1: Create Menu Items
        menu_items_data = [
            {
                "restaurant_id": restaurant_id,
                "name": "Margherita Pizza",
                "description": "Classic pizza with fresh mozzarella, tomato sauce, and basil leaves",
                "price": 18.99,
                "category": "Pizza",
                "image_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
                "is_veg": True
            },
            {
                "restaurant_id": restaurant_id,
                "name": "Chicken Alfredo Pasta",
                "description": "Creamy fettuccine pasta with grilled chicken and parmesan cheese",
                "price": 22.50,
                "category": "Pasta",
                "image_url": "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5",
                "is_veg": False
            },
            {
                "restaurant_id": restaurant_id,
                "name": "Caesar Salad",
                "description": "Fresh romaine lettuce with caesar dressing, croutons, and parmesan",
                "price": 14.99,
                "category": "Salads",
                "image_url": "https://images.unsplash.com/photo-1546793665-c74683f339c1",
                "is_veg": True
            }
        ]
        
        created_items = []
        for i, item_data in enumerate(menu_items_data):
            try:
                response = self.session.post(f"{self.base_url}/menu-items", json=item_data)
                if response.status_code == 200:
                    menu_item = response.json()
                    created_items.append(menu_item)
                    self.log_result(f"Create Menu Item {i+1}", True, f"Menu item created: {menu_item['name']}", menu_item)
                else:
                    self.log_result(f"Create Menu Item {i+1}", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result(f"Create Menu Item {i+1}", False, f"Exception: {str(e)}")
        
        self.test_data['menu_items'] = created_items
        
        # Test 2: Get Menu Items by Restaurant
        try:
            response = self.session.get(f"{self.base_url}/menu-items/restaurant/{restaurant_id}")
            if response.status_code == 200:
                menu_items = response.json()
                self.log_result("Get Menu Items by Restaurant", True, f"Retrieved {len(menu_items)} menu items", menu_items)
            else:
                self.log_result("Get Menu Items by Restaurant", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Menu Items by Restaurant", False, f"Exception: {str(e)}")
        
        # Test 3: Update Menu Item
        if created_items:
            try:
                item_to_update = created_items[0]
                update_data = {
                    "restaurant_id": restaurant_id,
                    "name": "Margherita Pizza - Special",
                    "description": "Classic pizza with fresh mozzarella, tomato sauce, basil leaves, and extra cheese",
                    "price": 20.99,
                    "category": "Pizza",
                    "image_url": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
                    "is_veg": True
                }
                
                response = self.session.put(f"{self.base_url}/menu-items/{item_to_update['id']}", json=update_data)
                if response.status_code == 200:
                    updated_item = response.json()
                    self.log_result("Update Menu Item", True, f"Menu item updated: {updated_item['name']}", updated_item)
                else:
                    self.log_result("Update Menu Item", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Update Menu Item", False, f"Exception: {str(e)}")
        
        # Test 4: Delete Menu Item (Soft Delete)
        if created_items and len(created_items) > 1:
            try:
                item_to_delete = created_items[-1]  # Delete last item
                response = self.session.delete(f"{self.base_url}/menu-items/{item_to_delete['id']}")
                if response.status_code == 200:
                    self.log_result("Delete Menu Item", True, f"Menu item deleted: {item_to_delete['name']}")
                else:
                    self.log_result("Delete Menu Item", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Delete Menu Item", False, f"Exception: {str(e)}")
        
        # Test 5: Update Non-existent Menu Item (Error Case)
        try:
            fake_id = str(uuid.uuid4())
            update_data = {
                "restaurant_id": restaurant_id,
                "name": "Fake Item",
                "description": "This should fail",
                "price": 10.00,
                "category": "Test",
                "image_url": "https://example.com/fake.jpg",
                "is_veg": True
            }
            response = self.session.put(f"{self.base_url}/menu-items/{fake_id}", json=update_data)
            if response.status_code == 404:
                self.log_result("Update Non-existent Menu Item", True, "Correctly returned 404 for non-existent menu item")
            else:
                self.log_result("Update Non-existent Menu Item", False, f"Expected 404, got {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Update Non-existent Menu Item", False, f"Exception: {str(e)}")
    
    def test_orders(self):
        """Test order creation and management"""
        print("\n=== Testing Orders ===")
        
        if not all(key in self.test_data for key in ['customer', 'restaurant', 'menu_items']):
            self.log_result("Order Tests", False, "Missing required data for order tests")
            return
        
        if not self.test_data['menu_items']:
            self.log_result("Order Tests", False, "No menu items available for order tests")
            return
        
        # Test 1: Create Order
        order_data = {
            "customer_id": self.test_data['customer']['id'],
            "restaurant_id": self.test_data['restaurant']['id'],
            "items": [
                {
                    "menu_item_id": self.test_data['menu_items'][0]['id'],
                    "name": self.test_data['menu_items'][0]['name'],
                    "price": self.test_data['menu_items'][0]['price'],
                    "quantity": 2
                },
                {
                    "menu_item_id": self.test_data['menu_items'][1]['id'] if len(self.test_data['menu_items']) > 1 else self.test_data['menu_items'][0]['id'],
                    "name": self.test_data['menu_items'][1]['name'] if len(self.test_data['menu_items']) > 1 else self.test_data['menu_items'][0]['name'],
                    "price": self.test_data['menu_items'][1]['price'] if len(self.test_data['menu_items']) > 1 else self.test_data['menu_items'][0]['price'],
                    "quantity": 1
                }
            ],
            "total_amount": 60.48,  # Calculated based on items
            "delivery_address": "123 Oak Street, Downtown, NY 10001",
            "customer_phone": "+1-555-0123"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/orders", json=order_data)
            if response.status_code == 200:
                order = response.json()
                self.test_data['order'] = order
                self.log_result("Create Order", True, f"Order created with ID: {order['id']}", order)
            else:
                self.log_result("Create Order", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Order", False, f"Exception: {str(e)}")
        
        # Test 2: Get Customer Orders
        try:
            customer_id = self.test_data['customer']['id']
            response = self.session.get(f"{self.base_url}/orders/customer/{customer_id}")
            if response.status_code == 200:
                orders = response.json()
                self.log_result("Get Customer Orders", True, f"Retrieved {len(orders)} orders for customer", orders)
            else:
                self.log_result("Get Customer Orders", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Customer Orders", False, f"Exception: {str(e)}")
        
        # Test 3: Get Restaurant Orders
        try:
            restaurant_id = self.test_data['restaurant']['id']
            response = self.session.get(f"{self.base_url}/orders/restaurant/{restaurant_id}")
            if response.status_code == 200:
                orders = response.json()
                self.log_result("Get Restaurant Orders", True, f"Retrieved {len(orders)} orders for restaurant", orders)
            else:
                self.log_result("Get Restaurant Orders", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Restaurant Orders", False, f"Exception: {str(e)}")
        
        # Test 4: Get Order by ID
        if 'order' in self.test_data:
            try:
                order_id = self.test_data['order']['id']
                response = self.session.get(f"{self.base_url}/orders/{order_id}")
                if response.status_code == 200:
                    order = response.json()
                    self.log_result("Get Order by ID", True, f"Retrieved order with status: {order['status']}", order)
                else:
                    self.log_result("Get Order by ID", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Get Order by ID", False, f"Exception: {str(e)}")
        
        # Test 5: Update Order Status
        if 'order' in self.test_data:
            try:
                order_id = self.test_data['order']['id']
                # Update to accepted
                response = self.session.put(f"{self.base_url}/orders/{order_id}/status?status=accepted")
                if response.status_code == 200:
                    updated_order = response.json()
                    self.log_result("Update Order Status to Accepted", True, f"Order status updated to: {updated_order['status']}", updated_order)
                    
                    # Update to ready
                    response = self.session.put(f"{self.base_url}/orders/{order_id}/status?status=ready")
                    if response.status_code == 200:
                        updated_order = response.json()
                        self.log_result("Update Order Status to Ready", True, f"Order status updated to: {updated_order['status']}", updated_order)
                    else:
                        self.log_result("Update Order Status to Ready", False, f"Status: {response.status_code}", response.text)
                else:
                    self.log_result("Update Order Status to Accepted", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Update Order Status", False, f"Exception: {str(e)}")
        
        # Test 6: Get Available Orders
        try:
            response = self.session.get(f"{self.base_url}/orders/available")
            if response.status_code == 200:
                orders = response.json()
                self.log_result("Get Available Orders", True, f"Retrieved {len(orders)} available orders", orders)
            else:
                self.log_result("Get Available Orders", False, f"Status: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Available Orders", False, f"Exception: {str(e)}")
        
        # Test 7: Assign Delivery Partner and Update Status
        if 'order' in self.test_data and 'delivery_partner' in self.test_data:
            try:
                order_id = self.test_data['order']['id']
                delivery_partner_id = self.test_data['delivery_partner']['id']
                response = self.session.put(f"{self.base_url}/orders/{order_id}/status?status=picked_up&delivery_partner_id={delivery_partner_id}")
                if response.status_code == 200:
                    updated_order = response.json()
                    self.log_result("Assign Delivery Partner", True, f"Order assigned to delivery partner: {updated_order['delivery_partner_id']}", updated_order)
                else:
                    self.log_result("Assign Delivery Partner", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Assign Delivery Partner", False, f"Exception: {str(e)}")
        
        # Test 8: Get Delivery Partner Orders
        if 'delivery_partner' in self.test_data:
            try:
                partner_id = self.test_data['delivery_partner']['id']
                response = self.session.get(f"{self.base_url}/orders/delivery-partner/{partner_id}")
                if response.status_code == 200:
                    orders = response.json()
                    self.log_result("Get Delivery Partner Orders", True, f"Retrieved {len(orders)} orders for delivery partner", orders)
                else:
                    self.log_result("Get Delivery Partner Orders", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Get Delivery Partner Orders", False, f"Exception: {str(e)}")
        
        # Test 9: Update Order Status to Delivered
        if 'order' in self.test_data:
            try:
                order_id = self.test_data['order']['id']
                response = self.session.put(f"{self.base_url}/orders/{order_id}/status?status=delivered")
                if response.status_code == 200:
                    updated_order = response.json()
                    self.log_result("Update Order Status to Delivered", True, f"Order status updated to: {updated_order['status']}", updated_order)
                else:
                    self.log_result("Update Order Status to Delivered", False, f"Status: {response.status_code}", response.text)
            except Exception as e:
                self.log_result("Update Order Status to Delivered", False, f"Exception: {str(e)}")
        
        # Test 10: Update Non-existent Order (Error Case)
        try:
            fake_id = str(uuid.uuid4())
            response = self.session.put(f"{self.base_url}/orders/{fake_id}/status?status=accepted")
            if response.status_code == 404:
                self.log_result("Update Non-existent Order", True, "Correctly returned 404 for non-existent order")
            else:
                self.log_result("Update Non-existent Order", False, f"Expected 404, got {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Update Non-existent Order", False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all test suites"""
        print(f"🚀 Starting Food Delivery Platform API Tests")
        print(f"📍 Testing against: {self.base_url}")
        print("=" * 80)
        
        # Run test suites in order
        self.test_user_management()
        self.test_restaurant_management()
        self.test_menu_items()
        self.test_orders()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 80)
        print("📊 TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.results)
        passed_tests = len([r for r in self.results if r['success']])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print(f"\n🔍 FAILED TESTS:")
            for result in self.results:
                if not result['success']:
                    print(f"   ❌ {result['test']}: {result['message']}")
        
        print("\n" + "=" * 80)
        
        # Save detailed results to file
        with open('/app/test_results_detailed.json', 'w') as f:
            json.dump({
                'summary': {
                    'total_tests': total_tests,
                    'passed_tests': passed_tests,
                    'failed_tests': failed_tests,
                    'success_rate': (passed_tests/total_tests)*100
                },
                'test_data': self.test_data,
                'results': self.results
            }, f, indent=2, default=str)
        
        print(f"📄 Detailed results saved to: /app/test_results_detailed.json")

if __name__ == "__main__":
    tester = FoodDeliveryAPITester()
    tester.run_all_tests()