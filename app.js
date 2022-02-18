const express = require('express')
const app = express()

app.set('views','views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

app.get("/", (req, res,next) => {
    res.render('home-guest')
})
app.listen(3000)