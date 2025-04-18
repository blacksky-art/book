import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  { timestamps: true }
);
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: { 
    type: Number,
    required: true,
    default: 0, 
  },
  productIsNew: { // New property to indicate if the product is new
    type: Boolean,
    default: false,
  },
  category: { // New property for product category
    type: String,
    required: true,
  },
  images: { // New property for product image URLs
      type: Array, // Change to an array of strings
      required: true,
      default: []
  },
  reviews: [reviewSchema],
  numberOfReviews: {
    type: Number,
    required: true,
    default: 0
  },
  stripeId: {
    type: String,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
