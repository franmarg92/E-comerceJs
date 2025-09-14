const { productService } = require("../services");

const { procesarImagen } = require("../utils/procesarImagen");

// create product

const createProductController = async (req, res) => {
  try {
    // Si el front te manda todo suelto en form-data:
    const productData = req.body.product || req.body;

    // ⚙️ Parsear existingImages (JSON string) si viene
    const existing = JSON.parse(productData.existingImages || '[]');

    // 🖼️ Procesar **TODAS** las imágenes subidas
    const files = Array.isArray(req.files) ? req.files : [];
    const newUrls = await Promise.all(files.map((f) => procesarImagen(f, req)));

    // 📦 Unificar
    productData.images = [...existing, ...newUrls];

    // 🧩 Variantes: dos opciones de entrada
    // (A) Si el front manda variants como JSON string:
    if (typeof productData.variants === 'string') {
      try {
        productData.variants = JSON.parse(productData.variants);
      } catch (_) {
        // si falla, dejamos que pase a (B)
      }
    }

    // (B) Si vienen como keys tipo variants[0][color], armarlas:
    if (!Array.isArray(productData.variants)) {
      const variants = [];
      Object.keys(req.body).forEach((k) => {
        const m = k.match(/^variants\[(\d+)\]\[(color|size|stock)\]$/);
        if (m) {
          const idx = Number(m[1]);
          variants[idx] = variants[idx] || {};
          variants[idx][m[2]] = m[2] === 'stock' ? Number(req.body[k]) : req.body[k];
        }
      });
      productData.variants = variants.filter(Boolean);
    }

    console.log('📦 Datos finales a crear:', productData);

    const result = await productService.createProduct(productData);

    if (!result.success) {
      console.warn('⚠️ Error en creación de producto:', result.error);
      return res.status(400).json({ error: result.error });
    }

    console.log('✅ Producto creado:', result.product);
    return res.status(201).json({
      message: 'Producto creado correctamente',
      product: result.product,
    });
  } catch (error) {
    console.error('💥 Error en controlador de creación de producto:', error.message);
    return res.status(500).json({ error: 'Error interno del servidor' });
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
