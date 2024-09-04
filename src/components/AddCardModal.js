import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';

const AddCardModal = ({ open, onClose, onSave }) => {
  const { user } = useUser();
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [redirectLink, setRedirectLink] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const handleSave = async () => {
    const productData = {
      productId,
      userId: user.id,
      name: productName,
      businessName: selectedBusiness ? selectedBusiness.name : businessName,
      redirectLink: selectedBusiness
        ? `https://search.google.com/local/writereview?placeid=${selectedBusiness.place_id}`
        : redirectLink,
    };

    try {
      const response = await axios.post('/api/products', productData);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.error || 'Error saving product');
    }
  };

  const handleBusinessNameChange = async (e) => {
    const input = e.target.value;
    setBusinessName(input);

    if (input.length > 2) {
      try {
        const response = await axios.get(`/api/places/autocomplete?input=${input}`);
        setSuggestions(response.data.predictions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectBusiness = async (business) => {
    setBusinessName(business.description);
    setSuggestions([]);

    try {
      const response = await axios.get(`/api/places/details?placeId=${business.place_id}`);
      const placeDetails = response.data.result;
      setSelectedBusiness({
        name: placeDetails.name,
        address: placeDetails.formatted_address,
        place_id: business.place_id,
        photo: placeDetails.photos && placeDetails.photos[0].photo_reference,
      });
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const handleProductIdChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    setProductId(value);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add a new product</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="productId"
          label="Product ID (5-digit code)"
          type="text"
          fullWidth
          value={productId}
          onChange={handleProductIdChange}
          inputProps={{ maxLength: 5 }}
        />
        <TextField
          margin="dense"
          id="productName"
          label="Product Name"
          type="text"
          fullWidth
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <TextField
          margin="dense"
          id="businessName"
          label="Business Name"
          type="text"
          fullWidth
          value={businessName}
          onChange={handleBusinessNameChange}
        />
        {suggestions.length > 0 && (
          <List>
            {suggestions.map((suggestion) => (
              <ListItem
                key={suggestion.place_id}
                button
                onClick={() => handleSelectBusiness(suggestion)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Search />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={suggestion.description} />
              </ListItem>
            ))}
          </List>
        )}
        {selectedBusiness && (
          <div>
            <Typography variant="subtitle1">Selected Business:</Typography>
            <Typography>{selectedBusiness.name}</Typography>
            <Typography>{selectedBusiness.address}</Typography>
            {selectedBusiness.photo && (
              <img
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${selectedBusiness.photo}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`}
                alt={selectedBusiness.name}
                style={{ maxWidth: '100%', marginTop: '10px' }}
              />
            )}
          </div>
        )}
        {!selectedBusiness && (
          <TextField
            margin="dense"
            id="redirectLink"
            label="Redirect Link (optional)"
            type="text"
            fullWidth
            value={redirectLink}
            onChange={(e) => setRedirectLink(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCardModal;