require ('dotenv').config()

const connectDB = require('./db/connect')
const Product  = require('./models/product')

const jsonProducts = require('./products.json')

const start = async () =>{
    try {
        await connectDB (process.env.MONGO_URI)
        await Product.deleteMany() //pour supprimer les data existant s'il y en a biensur 
        await Product.create(jsonProducts) // ajouter les data du fichier products.json dans notre DB
        console.log('success !!!')
        process.exit(0)//pour eviter la redondance (doublure des data)
    } catch (error) {
        console.log('error')
    }
}

start()