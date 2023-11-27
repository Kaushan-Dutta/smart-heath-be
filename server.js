const express=require('express')
const http=require('http');
const cors=require('cors');
const fetch = require("node-fetch");

require("dotenv").config();

const app=express();
const server=http.createServer(app);

app.use(express.json());
app.use(cors({
    credentials:true
}))
app.use('/',require('./Controllers/publicontroller'))
app.use('/auth',require('./Controllers/authController'))
app.use('/askai',require('./Controllers/askaiController'))


server.listen(3030,()=>{console.log("Server started running");});