// Carregando modulos
const express = require('express');
// const Sequelize = require('sequelize');
const handlebars = require('express-handlebars');
const path = require('path');
const admin = require('./routes/admin');
const user = require('./routes/user')
const server = express();
const bodyParser = require('body-parser');
const session = require('express-session');
// titpo de sessão que só aparece uma vez. Quando usuario recarregar a pagina não aparece mais lá
const flash = require('connect-flash');
const usuarioDb = require('./models/Usuario')
const passport = require('passport');
require('./config/auth')(passport)



// Obs.: O app.use é usado pra criação e confirguração. São middlewares

// Configuração
    // Handlebars
        server.engine('handlebars', handlebars.engine({defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    }));
        server.set('view engine', 'handlebars');

    // Sequelize
    
    // Body-Parser
        // Inicializando body-parser
        server.use(bodyParser.urlencoded({ extended: false }))
        server.use(bodyParser.json())

    // Public
        server.use(express.static(path.join(__dirname, "public")))

    // Sessão
        // server.set('trust proxy', 1) 
        server.use(session({
            secret: "qualquercoisa",
            resave: false,
            saveUninitialized:false,
            cookie: { maxAge: 30 * 60 * 1000,
                      secure: true }
        }));

    // Passport
        server.use(passport.initialize())
        server.use(passport.session())

        // Flash
        server.use(flash())
    
    // Middlewares
        server.use((req,res,next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next() //Sem o next a aplicação fica parando e com ele roda uma vez e segue
        })

// Rotas
    // carrega as rotas de outro arquivo. 
    // prefixo criado 'admin' + o nome da rota que tá no outro arquivo na pagina'routes
    server.use('/admin', admin);
    server.use('/user', user);


// Conexão com servidor
server.listen(8080, ()=>{
    console.log("Servidor conectado!");
});