const User =  require("../models/User")



exports.login = async function (req, res, next) {
    let user = new User(req.body)
    try{
        let resultado = await user.login()
        req.session.user = {
            username: user.data.username,    
        }
        console.log(req.session)
        res.redirect('/')
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
}
exports.logout = function (req, res, next) {
    req.session.user = null
    res.redirect('/')

}
exports.registrar = async function (req, res, next) {
    let user = new User(req.body)
    let resultado = await user.registrar()
    res.send(resultado)
}
exports.home = function (req, res, next) {
    if(req.session.user){
        res.render('home-logged-in-no-results',{user: req.session.user.username})
    }
    else{
        res.render('home-guest')

    }
}