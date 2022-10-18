const localStrategy = require('passport-local').Strategy;
const db = require('../models/db');
const bcrypt = require('bcryptjs');


// Model Usuário
const usuarioDb = require('../models/Usuario');




module.exports = (passport)=>{
                                    // Com esse modulo conseguimos escolher por qual campo comparar
    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'},(email, senha, done)=>{
        usuarioDb.findOne({where:{"email": email}}).then((usuario)=>{
            console.log(usuario)
            if(!usuario){
                return done(null, false, {message: "Essa conta não existe!"})
            }

            bcrypt.compare(senha, usuario.senha,(erro,batem)=>{
                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, {message: "Email ou senha incorretos!"})
                }
                })
            
        })
    }))

    // Usar essas duas funções para quando o usuario logar os dados serem salvos na secção
    passport.serializeUser((usuario, done)=>{
        done(null, usuario)
    })


    passport.deserializeUser((id, done)=>{
        // procurar o usuario pelo id dele
        usuarioDb.findOne({where: {id: id}}, {raw: true}, (err, usuario)=>{
            done(err, usuario)
        })
    })
}
