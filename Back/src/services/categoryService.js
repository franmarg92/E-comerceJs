const { Category } = require("../models");
const mongoose = require("mongoose");

const createCategory = async (categoryData) => {
  try {
    const { name, description, image, parent } = categoryData;

    // Validar nombre obligatorio
    if (!name) {
      throw new Error("El nombre de la categoría es obligatorio");
    }

    // Validar que el nombre no esté duplicado
    const exists = await Category.findOne({ name });
    if (exists) {
      throw new Error("Ya existe una categoría con ese nombre");
    }

    // Si tiene un parent, validar que sea un ObjectId válido y exista
    if (parent) {
      if (!mongoose.Types.ObjectId.isValid(parent)) {
        throw new Error("ID de categoría padre inválido");
      }

      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        throw new Error("La categoría padre no existe");
      }
    }

    // Crear la nueva categoría
    const newCategory = new Category({
      name,
      description,
      image,
      parent: parent || null,
    });

    await newCategory.save();
    return { success: true, category: newCategory };
  } catch (error) {
    console.error("Error al crear categoría:", error.message);
    return { success: false, error: error.message };
  }
};

const getAllCategories = async () => {
  try {
    const categories = await Category.find({ parent: { $in: [null, undefined] } });
    return { success: true, categories };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


const getSubCategories = async (parentId) => {

  try {
     const subcategories = await Category.find({ parent: parentId });
     return { success: true, subcategories };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
module.exports = { createCategory, getAllCategories, getSubCategories };
