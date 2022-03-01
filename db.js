const mongodb = require('mongodb').MongoClient
const env = require('dotenv')
env.config()
 mongodb.connect(process.env.URL_BANCO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},  (err, client) => {
   module.exports = client
   const app = require('./app')
   app.listen(process.env.PORT)
}) 