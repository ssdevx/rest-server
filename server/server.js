require('./config/config');

const express = require('express')
const app = express();

const bodyParser = require('body-parser');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

 
app.get('/usuario', function (req, res) {
  res.json('GET Usuario')
})

app.post('/usuario', function (req, res) {

    const body = req.body;

    res.json({
        persona:body
    })
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    
    res.json({
        id
    });    
})

app.delete('/usuario', function (req, res) {
    res.json('DELETE Usuario')
})
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto 3000');
})