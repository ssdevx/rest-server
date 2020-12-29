const express = require('express');

const app = express();

const Categoria = require('../modelos/categoria');
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion');



//Recuperar todas las categorias
app.get('/categoria', verificarToken, (req, res) =>{

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categorias
        });
    });
});


// Recuperar categoria por ID

app.get('/categoria/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoria){
            return res.status(400).json({
                ok: false,
                err: 'No se encontró categoria con este ID'
            });
        }


        res.json({
            ok: true,
            categoria
        });

    });
});



// Dar de alta una categoria
app.post('/categoria', verificarToken, (req, res) => {

    const body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id,

    });

    categoria.save((err, categoriaDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});



// Actualizar una categoria

app.put('/categoria/:id', [verificarToken, verificarAdminRole], function (req, res) {
      
    let id = req.params.id;
    let body = req.body;

    const categoriaDesc = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate( id, categoriaDesc, {new: true, runValidators: true}, (err, categoriaDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        }); 

    });   
});



//Eliminar una categoria

app.delete('/categoria/:id', [verificarToken, verificarAdminRole], function (req, res) {
    
    let id = req.params.id;


    Categoria.findByIdAndRemove(id, (err, categoriaDelete) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDelete ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        }); 

    });
});
  





module.exports = app;