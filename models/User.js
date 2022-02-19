const validator = require('validator')
class User {
    constructor(data){
        this.data = data
        this.errors = []
    }
    registrar() {
        this.validar()
    }
    validar (){
        if (this.data.username == ""){
            this.errors.push("Usuario é obrigatorio")
        }
        if (this.data.email == ""){
            this.errors.push("Email é obrigatorio")
        }
        if (this.data.password == ""){
            this.errors.push("Senha é obrigatorio")
        }
        if (this.data.password.length > 0 && this.data.password.length < 12){
            this.errors.push("Sua senha deve ter no minimo 12 caracteres")
        }
        if (this.data.password.length > 100){
            this.errors.push("Sua senha deve ter no maximo 100 caracteres")
        }
        if (this.data.username.length > 0 && this.data.username.length < 3){
            this.errors.push("Seu Usuario deve ter no minimo 3 caracteres")
        }
        if (this.data.password.length > 30){
            this.errors.push("Seu Usuario deve ter no maximo 100 caracteres")
        }
    }
}

module.exports = User