const myVideo = document.getElementById('my-video');
const myVideo2 = document.getElementById('my-video2');
var volLevel;
let canvas;
class canvasHandler{
	constructor(canvas){
		this.dragLine = false;
		this.dragging = false;
		this.dragStart = {x: 0, y: 0};
		this.currentDrag = {x: 0, y: 0};
		this.lastLine = [];
		this.imgData = [];
		this.drawnData = [];
		this.clicked = false;
		this.loc = {x: 0, y: 0};
		this.counter = 0
		this.el = canvas;
		this.ctx = canvas.getContext("2d");
		this.ctx.moveTo(this.loc.x, this.loc.y);
		canvas.addEventListener("mousedown", (e)=>{
			let location = translateMouse(this.el, e);
			if(this.dragLine){
				this.dragging = true
				this.dragStart.x = location.x
				this.dragStart.y = location.y
				this.currentDrag.x = location.x
				this.currentDrag.y = location.y
				return
			}
			this.imgData.push(this.ctx.getImageData(0, 0, this.el.width, this.el.height));
			this.ctx.beginPath()
			this.ctx.moveTo(location.x, location.y);
			this.lastLine = [{x: location.x, y: location.y}]
			this.clicked = true;
		});
		canvas.addEventListener("mouseup", (e)=>{
			if(this.dragging){
				let location = translateMouse(this.el, e);
				this.finalizeDrag(location.x-this.dragStart.x, location.y-this.dragStart.y)
			}
			this.clicked = false;
			this.dragging = false;
			this.ctx.closePath()
		});
		canvas.addEventListener("mousemove", (e)=>{
			let location = translateMouse(this.el, e);
			this.counter++
			if(this.counter > 2){
				this.counter = 0;
			}else{
				return
			}
			if(this.clicked){
				this.moved(location.x, location.y);
			}
			if(this.dragging){
				if(Math.pow(location.x-this.currentDrag.x, 2)+Math.pow(-this.currentDrag.y+location.y, 2) > 70){
					this.drag(location.x-this.dragStart.x, location.y-this.dragStart.y)
					this.currentDrag.x = location.x
					this.currentDrag.y = location.y
				}
			}
		});
	}
	clear(){
		this.dragLine = false;
		this.dragging = false;
		this.dragStart = {x: 0, y: 0};
		this.currentDrag = {x: 0, y: 0};
		this.lastLine = [];
		this.imgData = [];
		this.drawnData = [];
		this.clicked = false;
		this.loc = {x: 0, y: 0};
		this.counter = 0
		this.ctx.clearRect(0, 0, this.el.width, this.el.height);
	}
	revert(){
		if(this.imgData.length){
			this.drawnData.push(this.ctx.getImageData(0, 0, this.el.width, this.el.height));
			this.ctx.clearRect(0, 0, this.el.width, this.el.height);
			this.ctx.putImageData(this.imgData.pop(), 0, 0)
		}
	}
	redo(){
		if(this.drawnData.length){
			this.imgData.push(this.ctx.getImageData(0, 0, this.el.width, this.el.height));
			this.ctx.clearRect(0, 0, this.el.width, this.el.height);
			this.ctx.putImageData(this.drawnData.pop(), 0, 0)
		}
	}
	drag(x, y){
		if(this.imgData.length){
			this.ctx.clearRect(0, 0, this.el.width, this.el.height);
			this.ctx.putImageData(this.imgData[this.imgData.length-1], 0, 0)
		}
		this.ctx.beginPath()
		this.ctx.moveTo(this.lastLine[0].x+x, this.lastLine[0].y+y)
		for(let i=1;i<this.lastLine.length;i++){
			this.ctx.lineTo(this.lastLine[i].x+x, this.lastLine[i].y+y);
			this.ctx.strokeStyle = "#ff0000";
			this.ctx.stroke();
		}
		this.ctx.closePath()
	}
	finalizeDrag(x, y){
		for(let i=0;i<this.lastLine.length;i++){
			this.lastLine[i].x += x;
			this.lastLine[i].y += y;
		}
	}
	moved(x, y){
		this.lastLine.push({x: x, y: y});
		this.ctx.lineTo(x, y);
		this.ctx.strokeStyle = "#ff0000";
		this.ctx.stroke();
	}
}

