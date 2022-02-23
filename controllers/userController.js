const User =  require("../models/User")



exports.login = async function (req, res, next) {
    let user = new User(req.body)
    let resultado = await user.login()
    console.log(resultado)
    res.send(resultado)

}
exports.logout = function (req, res, next) {
    
}
exports.registrar = async function (req, res, next) {
    let user = new User(req.body)
    let resultado = await user.registrar()
    res.send(resultado)
}
exports.home = function (req, res, next) {
    res.render('home-guest')
}