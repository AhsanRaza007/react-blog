const express = require('express');
const app = express();
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://admin-ahsan:test123@cluster0-ponjz.mongodb.net/react-blogDB', {useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log('DB connected'))
.catch(error=> console.log(error));


app.get('/',(req, res)=>{
    res.send('server created...')
})

app.listen(5000);