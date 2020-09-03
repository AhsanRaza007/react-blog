const { User } = require('../models/user');
const user = require('../models/user');


let auth = (req, res, next) =>{
    let token = req.cookies.x_auth;
    // console.log(req.cookies);
    // console.log(token);
    User.findByToken(token, (err, user) => {
        if(err) throw err;

        if(!user) return res.json({isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next();
    })
}


module.exports = auth;