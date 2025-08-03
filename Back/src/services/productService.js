const { Product } = require("../models");

const createProduct = async (productData) => {
  try {
    const {
      articleCode,
      name,
      description,
      image,
      price,
      stock,
      categories,
      subcategories,
      variants,
      isActive,
    } = productData;

    // Limpiar imágenes
    const imageArray = Array.isArray(image)
      ? image
      : typeof image === "string"
      ? image.split(",").map((url) => url.trim())
      : [];

    // Preparar variantes sólo si se usan (joyería no las necesita)
    const variantList =
      Array.isArray(variants) && variants.length > 0
        ? variants.filter(
            (v) =>
              typeof v === "object" &&
              (v.color || v.size || v.stock !== undefined)
          )
        : undefined;

    // Crear producto adaptado
    const newProduct = new Product({
      articleCode,
      name,
      description,
      image: imageArray,
      price,
      stock: stock || 0,
      categories:  categories ,
      subcategories:  subcategories ,
      ...(variantList ? { variants: variantList } : {}),
      isActive: isActive !== undefined ? isActive : true,
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
    "articleCode",
    "name",
    "description",
    "image",
    "price",
    "stock",
    "categories",
    "subcategories",
    "variants",
    "featured",
    "isActive",
  ];

  const filteredData = {};

  for (const key of allowedFields) {
    if (productData.hasOwnProperty(key)) {
      filteredData[key] = productData[key];
    }
  }

  // Validar imagen si viene como string y convertirla a array (por consistencia)
  if (
    typeof filteredData.image === "string" &&
    filteredData.image.trim() !== ""
  ) {
    filteredData.image = [filteredData.image.trim()];
  }
console.log("🟡 Data original recibida:", productData);
  console.log("🟢 Data filtrada para actualizar:", filteredData);
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

module.exports = {
  createProduct,
  getAllProducts,
  editProduct,
  getAllProductsById,
  getFeaturedProduct,
};
