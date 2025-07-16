const { Product } = require("../models");

const createProduct = async (productData) => {
  try {

    
    const {
      name,
      description,
      image,
      price,
      stock,
      categories,
      variants,
      isActive
    } = productData;

 

    // Limpiar imágenes
    const imageArray = Array.isArray(image)
      ? image
      : typeof image === "string"
      ? image.split(",").map(url => url.trim())
      : [];

    // Preparar variantes sólo si se usan (joyería no las necesita)
    const variantList =
      Array.isArray(variants) && variants.length > 0
        ? variants.filter(v => typeof v === "object" && (v.color || v.size || v.stock !== undefined))
        : undefined;

    // Crear producto adaptado
    const newProduct = new Product({
      name,
      description,
      image: imageArray,
      price,
      stock: stock || 0,
      categories: Array.isArray(categories) ? categories : [],
      ...(variantList ? { variants: variantList } : {}),
      isActive: isActive !== undefined ? isActive : true
    });

    const savedProduct = await newProduct.save();

    return { success: true, product: savedProduct };
  } catch (error) {
    console.error("🧨 Error al crear producto:", error.message);
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

const editProduct = async (productId, productData) => {
  const allowedFields = [
    "name",
    "description",
    "image",
    "price",
    "stock",
    "categories",
    "variants",
    "isActive",
  ];

  const filteredData = {};
  for (const key of allowedFields) {
    if (productData.hasOwnProperty(key)) {
      filteredData[key] = productData[key];
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    filteredData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) throw new Error("Producto no encontrado");

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

module.exports = { createProduct, getAllProducts, editProduct, getAllProductsById };
