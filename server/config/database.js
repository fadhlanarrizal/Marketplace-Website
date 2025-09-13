// In-memory database simulation for demo purposes
// In production, use PostgreSQL, MongoDB, or MySQL

class Database {
  constructor() {
    this.users = [
      {
        id: 1,
        email: 'admin@nennong.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date()
      },
      {
        id: 2,
        email: 'user@nennong.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        name: 'John Doe',
        role: 'user',
        createdAt: new Date()
      }
    ];

    this.products = [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 299.99,
        category: 'Electronics',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
        stock: 50,
        sellerId: 2,
        createdAt: new Date(),
        featured: true
      },
      {
        id: 2,
        name: 'Organic Coffee Beans',
        description: 'Premium organic coffee beans from Colombia',
        price: 24.99,
        category: 'Food & Beverage',
        image: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=500',
        stock: 100,
        sellerId: 2,
        createdAt: new Date(),
        featured: false
      },
      {
        id: 3,
        name: 'Minimalist Watch',
        description: 'Elegant minimalist watch with leather strap',
        price: 149.99,
        category: 'Fashion',
        image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500',
        stock: 25,
        sellerId: 2,
        createdAt: new Date(),
        featured: true
      },
      {
        id: 4,
        name: 'Yoga Mat',
        description: 'Non-slip yoga mat for all types of yoga practice',
        price: 39.99,
        category: 'Sports',
        image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=500',
        stock: 75,
        sellerId: 2,
        createdAt: new Date(),
        featured: false
      }
    ];

    this.orders = [];
    this.categories = ['Electronics', 'Fashion', 'Food & Beverage', 'Sports', 'Books', 'Home & Garden'];
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findUserById(id) {
    return this.users.find(user => user.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: this.users.length + 1,
      ...userData,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Product methods
  getAllProducts(filters = {}) {
    let products = [...this.products];
    
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.minPrice) {
      products = products.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      products = products.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    return products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id));
  }

  createProduct(productData) {
    const newProduct = {
      id: this.products.length + 1,
      ...productData,
      createdAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id, updates) {
    const index = this.products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updates };
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
      return this.products.splice(index, 1)[0];
    }
    return null;
  }

  // Order methods
  createOrder(orderData) {
    const newOrder = {
      id: this.orders.length + 1,
      ...orderData,
      status: 'pending',
      createdAt: new Date()
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  getOrdersByUserId(userId) {
    return this.orders.filter(order => order.userId === userId);
  }

  getAllOrders() {
    return this.orders;
  }

  updateOrderStatus(id, status) {
    const order = this.orders.find(o => o.id === parseInt(id));
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  }
}

export default new Database();