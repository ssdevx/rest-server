require('./config/config');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');


const app = express();

const bodyParser = require('body-parser');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


//Configuracion global de rutas:
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true}, (err, res) =>{

    if(err) throw err;

    console.log('Base de datos Onlline');

});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto 3000');
})