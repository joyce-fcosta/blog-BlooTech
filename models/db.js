// const conect_posts = require('./Posts')
const Sequelize = require('sequelize');
const sequelize = new Sequelize('sistemablog', 'root', '123456789', {
    host:'localhost',
    dialect:'mysql',
    timezone: "-3:00",
    query:{raw: true}
});

// conect_posts.associate(sequelize.models)


module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}


// Teste de conexão do banco de dados
    sequelize.authenticate().then(()=>{
        console.log("Banco de Dados conectado.");
    }).catch((error)=>{
        console.log("Erro ao conectar por: "+error);
    });
