const db = require('../models/db')
const express = require('express')
const usuarioDb = require('../models/Usuario')
const bcrypt = require('bcryptjs')
const router = express.Router()
const passport = require('passport')


router.get('/registro', (req,res)=>{
    res.render("usuarios/registro")
})

router.post('/registrando', (req, res)=>{
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido."})
    }
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email inválido."})
    }
    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha inválida."})
    }
    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senha são diferentes, tente novamente"})
    }

    if(erros.length>0){
        res.render('usuarios/registro', {erros: erros})
    } else{
        usuarioDb.findOne({where: {email: req.body.email}}).then((usuario)=>{
            if(usuario){
                req.flash("error_msg", "Email já cadastrado!")
                res.redirect('/user/registro')
            }else{
                var senhaHash = req.body.senha 
                bcrypt.genSalt(10, (erro, salt)=>{
                    bcrypt.hash(senhaHash, salt, (erro, hash)=>{
                        if(erro){
                            req.flash("error_msg", "Houve um erro ao salvar")
                            res.redirect("/")
                        }else{
                            senhaHash = hash
                            usuarioDb.create({
                                nome: req.body.nome,
                                email: req.body.email,
                                eAdmin: 1,
                                // Criarção de rash para não deixar visivel no BD
                                senha: senhaHash
                            }).then(()=>{
                                req.flash("success_msg", "Cadastro realizado com sucesso")
                                res.redirect("/admin/postagens")

                            })
                        }
                    })
                })
            }
        })        
    }   
})

router.get('/error',(req,res)=>{
    res.render('usuarios/error404')
})


router.get('/login', (req,res,next)=>{
    res.render('usuarios/login')
})


router.post("/logindb",  passport.authenticate('local', {
        failureRedirect: "/user/login", 
        // successRedirect: "/admin/postagens", 
        failureFlash: true}), (req,res,next)=>{
        console.log(req.user)
        res.redirect('/admin/postagens')
        
        })

        // router.get('/teste2', (req,res)=>{
        //     usuarioDb.create({
        //         titulo: 'dfghdfhgdfh',
        //         slug:   'aeflkgvnçrejg',
        //         eAdmin: 1,
        //         descricao: 'fçdkjgndfçgklndfçhlkdfnhçlfnd',
        //         conteudo: 'çsdljvbsdlvjbsdçkjvbsdçvkjsbdvwjbvspkdjvbsadçjvlkbsdkvjsb~kladfnb',
        //         categoriaId: 66 
        //     }).then(()=>{
        //         res.send("cadastro com sucesso")
        //     })
        //     })




module.exports = router;