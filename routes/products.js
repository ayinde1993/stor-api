const express = require('express')
const router = express.Router()

const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
   
    // getAllProductsStatic,

} = require('../controllers/products')

router.route('/').get(getAllProducts).post(createProduct)
// router.route('/static').get(getAllProductsStatic)
router.route('/:id')
// .get(getTask)
.patch(updateProduct)
.delete(deleteProduct)



module.exports = router