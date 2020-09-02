const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/key');
const { User }  = require('./models/user');

const app = express();

mongoose.connect(config.mongoURI, {useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true})
.then(()=>console.log('DB connected'))
.catch(error=> console.log(error));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send("hello server here");
})

app.post('/api/users/register', (req, res)=>{
    const user = new User(req.body);
    user.save((err, userData)=>{
        if(err) res.json({success:false, err});
    });

    res.status(200).json({success:true, err:null});
})

app.listen(5000);