function translateMouse(el, e){
	return {x: e.clientX-el.getBoundingClientRect().x, y: e.clientY-el.getBoundingClientRect().y};
}

window.addEventListener('load', ()=>{
  canvas = new canvasHandler(document.querySelector("#canvas"));

  var nodeConsole = require('console');
  var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

  var topVideoFlipped=false;
  var topVideoFlipped2=false;

  var stack = []; //For storing the lines drawn
  stack.push([5,5,500,500]);
  


  fitToContainer(canvas.el);

  function fitToContainer(canvas){
    // Make it visually fill the positioned parent
    canvas.style.width ='100%';
    canvas.style.height='calc(100% - 40px)';
    canvas.style.marginTop='40px';
    // ...then set the internal size to match
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  // //Resizing
  //canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;




  document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    
    myConsole.log(charStr);

    //***************************************** */
    //Perhaps z to stop 1st video, x the 2nd video, c both videos
    if(charStr=='z'){
      
      myConsole.log("pop the stack");

      if(myVideo.paused){
        myVideo.play();
      }
      else{
        myVideo.pause();
      }      
    }
    else if(charStr=='x'){
      if(myVideo2.paused){
        myVideo2.play();
      }
      else{
        myVideo2.pause();
      }   
    }
    else if(charStr=='c'){
      //1st video is the lead: if 1st video paused 2nd playing, both will play
      if(myVideo.paused){
        myVideo.play();
        myVideo2.play();
      }
      else{
        myVideo.pause();
        myVideo2.pause();
      }   
    }
    //Slow down the video
    else if(charStr=='s'){
      
      
      if(myVideo.playbackRate>0.05){
        myVideo.playbackRate-=0.05;
      }
      
      if(myVideo2.playbackRate>0){
        myVideo2.playbackRate-=0.1;
      }    
      
      myConsole.log("speed is now: "+myVideo.playbackRate);

    }
    //speed up
    else if(charStr=='d'){
      myConsole.log("speed "+myVideo.playbackRate);
      
      myVideo.playbackRate+=0.1;    
      myVideo2.playbackRate+=0.1;    

    }
    //flip the top video
    else if(charStr=='f'){
      if(!topVideoFlipped){
        myVideo.style.cssText = "-moz-transform: scale(-1, 1); \
        -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
        transform: scale(-1, 1); filter: FlipH;";
        topVideoFlipped=true;
      }
      else{
        myVideo.style.cssText = "-moz-transform: scale(1, 1); \
        -webkit-transform: scale(1, 1); -o-transform: scale(1, 1); \
        transform: scale(1, 1); filter: FlipH;";
        topVideoFlipped=false;
      }      
    }
    //flip bottom video
    else if(charStr=='g'){
      if(!topVideoFlipped2){
        myVideo2.style.cssText = "-moz-transform: scale(-1, 1); \
        -webkit-transform: scale(-1, 1); -o-transform: scale(-1, 1); \
        transform: scale(-1, 1); filter: FlipH;";
        topVideoFlipped2=true;
      }
      else{
        myVideo2.style.cssText = "-moz-transform: scale(1, 1); \
        -webkit-transform: scale(1, 1); -o-transform: scale(1, 1); \
        transform: scale(1, 1); filter: FlipH;";
        topVideoFlipped2=false;
      }      
    }
    //undo drawing
    else if(charStr=='u'){
      var tempStack = [];
      stack.pop();  //remove the top one
      while(!stack.isEmpty()){
        var temp = stack.pop();
        ctx.lineWidth=3;
        ctx.strokeStyle = "red";
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.lineTo(temp[0],temp[1]);
        ctx.lineTo(temp[2],temp[3]);
        ctx.closePath();
        ctx.stroke();
        tempStack.push(temp);
      }

      while(!tempStack.isEmpty()){
        stack.push(tempStack.pop());
      }
      
    }else if(charStr=='2'){
      //****************SITUATIONS */
      myVideo.currentTime=311;  //slowMessi.mp4   messi Touch upper side heel, quick control
    }else if(charStr=='3'){
      //****************SITUATIONS */
      myVideo.currentTime=43;  //messi.mp4    inside cut fake - Cancel - feint - wide change direction
    }else if(charStr=='4'){
      //****************SITUATIONS */
      myVideo.currentTime=447;  //messi.mp4    slowMessi: ANKLE 2 - side
    }else if(charStr=='5'){
      //****************SITUATIONS */
      myVideo.currentTime=374;  //messi.mp4    slowMessi: ANKLE
    }
    else if(charStr=='6'){
      //****************SITUATIONS */
      myVideo.currentTime=374;  //slowMessi.mp4    Touch, move out of space, inside cut from space
    }
    else if(charStr=='7'){
      //****************SITUATIONS */
      myVideo.currentTime=338;  //messi.mp4    Reverse feint cut inside
    }else if(charStr=='8'){
      //****************SITUATIONS */
      myVideo.currentTime=62;  //messi2016.mp4    Turn around, feint, circle (SHIELD)
    }
    else if(charStr=='9'){
      //****************SITUATIONS */
      myVideo.currentTime=117;  //messi650.mp4    Turn around, feint, circle
    }
    else if(charStr=='0'){
      //****************SITUATIONS */
      myVideo.currentTime=411;  ///messi650.mp4    Turn around, feint, circle (ANOTHER)
    }
    //go to time
    else if(charStr=='t'){
      //myVideo.currentTime=112;  //in seconds
      //myVideo.currentTime=24;  //in seconds
      //myVideo.currentTime=151;  //in seconds
      //myVideo.currentTime=728;  //INSIDE FOOT FEINT
      myVideo.currentTime=1268; 
      //myVideo.currentTime=167; //Inside CUT - SLOW MESSI
      //myVideo.currentTime=291; //Inside CUT
      //myVideo.currentTime=408; //SLOW MESSI -> INSIDE CUT
      //myVideo.currentTime=462;
      //myVideo.currentTime=98;  //in seconds
      //myVideo.currentTime=15;  //in seconds
      //myVideo.currentTime=27;

      //myVideo2.currentTime=39;  //in seconds
      //myVideo2.currentTime=183;  //in seconds
      //myVideo2.currentTime=75;
    }
    //reverse
    else if(charStr=='r'){
      //myVideo.currentTime-=myVideo.playbackRate;
      myVideo.currentTime-=0.05;
    }
    else if(charStr=='R'){
      //myVideo.currentTime-=myVideo.playbackRate;
      myVideo.currentTime-=1.0;
    }
    //fporward
    else if(charStr=='e'){
      //myVideo.currentTime+=myVideo.playbackRate;
      myVideo.currentTime+=0.05;
    }//reverse
    //fporward
    else if(charStr=='E'){
      //myVideo.currentTime+=myVideo.playbackRate;
      myVideo.currentTime+=1.0;
    }//reverse
    else if(charStr=='n'){
      //myVideo.currentTime-=myVideo.playbackRate;
      myVideo2.currentTime-=0.05;
    }
    else if(charStr=='N'){
      //myVideo.currentTime-=myVideo.playbackRate;
      myVideo2.currentTime-=1.0;
    }
    //fporward
    else if(charStr=='m'){
      //myVideo.currentTime+=myVideo.playbackRate;
      myVideo2.currentTime+=0.05;
    }
    else if(charStr=='M'){
      //myVideo.currentTime+=myVideo.playbackRate;
      myVideo2.currentTime+=1.0;
    }
    else if(charStr=='q'){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    else if(charStr=='1'){
      if(myVideo.volume!=0){
        volLevel=myVideo.volume;
        myVideo.volume=0;
        myVideo2.volume=0;
      }
      else{
        myVideo.volume=volLevel;
      }
    }
    //Keys to sync speed, slow down only 1 video or the other,...


};
  
});
