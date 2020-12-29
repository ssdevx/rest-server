const express = require('express');

const app = express();

const Producto = require('../modelos/producto');
const { verificarToken } = require('../middlewares/autenticacion');



//Recuperar todos los productos
app.get('/productos', verificarToken, (req, res) =>{

    let desde = req.query.desde || 0;
    desde = Number(desde);



    Producto.find({ disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });
    });
});


// Recuperar producto por ID
app.get('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion') 
        .exec((err, producto) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!producto){
            return res.status(400).json({
                ok: false,
                err: 'No se encontró producto con este ID'
            });
        }


        res.json({
            ok: true,
            producto 
        });
    });
});


// Buscar producto.

app.get('/productos/buscar/:termino', verificarToken, (req, res) =>{

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex})
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
            
        });
})

// Dar de alta un producto
app.post('/producto', verificarToken, (req, res) => {

    const body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id,
    });

    producto.save((err, productoDB) =>{

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});



// Actualizar un producto

app.put('/productos/:id', verificarToken, (req, res) => {
  
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });
    });
});



//Eliminar un producto

app.delete('/productos/:id', verificarToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });
        })
    })
});



module.exports = app;