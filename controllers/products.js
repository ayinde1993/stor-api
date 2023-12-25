const product = require('../models/product')
const Product = require('../models/product')

const getAllProductsStatic = async (req, res) =>{
    const products = await Product.find({
        name :'utopia sofa'
      //  featured:  true,
    })
     res.status(200).json({products, nbHits: products.length})
  //res.status(200).json({msg: 'products testing route'})
}

const getAllProducts = async (req, res) =>{
    const {featured} = req.query
    const queryObject = {}
    if(featured) {
        queryObject.featured = featured === 'true'? true: false
    }
    console.log(queryObject)
    const products = await product.find(queryObject)
    res.status(200).json({products, nbHits: products.length})

  }

  module.exports = {
    getAllProducts,
    getAllProductsStatic,
  }