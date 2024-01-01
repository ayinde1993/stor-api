const product = require('../models/product')
const Product = require('../models/product')
const { search } = require('../routes/products')

const getAllProductsStatic = async (req, res) =>{
   
    // const products = await Product.find({}).sort('-name price')
    const products = await Product.find({price:{$gt:30}})
    .sort('price')
    .select('name price')
    .limit(10)
     res.status(200).json({products, nbHits: products.length})
  //res.status(200).json({msg: 'products testing route'})
}

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
        const regEX = /\b(<|>|>=|=|<|<=|)\b/g
        let filters = numericFilters.replace(
            regEX,
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

    let result =  product.find(queryObject)
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
    

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit

    //result = result.skip(skip).limit(limit)
    const products = await result
    // const products = await product.find(queryObject)

    res.status(200).json({products, nbHits: products.length})

  }

  module.exports = {
    getAllProducts,
    getAllProductsStatic,
  }