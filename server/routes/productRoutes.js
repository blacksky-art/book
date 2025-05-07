import express from "express";
import Product from "../models/Product.js";
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const productRoutes = express.Router();

const getProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 0;

  const allProducts = await Product.find({});
  if (perPage > 0) {
    const totalPages = Math.ceil(allProducts.length / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: allProducts.length,
      },
    });
  } else {
    res.json({ products: allProducts, pagination: {} });
  }
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

const createProduct = async (req, res) => {
  const { name, description, price, images } = req.body;
  const product = new Product({ name, description, price, image });
  try {
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { name, description, price, images } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.images = images || product.images;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Public Routes
productRoutes.get('/', getProducts);
productRoutes.get('/:id', getProduct);

// Admin Protected Routes
productRoutes.post('/', authMiddleware, adminMiddleware, createProduct);
productRoutes.put('/:id', authMiddleware, adminMiddleware, updateProduct);
productRoutes.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default productRoutes;
