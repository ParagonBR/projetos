const User = require("../models/User")



exports.login = async function (req, res, next) {
    let user = new User(req.body)
    try {
        let resultado = await user.login()
        req.session.user = {
            username: user.data.username,
            avatar: user.avatar
        }
        console.log(resultado)
        req.session.save(() => res.redirect('/'))
    } catch (err) {
        req.flash('erros', err)
        req.session.save(() => {
            res.redirect('/')
        })
        console.log(err)
    }
}
exports.logout = function (req, res, next) {
    req.session.destroy(() => {
        res.redirect('/')
    })

}
exports.registrar = async function (req, res, next) {
    let user = new User(req.body)
    try {
        let resultado = await user.registrar()
        req.session.user = {
            username : resultado,
            avatar: user.avatar
        }
        req.session.save(() => {
            res.redirect('/')
        })
    } catch (err) {
        req.flash('regErrors', [].concat(err))
        req.session.save(() => {
            res.redirect('/')
        })
    }
}
exports.home = function (req, res, next) {
    if (req.session.user) {
        res.render('home-dashboard')
    } else {
        res.render('home-guest', {
            erros: req.flash('erros'),
            regErrors: req.flash('regErrors')
        })

    }

}

exports.sessaoAtiva = (req, res, next) => {
    if(req.session.user) {
        next()
    }
    else{
        req.flash('erros',"Você deve estar logado para visualizar a página")
        req.session.save(()=>{
            res.redirect('/')
        })
    }
}