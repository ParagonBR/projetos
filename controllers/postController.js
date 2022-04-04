const Post = require("../models/Post")

exports.viewCreateScreen = (req, res, next) => {
    res.render('create-post')
}

exports.criarPost = async (req, res, next) => {
    let post = new Post({
        ...req.body,
        author: req.session.user._id
    })
    try {
        let publicacao = await post.criar()
        console.trace(publicacao)
        res.redirect('/post/' + publicacao.resposta.insertedId)

    } catch (error) {
        console.error(error)
        res.send(error)
    }
}
exports.visualizarPost = async (req, res) => {
    try {
        let post = await Post.getUnicoPorID(req.params.id,req.visitorId)
        res.render('post', {
            post
        })
    } catch (error) {
        console.trace(error)
        res.render('404', {
            erro: error
        })
    }
}