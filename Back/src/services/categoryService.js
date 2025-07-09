const {Category} = require('../models')

const createCategory = async (categoryData) => {
     const newCategory = new Category(categoryData)
     await newCategory.save();
     return{ success: true, category : newCategory}
    
}

const getAllCategories = async () => {
  
    const categories = await Category.find();
    return categories;
  
};


module.exports = { createCategory, getAllCategories}