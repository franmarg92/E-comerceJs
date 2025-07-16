const {productService} = require("../services");

const createProductController = async (req, res) => {
  try {
    const productData = req.body.product || req.body;


    const result = await productService.createProduct(productData);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({
      message: "Producto creado correctamente",
      product: result.product,
    });
  } catch (error) {
    console.error(
      "Error en controlador de creación de producto:",
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
    const editProduct = req.body.product;
    const updated = await productService.editProduct(
      editProduct.productId,
      editProduct
    );
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
    const findProduct = await productService.getAllProductsById(id)
    res.status(200).json(findProduct)
  } catch (error) {
     console.error(
      "Error en controlador de obtención de productos:",
      error.message
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
  
}

module.exports = {
  createProductController,
  getAllProductsController,
  editProductController,
  getProductByIdController
};
