const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

  //canvas.width = 1224;
  //canvas.height = 776;
  canvas.width  = window.innerWidth*0.8;
  canvas.height = window.innerHeight*0.8;
if(canvas.width>1224){
    canvas.width = 1224;
}
if(canvas.height>776){
    canvas.height = 776;
}

let globalData;
const fps = 120;
let degreeRandom;
let stopAll = false

let catPawsArray = []
let catPawsTraceArray = []
let catPawScoreCount = 0
let catPawCurrntScore = 0
let allLoaded = false

let scoreList = [{scoreName:'Jeden',score:1},{scoreName:'Dwa',score:2},{scoreName:'Trzy',score:3}]

const getScores = async () => {
    const res = await fetch("https://${process.env.VERCEL_URL}/scoresList",{mode: 'no-cors'});
    let updatedScore = await res.json()
    console.log(updatedScore)
    scoreList = [{scoreName:updatedScore[0].scoreName,score:updatedScore[0].score},
                {scoreName:updatedScore[1].scoreName,score:updatedScore[1].score},
                {scoreName:updatedScore[2].scoreName,score:updatedScore[2].score}]
                scoreList.sort((a, b) => b.score - a.score);
                for(i=0;i<scoreList.length;i++){ 
                    document.getElementById('score'+i).innerHTML = scoreList[i].scoreName + " : " + scoreList[i].score
                }
  }
  getScores();

const meowSound1 = new Audio('sounds/meow1.wav');
const meowSound2 = new Audio('sounds/meow2.wav');
const meowSound3 = new Audio('sounds/meow3.wav');
const meowSound4 = new Audio('sounds/meow4.wav');
const meowSound5 = new Audio('sounds/meow5.wav');
const meowSoundArray = [meowSound1,meowSound2,meowSound3,meowSound4,meowSound5]
const catPawImageArray = ["images/catPaw.png","images/catPaw2.png"]

class CatPaw{
    constructor({position},degreeRandom){
        this.position = position
        this.image = new Image()
        this.catPawRandom = Math.round(Math.random()*1)
        this.image.src = catPawImageArray[this.catPawRandom]
        this.imageTrace = new Image()
        this.imageTrace.src = "images/catPawTrace.png"
        this.degreeRandom = degreeRandom
        this.catPawCordinateY=0
        this.catPawMoveBack = false
        this.catPawStartPosition = this.position.y+1000
        this.catPawWidth = 60
        this.catPawHeight = 1400
        this.catPawTraceWidth = 45
        this.catPawTraceHeight = 40
        this.catPawOffsetX = 20
        this.catPawOffsetY = 20
        this.catPawTraceOffsetX = 15
        
    }
    draw(){
        if(!this.catPawMoveBack&&!stopAll){
            this.catPawCordinateY-=8
            if(this.position.y-this.catPawOffsetY>this.catPawStartPosition+this.catPawCordinateY){
                this.catPawMoveBack = true
                this.meowRandom = Math.round(Math.random()*4)
                meowSoundArray[this.meowRandom].play();
                catPawScoreCount++
                document.getElementById('score').innerHTML = 'Cat Paws : '+catPawScoreCount
                //console.log(globalData)
            }
        }
        else if(this.catPawMoveBack&&!stopAll){
            this.catPawCordinateY+=8
        }
        c.save();       
        c.translate(this.position.x,this.position.y)  
        c.rotate(360/this.degreeRandom)
        c.translate(-this.position.x,-this.position.y)
        if(this.catPawMoveBack){
            c.drawImage(this.imageTrace,this.position.x-this.catPawTraceOffsetX,this.position.y,this.catPawTraceWidth,this.catPawTraceHeight)
        }
        c.drawImage(this.image,this.position.x-this.catPawOffsetX,this.catPawStartPosition+this.catPawCordinateY,this.catPawWidth,this.catPawHeight,)
        c.restore();
    }
}
function catPawOnClick(event){
    if(!stopAll){
   
        if(event.clientX>5&&
            event.clientX<canvas.width&&
            event.clientY>5&&
            event.clientY<canvas.height
        ){
            degreeRandom = Math.round((Math.random()*16)-8)
            catPawsArray.push(new CatPaw({position:{x:event.clientX,y:event.clientY}},degreeRandom))
        }
    }
}
function restart(){
    catPawsArray = []
    catPawsTraceArray = []
    catPawScoreCount = 0
    document.getElementById('score').innerHTML = 'Cat Paws : '+catPawScoreCount
}
function restartAndSaveHiscore(){
    stopAll = true
    document.getElementById('form').style.display = 'block'
    // catPawsArray.forEach((catPaw)=>{
    //     catPaw.catPawCordinateY=0
    // })
}
function submitScore(){
    let catPawFormUsername = document.getElementById("userName").value;
    document.getElementById('form').style.display = 'none'
    document.getElementById('userName').value = ''
    currentUsernameScore = {scoreName:catPawFormUsername,score:catPawScoreCount}
    scoreList.push(currentUsernameScore)
    scoreList.sort((a, b) => b.score - a.score);
    let updateInfo = {oldObject:scoreList[3],newObject: currentUsernameScore}
    console.log(updateInfo)
    scoreList.pop()
    for(i=0;i<scoreList.length;i++){ 
        document.getElementById('score'+i).innerHTML = scoreList[i].scoreName + " : " + scoreList[i].score
    }
    fetch('scores',{
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },
        //body:JSON.stringify(scoreList) ,
        body:JSON.stringify(updateInfo) 
    })
    restart()
    stopAll = false
    
}
function animate(){
    c.clearRect(0,0,canvas.width,canvas.height)
    
    catPawsArray.forEach((catPaw) =>{
        catPaw.draw()
    })

    setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / fps)
}
window.addEventListener('click',catPawOnClick)
window.onresize = function()
{
    if(window.innerWidth*0.8>0&&window.innerWidth*0.8<1224){
        canvas.width = window.innerWidth*0.8;
        canvas.style.width = window.innerWidth*0.8;
        
    }

    if(window.innerHeight*0.8>0&&window.innerHeight*0.8<776){
        canvas.height = window.innerHeight*0.8;
        canvas.style.height = window.innerHeight*0.8;
    }

}
animate();
if(allLoaded){
    
}
// const fs = require('fs');
// fs.readFile('./score.txt','utf8',(err,data)=>{
//     if(err){
//         console.error(err)
//         globalData = data
//         return

//     }
//     globalData = data
// })

