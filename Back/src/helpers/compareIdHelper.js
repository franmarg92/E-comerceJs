const compareProductIds = (a, b) => {
  const idA = typeof a === 'object' && a._id ? a._id.toString() : a.toString();
  const idB = typeof b === 'object' && b._id ? b._id.toString() : b.toString();
  return idA === idB;
};

module.exports={compareProductIds}