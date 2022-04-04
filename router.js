const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')

router.post("/login",userController.login)

router.post("/logout",userController.logout)

router.get('/',userController.home)

router.post("/registrar",userController.registrar)

router.get('/criar_post',userController.sessaoAtiva,postController.viewCreateScreen)

router.post('/criar_post',userController.sessaoAtiva,postController.criarPost)

router.get("/post/:id",postController.visualizarPost)

router.get('/post/:id/editar',(req, res) => {
    res.send(req.params)
})

router.get('/perfil/:username',userController.userExists,userController.profilePostsScreen)

router.get('*', function(req, res){
    res.status(404).render('404',{erro:"Página não encontrada"})
})
module.exports = router