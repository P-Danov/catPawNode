const express = require('express');
const app = express();
const mongoose = require('mongoose')
const Score = require('./score.model.js')
let jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { document } = (new JSDOM('index.html')).window;
global.document = document;

mongoose.connect('mongodb+srv://mrocznymrok:Killer666666@meokdatabase.tqetnqk.mongodb.net/?retryWrites=true&w=majority&appName=meokDatabase')
.then(()=>{
    console.log('connected to meok db')
    app.listen(3000,async()=>{
        console.log('server is running on port 3000')
        
    });
})
.catch(()=>{
    console.log('connection fail')
})

app.use(express.static('public'));
app.use(express.json());

app.get("/home",async(req,res)=>{
    try{
        
        res.sendFile("index.html", { root: __dirname})
        console.log('1')

            app.get("/scoresList",async(req,res)=>{
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
  



