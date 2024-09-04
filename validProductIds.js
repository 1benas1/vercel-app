// Array to store valid product IDs
const validProductIds = [
  '12345',
  '67890',
  '00005',
  '00006',
  '00007',
  '00008',
  // Add more valid IDs here
];

// Function to check if a product ID is valid
function isValidProductId(id) {
  return validProductIds.includes(id);
}

// Function to add a new valid product ID
function addValidProductId(id) {
  if (id.length === 5 && /^\d+$/.test(id) && !validProductIds.includes(id)) {
    validProductIds.push(id);
    return true;
  }
  return false;
}

module.exports = {
  isValidProductId,
  addValidProductId
};