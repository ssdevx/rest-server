const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {

    // Obtener el header, se llama token en este caso.
    let token = req.get('token');

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err: 'Token Inválido'
            })
        }

        req.usuario = decoded.usuario;

        next();
    })    
}

// Verificar Admin Role

let verificarAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if(usuario.role === 'ADMIN_ROLE'){

        next();
    } else{
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })

    }
}



// Verificar Token Imagen

let verificarTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if(err){
            return res.status(401).json({
                ok: false,
                err: 'Token Inválido'
            })
        }

        req.usuario = decoded.usuario;

        next();
    })
}


module.exports = {
    verificarToken,
    verificarAdminRole,
    verificarTokenImg
}