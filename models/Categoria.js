const db = require('./db');

const categorias = db.sequelize.define('categoria',{
    nome:{
        type: db.Sequelize.STRING
    },
    slug:{
        type: db.Sequelize.TEXT
    }
});
// Sincroniza o meu model criado com meu mysql
// categorias.sync() //->  Deve ser comentado assim que cria a tabela

module.exports = categorias;