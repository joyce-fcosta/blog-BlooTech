const db = require('./db');

const usuario = db.sequelize.define('usuario', {
    nome: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
    eAdmin:{
        type: db.Sequelize.INTEGER,
        default: 0
    },
    senha: {
        type: db.Sequelize.STRING
    }
})


// usuario.sync({force: true});
module.exports = usuario