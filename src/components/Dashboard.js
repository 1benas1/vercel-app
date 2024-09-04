import React, { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/clerk-react';
import { 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton, 
  Link,
  Box,
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, FileCopy as FileCopyIcon } from '@mui/icons-material';
import AddCardModal from './AddCardModal';
import EditProductModal from './EditProductModal';
import axios from 'axios';

function Dashboard() {
  const { user } = useUser();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/api/products/${user.id}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };

  const handleSaveProduct = (productData) => {
    setProducts([...products, productData]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.productId === updatedProduct.productId ? updatedProduct : p));
  };

  const handleCopyLink = (productId) => {
    const link = `${window.location.origin}/redirect/${productId}`;
    navigator.clipboard.writeText(link);
    setSnackbarMessage('Link copied to clipboard!');
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          NFC Google Review Products
        </Typography>
        <UserButton />
      </Box>
      <Button variant="contained" color="primary" onClick={handleOpenAddModal} sx={{ mb: 4 }}>
        Add New Product
      </Button>
      <AddCardModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSave={handleSaveProduct}
      />
      {selectedProduct && (
        <EditProductModal
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleUpdateProduct}
          product={selectedProduct}
        />
      )}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.productId}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {product.productId}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Business: {product.businessName}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton size="small" onClick={() => handleOpenEditModal(product)}>
                  <EditIcon />
                </IconButton>
                <IconButton size="small" onClick={() => handleCopyLink(product.productId)}>
                  <FileCopyIcon />
                </IconButton>
                <Link 
                  href={`/redirect/${product.productId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  underline="none"
                >
                  <Button size="small">Open</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default Dashboard;