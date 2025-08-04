const { productService } = require("../services");

const { procesarImagen } = require("../utils/procesarImagen");

const createProductController = async (req, res) => {
  try {
    const productData = req.body.product || req.body;

    console.log("📦 Datos recibidos del frontend:");
    console.dir(productData, { depth: null });

    if (req.file) {
      const imagenUrl = await procesarImagen(req.file, req);
      productData.image = [imagenUrl];

      console.log("🖼️ Imagen procesada:", imagenUrl);
    }

    const result = await productService.createProduct(productData);

    if (!result.success) {
      console.warn("⚠️ Error en creación de producto:", result.error);
      return res.status(400).json({ error: result.error });
    }

    console.log("✅ Producto creado:", result.product);

    return res.status(201).json({
      message: "Producto creado correctamente",
      product: result.product,
    });
  } catch (error) {
    console.error(
      "💥 Error en controlador de creación de producto:",
      error.message
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getAllProductsController = async (req, res) => {
  try {
    const result = await productService.getAllProducts();

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json(result.products);
  } catch (error) {
    console.error(
      "Error en controlador de obtención de productos:",
      error.message
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const editProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (req.file) {
      const imagenUrl = await procesarImagen(req.file, req);
      productData.image = [imagenUrl];
    }

    const updated = await productService.editProduct(id, productData);

    res.status(200).json({
      message: "Producto actualizado correctamente",
      product: updated,
    });
  } catch (error) {
    console.error("Error al editar producto:", error.message);

    res.status(500).json({
      error: "No se pudo editar el producto",
      details: error.message,
    });
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const id = req.params.id;
    const findProduct = await productService.getAllProductsById(id);
    res.status(200).json(findProduct);
  } catch (error) {
    console.error(
      "Error en controlador de obtención de productos:",
      error.message
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getFeaturedProductController = async (req, res) => {
  try {
    const result = await productService.getFeaturedProduct();
    res.status(200).json(result.featuredProducts);
  } catch (err) {
    console.error("Error al obtener destacados:", err.message);
    res
      .status(500)
      .json({ error: "No se pudieron cargar los productos destacados." });
  }
};

const getIsPorfolioController = async (req, res) => {
  try {
    const result = await productService.getPortfolio();
    res.status(200).json(result.portfolioProducts);
  } catch (err) {
    console.error("Error al obtener destacados:", err.message);
    res
      .status(500)
      .json({ error: "No se pudieron cargar los productos destacados." });
  }
};

module.exports = {
  createProductController,
  getAllProductsController,
  editProductController,
  getProductByIdController,
  getFeaturedProductController,
  getIsPorfolioController
};
