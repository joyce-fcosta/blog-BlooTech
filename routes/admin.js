// Rotas do admin

const express = require('express');
const categoriaDb = require('../models/Categoria');
const postagemDb = require('../models/Posts');
const router = express.Router();
const {eAdmin} = require('../helpers/eAdmin') // pega apenas a função admin

router.get('/addcategorias',eAdmin, (req, res)=>{
    res.render("admin/addcategorias");
});

router.get('/categorias',eAdmin,(req,res)=>{
    categoriaDb.findAll()
    .then((categoriaV)=>{
        res.render("admin/categorias", {categoriaV: categoriaV});
        console.log(categoriaV);
    })  
});


router.get('/listcategoria', eAdmin,(req, res)=>{
    categoriaDb.findAll().then((categoria)=>{
        res.render('admin/listcategorias', {categoria: categoria})
    })

})

router.get('/listcategorias/:id',eAdmin, (req,res)=>{
    // primeiro pesquisar a categoria para assim conseguir pesquisar todas as postagens  que contem essa categoria
    categoriaDb.findOne({where: {id:req.params.id}}).then((categoria)=>{
        postagemDb.findAll({where:{categoriaId: categoria.id}}).then((postagens)=>{
            res.render('admin/listdeposts', {categoria: categoria,postagens: postagens})
        })
    })
})

router.post('/categorias/novacategorias', eAdmin,(req, res)=>{

    // Tratamento de erros no back

    var erros = []
    // Se o campo for vazio ou tipo indefinido ou nulo
    if(!req.body.nome || typeof req.body.slug == undefined || req.body.nome == null){
        erros.push({texto: "Nome inválido"})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto: "Slug inválido"});
    }

    if(req.body.slug.length < 2){
        erros.push({texto: "Quantidade de caracter pequena"})
    }

    if(erros.length>0){
        res.render('admin/addcategorias',{ erros: erros})
    } else{
        categoriaDb.create({
            nome: req.body.nome,
            slug: req.body.slug
        }).then(()=>{
        req.flash("success_msg", "Categoria criada com sucesso!")
        res.redirect("/admin/categorias")
        }).catch((error)=>{
            req.flash("error_msg", "Houve um error ao salvar a categoria, tente novamente!")
            console.log("Erro: "+error);
        })
    }
})

router.get("/categorias/edit/:id", eAdmin,(req, res)=>{
    categoriaDb.findOne({where: {"id": req.params.id}}).then((categoriaE)=>{
        res.render("admin/editcategoria", {categoriaE: categoriaE})
    }).catch((error)=>{
        req.flash("error_msg", "Essa categoria não existe!")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", eAdmin,(req,res)=>{
    // não consegui usar com findOne, mas consegui usar com
    categoriaDb.update({nome:req.body.nome, slug:req.body.slug}, {where: {"id": req.body.id}}).then(()=>{
        req.flash("success_msg","Categoria editada com sucesso!")
        res.redirect("/admin/categorias")
    
    }).catch((error)=>{
         req.flash("error_msg", "Houve um erro ao salvar a edição da categoria")
    })
})

   
router.get('/categorias/deletar/:id', eAdmin,(req, res)=>{
    categoriaDb.destroy({where: {"id": req.params.id}})
    .then(()=>{
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias");
    })
    .catch((error)=>{
        req.flash("error_msg", "Houve algum erro ao deletar a categoria!")
        console.log(`Erro: ${error}`)
    })
});




// POSTAGENS
router.get('/postagens',async(req, res)=>{
    postagemDb.findAll({
        include: [{
            model: categoriaDb, as:'categoria'
        }],
        raw: false,
        nest: true
    }).then((posts)=>{
        res.render("admin/index", {posts: posts});
        // console.log(posts.categoria)
    })
})

// Duplicar para poder ser encontrado no login. Mas depois refatorar o código para fica como único
router.post('/postagens', eAdmin,async(req, res)=>{
    postagemDb.findAll({
        include: [{
            model: categoriaDb, as:'categoria'
        }],
        raw: false,
        nest: true
    }).then((posts)=>{
        res.render("admin/index", {posts: posts});
        // console.log(posts.categoria)
    })
})

router.get('/addpostagens',eAdmin,(req,res)=>{
    categoriaDb.findAll().then((categoriaP)=>{
        res.render("admin/addpostagem", {categoriaP: categoriaP})
    }).catch((error)=>{
        req.flash("error_msg", "Erro ao carregar formulário")
    })
})

router.post('/postagens/novapostagem', eAdmin, (req,res)=>{
    postagemDb.create({
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria 
    }).then(()=>{
        req.flash("success_msg","Postagem cadastrada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch(()=>{
        req.flash("error_msg", "Houve um erro ao salvar a Postagem")
        res.redirect("/admin/postagens")
    })
    
})

router.get('/postagem/edit/:id',eAdmin,(req, res)=>{
    postagemDb.findOne({where:{"id": req.params.id}}).then((postagem)=>{
        categoriaDb.findAll().then((categoria)=>{
        res.render("admin/editpostagem",{postagem: postagem, categoria: categoria})
        })
    })
})  


router.post('/postagem/edit',eAdmin,(req, res)=>{
    postagemDb.update({
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoriaId: req.body.categoria
    },
    {where:{"id": req.body.id}}).then(()=>{
        req.flash("success_msg","Postagem editada com sucesso")
        res.redirect("/admin/postagens")
    }).catch(()=>{
        req.flash("error_msg","Houve erro ao salvar edição da postagem")
    })
})

router.get('/postagem/deletar/:id',eAdmin,(req,res)=>{
    postagemDb.destroy({where: {"id": req.params.id}})
    .then(()=>{
        req.flash("success_msg", "Postagem excluida com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((error)=>{
    req.flash("error_msg", "Houve algum erro ao excluir a postagem!")
    })
})

router.get('/postagem/:id', eAdmin,(req,res)=>{
    postagemDb.findOne({where: {"id": req.params.id}}).then((post_read)=>{
        console.log(post_read)
        if(post_read){
        res.render('admin/post', {post_read: post_read})
        }else{
            req.flash("error_msg","Erro ao encontrar mensagem")
        }
    })
})


// router.get('/teste2', (req,res)=>{
//     postagemDb.create({
//         titulo: 'dfghdfhgdfh',
//         slug:   'aeflkgvnçrejg',
//         descricao: 'fçdkjgndfçgklndfçhlkdfnhçlfnd',
//         conteudo: 'çsdljvbsdlvjbsdçkjvbsdçvkjsbdvwjbvspkdjvbsadçjvlkbsdkvjsb~kladfnb',
//         categoriaId: 66 
//     }).then(()=>{
//         res.send("cadastro com sucesso")
//     })
//     })

module.exports = router;