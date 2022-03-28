const bcrypt = require('bcrypt')

const validator = require('validator').default

const userCollection = require('../db').db().collection('usuarios')

const md5 = require('md5')

class User {
    constructor(data, getAvatar = false) {
        this.data = data
        this.errors = []
        if (getAvatar == true) {
            this.getAvatar()
        }
    }
    async registrar() {
        try {
            this.limpeza()
            await this.validar()
            if (!this.errors.length) {
                // Hash de senha 
                let salt = bcrypt.genSaltSync(10)
                this.data.password = bcrypt.hashSync(this.data.password, salt)
                await userCollection.insertOne(this.data)
                this.getAvatar()
                return this.data.username
            } else {
                throw this.errors
            }
        } catch (err) {
            throw err
        }

    }
    limpeza() {
        if (typeof this.data.username != "string") {
            this.data.username = ""
        }
        if (typeof this.data.email != "string") {
            this.data.email = ""
        }
        if (typeof this.data.password != "string") {
            this.data.password = ""
        }

        // Tratando solicitação para ter somente dados do login
        this.data = {
            username: this.data.username.trim().toLowerCase(),
            email: this.data.email.trim().toLowerCase(),
            password: this.data.password
        }
    }

    async validar() {
        if (this.data.username == "") {
            this.errors.push("Usuário é obrigatorio")
        }
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
            this.errors.push("Usuário deve conter apenas letras e numeros")
        }
        if (!validator.isEmail(this.data.email)) {
            this.errors.push("Email invalido")
        }
        if (this.data.password == "") {
            this.errors.push("Senha é obrigatorio")
        }
        if (this.data.password.length > 0 && this.data.password.length < 12) {
            this.errors.push("Sua senha deve ter no minimo 12 caracteres")
        }
        if (this.data.password.length > 50) {
            this.errors.push("Sua senha deve ter no maximo 100 caracteres")
        }
        if (this.data.username.length > 0 && this.data.username.length < 3) {
            this.errors.push("Seu Usuário deve ter no minimo 3 caracteres")
        }
        if (this.data.username.length > 30) {
            this.errors.push("Seu Usuário deve ter no maximo 30 caracteres")
        }

        // Verificação de Usuário e email unico

        if (this.data.username.length > 2 && this.data.password.length < 31 && validator.isAlphanumeric(this.data.username)) {
            let userExists = await userCollection.findOne({
                username: this.data.username
            })
            if (userExists) {
                this.errors.push("Usuário já existe")
            }
        }
        if (validator.isEmail(this.data.email)) {
            let emailExists = await userCollection.findOne({
                email: this.data.email
            })
            if (emailExists) {
                this.errors.push("Email já existe")
            }
        }

    }

    async login() {
        try {
            this.limpeza()
            let resposta = await userCollection.findOne({
                username: this.data.username
            })
            console.trace(resposta)
            if (resposta && bcrypt.compareSync(this.data.password, resposta.password)) {
                this.data = resposta
                this.getAvatar()
                return "Login efetuado com sucesso, Usuário: " + this.data.username
            } else {
                throw "Usuário e/ou senha inválidos"
            }
        } catch (err) {
            throw "Problema ao logar: " + err
        }
    }
    getAvatar() {
        this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`
    }
}



User.findByUsername = async (username) => {
    try {
        if (typeof username != 'string') {
            throw "Url informada não é texto puro"
        }
        let usuario = await userCollection.findOne({
            username
        })
        if (usuario) {
            usuario = new User(usuario, true)
            usuario = {
                _id: usuario.data._id,
                username: usuario.data.username,
                avatar: usuario.avatar
            }
            return usuario
        } else {
            throw "Usuário não encontrado"
        }
    } catch (error) {
        throw error
    }
}
module.exports = User