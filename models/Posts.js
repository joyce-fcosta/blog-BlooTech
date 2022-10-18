const db = require('./db');
const categoriaDb = require('./Categoria');
const posts = db.sequelize.define('postagens', {
    titulo:{
        type: db.Sequelize.STRING
    },
    slug: {
        type: db.Sequelize.STRING
    },
    descricao: {
        type: db.Sequelize.STRING
    },
    conteudo: {
        type: db.Sequelize.TEXT
    },
    categoriaId:{
        type: db.Sequelize.INTEGER,
        references: {model: 'categoria', //O references faz ter uma chave extrageira
                     key: 'id',
                     onUpdate: 'CASCADE', //se houver alterações na tabela categoria então então vai alterar aqui também!
                     onDelete: 'SET NULL'} //Se a categoria for deletada então vai aparecer nulo
    }
})

// para fazer a associação com chave extrangeira definir quem sera e qual tabela virar esse valor
posts.belongsTo(categoriaDb, {
        constraints:true,
        foreignKey: 'categoriaId',
        as:'categoria',
        allowNull: false})


// posts.sync({force:true}) //->  Deve ser comentado assim que cria a tabela


module.exports = posts;
