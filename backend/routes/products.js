const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Seed sample products
// @route   POST /api/products/seed
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    const sampleProducts = [
      {
        name: 'Blue T-Shirt',
        slug: 'blue-t-shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        description: 'A comfortable blue cotton t-shirt perfect for everyday wear.',
        priceCents: 2500, // $25.00
        countInStock: 10,
      },
      {
        name: 'Wireless Mouse',
        slug: 'wireless-mouse',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
        description: 'High-quality wireless mouse with ergonomic design.',
        priceCents: 3500, // $35.00
        countInStock: 15,
      },
      {
        name: 'Coffee Mug',
        slug: 'coffee-mug',
        image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=500',
        description: 'Ceramic coffee mug with a beautiful design.',
        priceCents: 1500, // $15.00
        countInStock: 20,
      },
      {
        name: 'Laptop Stand',
        slug: 'laptop-stand',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
        description: 'Adjustable laptop stand for better ergonomics.',
        priceCents: 4500, // $45.00
        countInStock: 8,
      },
      {
        name: 'Plant Pot',
        slug: 'plant-pot',
        image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
        description: 'Decorative ceramic plant pot for your indoor plants.',
        priceCents: 2000, // $20.00
        countInStock: 12,
      },
      {
        name: 'Bluetooth Headphones',
        slug: 'bluetooth-headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        description: 'Premium wireless headphones with noise cancellation.',
        priceCents: 8000, // $80.00
        countInStock: 6,
      },
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    res.status(201).json({
      message: 'Sample products seeded successfully',
      count: createdProducts.length,
      products: createdProducts,
    });
  } catch (error) {
    console.error('Seed products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
