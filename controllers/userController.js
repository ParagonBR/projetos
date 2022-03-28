const User = require("../models/User")

const Post = require("../models/Post")

exports.login = async function (req, res) {
    let user = new User(req.body)
    try {
        let resultado = await user.login()
        req.session.user = {
            username: user.data.username,
            avatar: user.avatar,
            _id: user.data._id
        }
        console.trace(resultado)
        req.session.save(() => res.redirect('/'))
    } catch (err) {
        req.flash('erros', err)
        req.session.save(() => {
            res.redirect('/')
        })
        console.trace(err)
    }
}
exports.logout = function (req, res) {
    req.session.destroy(() => {
        res.redirect('/')
    })

}
exports.registrar = async function (req, res) {
    let user = new User(req.body)
    try {
        let resultado = await user.registrar()
        req.session.user = {
            username: resultado,
            avatar: user.avatar,
            _id: user.data._id
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
exports.home = function (req, res) {
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
    if (req.session.user) {
        next()
    } else {
        req.flash('erros', "Você deve estar logado para visualizar a página")
        req.session.save(() => {
            res.redirect('/')
        })
    }
}
exports.userExists = async (req, res, next) => {
    try {
        let resposta = await User.findByUsername(req.params.username)
        req.perfil = resposta
        console.trace(resposta)
        next()
    } catch (error) {
        res.render('404', {
            erro: error
        })
    }
}

exports.profilePostsScreen = async (req, res, next) => {

    try {
        let posts = await Post.findByAuthorID(req.perfil._id)
        console.trace(posts)
        res.render('profile-posts', {
            ...{
                perfil: req.perfil
            },
            posts
        })
    } catch (error) {
        res.render('404', {
            erro: error
        })
    }



}