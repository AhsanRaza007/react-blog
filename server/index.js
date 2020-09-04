const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/key');
const { User }  = require('./models/user');
const user = require('./models/user');
const auth = require('./middleware/auth');
const app = express();

mongoose.connect(config.mongoURI, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false})
.then(()=>console.log('DB connected'))
.catch(error=> console.log(error));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cookieParser());

// app.get('/', (req, res)=>{
//     res.send("hello server here");
// })

app.get('/api/user/auth',auth, (req, res)=>{
    //console.log(req.user);
    res.status(200).json({
        _id: req.user._id,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role:req.user.role
    })
})

app.post('/api/users/register', (req, res)=>{
    //console.log(req.body);
    const user = new User(req.body);
    user.save((err, doc)=>{
        if(err) return res.json({success:false, err});

        res.status(200).json({success:true, userData:doc});
    });
})

app.post('/api/users/login', (req, res)=>{
    //find the email
    User.findOne({email: req.body.email}, (err, user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: 'Auth failed! email not found.'
            });
        }
        //check password is same as the original
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch){
                return res.json({loginSuccess:false, message:"Wrong Password"})
            }
        })

        user.generateToken((err, user)=>{
            if(err) return res.status(400).send(err);
            res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true });

        })

    })
})

app.get('/api/user/logout',auth, (req, res)=>{
    User.findOneAndUpdate({_id:req.user._id}, {token:""}, (err, doc)=>{
        if(err) return res.json({success:false, err})

        return res.status(200).json({success:true})
    })
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log("server running on port ", PORT);
});