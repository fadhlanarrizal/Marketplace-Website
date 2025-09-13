
import express from 'express';
import db from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all products with filtering
router.get('/', (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, featured } = req.query;
    
    let products = db.getAllProducts({
      category,
      search,
      minPrice,
      maxPrice
    });

    if (featured === 'true') {
      products = products.filter(p => p.featured);
    }

    res.json({
      products,
      total: products.length,
      categories: db.categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single product
router.get('/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create product (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validation
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    const newProduct = db.createProduct({
      name,
      description,
      price: parseFloat(price),
      category,
      image: image || 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=500',
      stock: parseInt(stock) || 0,
      sellerId: req.user.id,
      featured: false
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { name, description, price, category, image, stock, featured } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (price) updates.price = parseFloat(price);
    if (category) updates.category = category;
    if (image) updates.image = image;
    if (stock !== undefined) updates.stock = parseInt(stock);
    if (featured !== undefined) updates.featured = featured;

    const updatedProduct = db.updateProduct(req.params.id, updates);
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const deletedProduct = db.deleteProduct(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;