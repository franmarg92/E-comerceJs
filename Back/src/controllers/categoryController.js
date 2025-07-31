const { categoryService } = require("../services");

const getAllCategoriesController = async (req, res) => {
  try {
    const result = await categoryService.getAllCategories();

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      success: true,
      message: "Categorías obtenidas correctamente",
      categories: result.categories,
    });
  } catch (error) {
    console.error(
      "Error en controlador de obtención de categorías:",
      error.message
    );

    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const createCategoryController = async (req, res) => {
  try {
    const categoryData = req.body;
    const result = await categoryService.createCategory(categoryData);
    if (!categoryData.name) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(201).json({
      message: "Categoria creada correctamente",
      category: result.category,
    });
  } catch (error) {
    console.error(
      "Error en controlador de creación de la categoria:",
      error.message
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getSubcategoriesController = async (req, res) => {
  const { parentId } = req.params;

  const result = await categoryService.getSubCategories(parentId);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
};

module.exports = { getAllCategoriesController, createCategoryController, getSubcategoriesController };
