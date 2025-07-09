const {Product} = require('../models')


const createProduct = async (productData) => {

    const newProduct = new Product(productData)
    await newProduct.save();
    return {success: true, product : newProduct}
}


const getAllProducts = async () => {
    const products = await Product.find();
    return products
}



module.exports = {createProduct, getAllProducts}