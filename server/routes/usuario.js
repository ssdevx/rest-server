const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../modelos/usuario');

const app = express();



 
app.get('/usuario', function (req, res) {
    
    //skip(5) -> Salta 5 registros
    //limit(5) -> Recupera 5 registros
    let status = {
        estado:true
    }

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 0;
    limite = Number(limite);

    // Segundo parametro: String -> Los campos que quiero que retorne el objeto

    Usuario.find({ estado:true }, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) =>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({estado: true}, (err, total) =>{
                res.json({
                    ok: true,
                    usuarios,
                    total
                });
            })        
        })
})
  

app.post('/usuario', function (req, res) {
  
    const body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10) ,
        role: body.role
    })

    //Grabar en la BD.

    usuario.save((err, usuarioDB) =>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

})


app.put('/usuario/:id', function (req, res) {
      
    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    

    // 3er parametro:
    // new: true -> regresar el documento actaulizado
    // runValidators: true -> Validar el Esquema(Modelo) de usuario 

    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) =>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        }); 

    });   
})
  

app.delete('/usuario/:id', function (req, res) {
    
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    //Usuario.findByIdAndRemove(id, (err, userDelete) =>{
    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, userDelete) =>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!userDelete ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: userDelete
        }); 

    })


})


module.exports = app;