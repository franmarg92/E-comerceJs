const { Product } = require("../models");

const createProduct = async (productData) => {
  try {
    const {
      articleCode,
      name,
      description,
      images, // 👈 plural
      price,
      cost,
      stock,
      categories,
      subcategories,
      variants,
      isActive,
      isPortfolio,
      featured
    } = productData;

    // Asegurar array
    const imageArray = Array.isArray(images)
      ? images
      : typeof images === 'string'
      ? images.split(',').map((u) => u.trim()).filter(Boolean)
      : [];

    const variantList = Array.isArray(variants)
      ? variants.filter(v => v && (v.color || v.size || v.stock !== undefined))
      : [];

    const totalVariantStock = variantList.reduce((acc, v) => acc + Number(v.stock || 0), 0);

    const newProduct = new Product({
      articleCode,
      name,
      description,
      images: imageArray,     // 👈 guarda en 'images'
      price,
      cost,
      stock: variantList.length ? totalVariantStock : Number(stock || 0),
      categories,
      subcategories,
      ...(variantList.length ? { variants: variantList } : {}),
      isActive: isActive !== undefined ? isActive : true,
      isPortfolio: isPortfolio !== undefined ? isPortfolio : false,
      featured: featured !== undefined ? featured : false,
    });

    const savedProduct = await newProduct.save();
    return { success: true, product: savedProduct };
  } catch (error) {
    console.error('🧨 Error al crear producto:', error.message);
    return { success: false, error: error.message };
  }
};

const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return { success: true, products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const sanitizeProductUpdate = (data) => {
  const allowedFields = [
    "articleCode",
    "name",
    "description",
    "image",
    "price",
    "cost",
    "stock",
    "categories",
    "subcategories",
    "variants",
    "featured",
    "isActive",
    "isPortfolio"
  ];

  const sanitized = {};

  // Asegurar que el objeto tenga prototipo normal
  const source = { ...data };

  for (const key of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      sanitized[key] = source[key];
    }
  }

  // Imagen: limpieza y normalización
  if (sanitized.image) {
    if (Array.isArray(sanitized.image)) {
      sanitized.image = sanitized.image
        .map((img) => img.trim())
        .filter(Boolean);
    } else if (
      typeof sanitized.image === "string" &&
      sanitized.image.trim() !== ""
    ) {
      sanitized.image = [sanitized.image.trim()];
    } else {
      delete sanitized.image;
    }
  }

  // Validación de tipos simples
  if (sanitized.price && isNaN(Number(sanitized.price))) {
    throw new Error("El precio debe ser un número válido");
  }

  if (sanitized.stock && isNaN(Number(sanitized.stock))) {
    throw new Error("El stock debe ser un número válido");
  }

  return sanitized;
};

const editProduct = async (productId, productData) => {
  const filteredData = sanitizeProductUpdate(productData);



  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    filteredData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    throw new Error("Producto no encontrado");
  }

  return updatedProduct;
};

const getAllProductsById = async (_id) => {
  try {
    const product = await Product.findById(_id);
    return { success: true, product };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getFeaturedProduct = async () => {
  try {
    const featuredProducts = await Product.find({
      featured: true,
      isActive: true,
    });
    return { success: true, featuredProducts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const getPortfolio = async () => {
  try {
    const portfolioProducts = await Product.find({
      isPortfolio: true,
      isActive: true,
    });
    return { success: true, portfolioProducts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const decreaseStock = async (productId, quantity) => {
  const product = await Product.findByPk(productId);
  if (product) {
    product.stock = Math.max(product.stock - quantity, 0);
    await product.save();
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  editProduct,
  getAllProductsById,
  getFeaturedProduct,
  getPortfolio,
  decreaseStock
};
