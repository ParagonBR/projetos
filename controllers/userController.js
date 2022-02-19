const User =  require("../models/User")

const userCollection = require('../db').collection('users')

exports.login = function (req, res, next) {

}
exports.logout = function (req, res, next) {
    
}
exports.registrar = function (req, res, next) {
    let user = new User(req.body)
    user.registrar()
    if(user.errors.length){
        res.send(user.errors.join("<br>"))
    }else{
        res.send("Success")
    }
}
exports.home = function (req, res, next) {
    res.render('home-guest')
}