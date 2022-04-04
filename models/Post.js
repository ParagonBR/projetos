const postCollection = require('../db').db().collection('posts')
const ObjectID = require('mongodb').ObjectId
const User = require("./User")

class Post {
    constructor(data) {
        this.data = data
        this.errors = []
    }
    async limpeza() {
        if (typeof this.data.title != 'string') {
            this.data.title = ''
        }
        if (typeof this.data.body != 'string') {
            this.data.body = ''
        }
        this.data = {
            title: this.data.title.trim(),
            body: this.data.body.trim(),
            author: ObjectID(this.data.author),
            dataCriacao: new Date()

        }
    }
    async validar() {
        if (this.data.title == '') {
            this.errors.push("O Título da publicação não pode ser vazio")
        }

        if (this.data.body == '') {
            this.errors.push("O Conteúdo da publicação não pode ser vazio")
        }
    }
    async criar() {
        try {
            this.limpeza()
            this.validar()
            if (this.errors.length)
                throw this.errors
            let resposta = await postCollection.insertOne(this.data)
            return {
                resposta
            }
        } catch (error) {
            throw error
        }
    }

}
Post.findByAuthorID = async (id) => {
    try {
        let posts = await Post.getDadosBD([{
                $match: {
                    author: id
                }
            },
            {
                $sort: {
                    dataCriacao: -1
                }
            }
        ])
        return posts
    } catch (error) {
        console.log(error)
        throw error

    }

}
Post.getUnicoPorID = async (id,visitorId) => {
    try {
        if (typeof id != 'string' || !ObjectID.isValid(id)) {
            throw "URL Inválida"
        }
        let posts = await Post.getDadosBD([{
            $match: {
                _id: new ObjectID(id)
            }
        }],visitorId)
        if (posts.length) {
            return posts[0]
        } else {
            throw "Publicação Não Encontrada"
        }
    } catch (error) {
        throw error
    }

}



Post.getDadosBD = async (parametro,visitorId) => {
    try {
        let aggOperations = parametro.concat([{
                $lookup: {
                    from: "usuarios",
                    localField: "author",
                    foreignField: "_id",
                    as: "authorDocument"
                }
            },
            {
                $project: {
                    title: 1,
                    body: 1,
                    dataCriacao: 1,
                    authorId: "$author",
                    author: {
                        $arrayElemAt: ["$authorDocument", 0]
                    }
                }

            }
        ])
        let posts = await postCollection.aggregate(aggOperations).toArray()
        posts = posts.map(post => {
            post.postOwner = post.authorId.equals(visitorId)
            post.author = {
                username: post.author.username,
                avatar: new User(post.author, true).avatar
            }
            return post
        })
        return posts
    } catch (error) {
        throw error
    }

}





module.exports = Post