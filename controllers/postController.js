const Post = require("../models/Post")

exports.viewCreateScreen = (req, res, next) => {
    res.render('create-post')
} 

exports.criarPost = async (req, res, next) => {
    let post = new Post(req.body)
    try {
        let publicacao = await post.criar()
        res.send(publicacao)

    } catch (error) {
        console.error(error)
        res.send(error)
    }
}
