const express = require('express');

const fs = require('fs');
const path = require('path');
const { verificarTokenImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificarTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;

    
    
    //let pathImg = `./uploads/${tipo}/${img}`;


    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    console.log(pathImagen);

    if (fs.existsSync(pathImagen)){
        res.sendFile(pathImagen);

    }else{

        let noImagePath = path.resolve(__dirname, '../assets/no-found.jpg');

        res.sendFile(noImagePath);
    }

})



module.exports = app;