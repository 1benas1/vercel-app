const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const mongoose = require('mongoose');
const { isValidProductId } = require('./validProductIds');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Define Product Schema
const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  businessName: String,
  redirectLink: String,
});

const Product = mongoose.model('Product', ProductSchema);

// API Routes
app.post('/api/products', async (req, res) => {
  try {
    const { productId, userId, name, businessName, redirectLink } = req.body;
    
    if (!isValidProductId(productId)) {
      return res.status(400).json({ error: 'Invalid Product ID' });
    }
    
    const existingProduct = await Product.findOne({ productId });
    
    if (existingProduct) {
      return res.status(400).json({ error: 'Product ID already in use' });
    }
    
    const newProduct = new Product({ productId, userId, name, businessName, redirectLink });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product', details: error.message });
  }
});

app.get('/api/products/:userId', async (req, res) => {
  try {
    const products = await Product.find({ userId: req.params.userId });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Error fetching products', details: error.message });
  }
});

app.put('/api/products/:productId', async (req, res) => {
  try {
    const { name, businessName, redirectLink } = req.body;
    const updatedProduct = await Product.findOneAndUpdate(
      { productId: req.params.productId },
      { name, businessName, redirectLink },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product', details: error.message });
  }
});

app.get('/api/places/autocomplete', async (req, res) => {
  const { input } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=establishment&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    res.status(500).json({ error: 'Error fetching place suggestions', details: error.message });
  }
});

app.get('/api/places/details', async (req, res) => {
  const { placeId } = req.query;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,photos&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching place details:', error);
    res.status(500).json({ error: 'Error fetching place details', details: error.message });
  }
});

// Redirect route
app.get('/redirect/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (product && product.redirectLink) {
      res.redirect(product.redirectLink);
    } else {
      res.status(404).json({ error: 'Product not found or no redirect link available' });
    }
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Error redirecting', details: error.message });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});