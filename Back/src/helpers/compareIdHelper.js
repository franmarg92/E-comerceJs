const compareProductIds = (a, b) => {
  const idA = typeof a === 'object' && a._id ? a._id.toString() : a.toString();
  const idB = typeof b === 'object' && b._id ? b._id.toString() : b.toString();
  return idA === idB;
};



const normalizeProductIds = (product) => {
  if (!product) return '';
  if (typeof product === 'object' && product._id) return product._id.toString();
  return product.toString?.() || '';
};
module.exports={compareProductIds, normalizeProductIds}