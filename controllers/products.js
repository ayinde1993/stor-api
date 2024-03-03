// const product = require('../models/product')
const Product = require('../models/product')
const { search } = require('../routes/products')

const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(201).json({msg: `product create with succes `})
    } catch (error) {
        res.status(500).json({msg: error})
    }
}

// const getAllProductsStatic = async (req, res) =>{
   
//     // const products = await Product.find({}).sort('-name price')
//     const products = await Product.find({price:{$gt:30}})
//     .sort('price')
//     .select('name price')
//     .limit(10)
//      res.status(200).json({products, nbHits: products.length})
//   //res.status(200).json({msg: 'products testing route'})
// }

const getAllProducts = async (req, res) =>{

    const {featured,company,name,sort,fields, numericFilters} = req.query
    const queryObject = {}
    if(featured) {
        queryObject.featured = featured === 'true'? true: false
    }
    if(company) {
        queryObject.company = company 
    }
    if(name) {
        queryObject.name = {$regex: name, $options: 'i' }
    }

    if (numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=|)\b/g
        let filters = numericFilters.replace(
            regEx,
            (match) => `-${operatorMap[match]}-`
        )
        const options = ['price', 'rating']
        filters = filters.split(',').forEach((item) =>{
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    let result =  Product.find(queryObject)
    if(sort) {
        const sortList  = sort.split(',').join()
      
         result = result.sort(sortList)
    } else{
        result = result.sort('creatAt')
    }

    if(fields) {
        const fieldsList  = fields.split(',').join()
      
         result = result.select(fieldsList)
    }
    

    // const page = Number(req.query.page) || 1
    // const limit = Number(req.query.limit) || 10
    // const skip = (page-1) * limit

    // result = result.skip(skip).limit(limit)
    const products = await result
    // const products = await product.find(queryObject)

    res.status(200).json({products, nbHits: products.length})

  }
  
  const updateProduct = async (req, res) =>{
    try {
        const {id: ProductID} = req.params

        const product = await Product.findOneAndUpdate({_id: ProductID}, req.body)

        if (!product) {
            return res.status(404).json({msg: `No product with id: ${ProductID}`})
        }
        res.status(200).json({msg: ` Product update  with Success ${product}`})
    } catch (error) {
        res.status(500).json({msg: error})
        
    }
  }


  const deleteProduct = async (req, res) =>{
    try {
        const {id: ProductID} = req.params;
        const product = await Product.findOneAndDelete({_id:ProductID})
        if (!product) {
            return res.status(404).json({msg: `No product with id: ${ProductID}`})
        }

        res.status(200).json({msg: `Product delete with succes`})
        
    } catch (error) {
        res.status(500).json({msg: error})
    }
  }

  module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
   
    // getAllProductsStatic,
  }