//const express = require('express');
//const cors = require('cors');
//const app = express();
//const mongoose = require('mongoose')
//const Score = require('./score.model.js')
//const port =  3000;



//const corsOptions = {
//    credentials: true,
//    origin: ['www.mongodb.com/'] // Whitelist the domains you want to allow
//};
//app.use(cors(corsOptions))

mongoose.connect('mongodb+srv://vercel-admin-user:hySLO2FJBuNhBJxZ@meokdatabase.tqetnqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
//mongoose.connect('mongodb+srv://mrocznymrok:Killer666666@meokdatabase.tqetnqk.mongodb.net/?retryWrites=true&w=majority&appName=meokDatabase')
.then(()=>{
    console.log('connected to meok db')
    app.listen(port,async()=>{
        console.log('server is running on port '+ port)
        
    });
})
.catch(()=>{
    console.log('connection fail')
})

//app.use(express.static('public'));
app.use(express.json());



app.get("/home",async(req,res)=>{
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    try{
        
        //res.sendFile("index.html", { root: __dirname})
        console.log('1')

            app.get("/scoresList",async(req,res)=>{
                // res.setHeader('Access-Control-Allow-Origin', '*');
                // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); 
                // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); 
            const importedScore = await Score.find();
            res.send(importedScore) 
            console.log(importedScore)
            console.log('2')
            }) 
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
               
})

app.post("/scores", async(req,res) => {
    try{
         const score = await Score.updateOne({
            scoreName:req.body.oldObject.scoreName,score:req.body.oldObject.score},
            {scoreName:req.body.newObject.scoreName,score:req.body.newObject.score})
         res.status(200).json(score)
        
    }catch(error){
        console.log(error.message)
        res.status(500).json({message:error.message})
    }
})
  



