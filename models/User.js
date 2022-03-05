const bcrypt = require('bcrypt')

const validator = require('validator').default

const userCollection = require('../db').db().collection('usuarios')
class User {
    constructor(data) {
        this.data = data
        this.errors = []
    }
    async registrar() {
        try {
            this.limpeza()
            this.validar()
            if (!this.errors.length) {
                // Hash de senha 
                let salt = bcrypt.genSaltSync(10)
                this.data.password = bcrypt.hashSync(this.data.password, salt)
                await userCollection.insertOne(this.data)
                return "Sucesso"
            } else {
                throw this.errors
            }
        } catch (err) {
            throw  err
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

    validar() {
        if (this.data.username == "") {
            this.errors.push("Usuario é obrigatorio")
        }
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
            this.errors.push("Usuario deve conter apenas letras e numeros")
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
            this.errors.push("Seu Usuario deve ter no minimo 3 caracteres")
        }
        if (this.data.username.length > 30) {
            this.errors.push("Seu Usuario deve ter no maximo 30 caracteres")
        }
    }

    async login() {
        try {
            this.limpeza()
            let resposta = await userCollection.findOne({
                username: this.data.username
            })
            if (resposta && bcrypt.compareSync(this.data.password, resposta.password)) {
                return "Login efetuado com sucesso, Usuario: " + this.data.username
            } else {
                throw "Usuário e/ou senha inválidos"
            }
        } catch (err) {
            throw "Problema ao logar: " + err
        }
    }
}

module.exports = User