const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const Usuario = require('../modelos/usuario');
const Producto = require('../modelos/producto');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) =>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files ) {
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar Tipo

    let tiposValidos = ['productos', 'usuarios'];

    if( tiposValidos.indexOf(tipo) < 0){

        return res.status(400).json({
            ok: false,
            err : {
                message : 'Tipo no válido, los tipos permitidos son: ' + extensionesValidas.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1] //El ultimo

    // Extensiones permitidas...
    let extensionesValidas = ['jpg', 'jpeg', 'png', 'gif'];

    if( extensionesValidas.indexOf(extension) < 0){
        // No valida la ext
        return res.status(400).json({
            ok: false,
            err : {
                message : 'Extension del archivo no válido, las extensiones permitidas son: ' + extensionesValidas.join(', ')
            }
        })
    }

    //Cambiar el nombre del archivo.
    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aca se tiene que grabar 
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                
                break;
            case 'productos':
                imagenProducto(id, res, nombreArchivo);
                
                break;
        
            default:
                break;
        }
        
        
    
        //res.send('File uploaded!');
    });
});



function imagenUsuario(id, res, nombreArchivo){
    
    Usuario.findById( id, (err, usuarioDB) => {

        // Error
        if(err) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //Verificar que exista el usuario
        if(!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios')
            return res.status(400).json({
                ok: false,
                err: {
                    message : 'Usuario no existe'
                }
            })
        }

        
        borrarArchivo(usuarioDB.img, 'usuarios')


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
               ok: true,
               usuario: usuarioGuardado,
               img: nombreArchivo
            })
        })
    })
}

function imagenProducto(id, res, nombreArchivo){
    
    Producto.findById( id, (err, productoDB) => {

        // Error
        if(err) {
            borrarArchivo(nombreArchivo, 'productios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        //Verificar que exista el usuario
        if(!productoDB) {
            borrarArchivo(nombreArchivo, 'productos')
            return res.status(400).json({
                ok: false,
                err: {
                    message : 'Producto no existe'
                }
            })
        }

        
        borrarArchivo(productoDB.img, 'productos')


        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {
            res.json({
               ok: true,
               producto: productoGuardado,
               img: nombreArchivo
            })
        })
    })
}


function borrarArchivo(nombreImg, tipo){

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }

}





module.exports = app;


