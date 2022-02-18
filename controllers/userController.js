

exports.login = function (req, res, next) {

}
exports.logout = function (req, res, next) {
    
}
exports.registrar = function (req, res, next) {
    res.send(JSON.stringify(req.body))
}
exports.home = function (req, res, next) {
    res.render('home-guest')
}