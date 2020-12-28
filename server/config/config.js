

// Puerto
process.env.PORT = process.env.PORT || 3000;


// Entorno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


// Vencimiento del Token
// 60 Segundos
// 60 Minutos
// 24 Horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30


// SEED de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';



// Base de datos

let urlDB;

if(process.env.NODE_ENV === 'dev'){

    // BD Local
    urlDB = 'mongodb://localhost:27017/cafe'

}else {

    // BD Remota
    urlDB = process.env.MONGO_URI; 

}

 process.env.URLDB = urlDB;

