let canvas= document.querySelector(".whiteboard");
let btn= document.querySelector('.start-board');
btn.addEventListener("click",()=>{
	canvas.style.display="block";
	document.querySelector(".stop-board").style.display="block";
	document.querySelector(".wb-controls").style.display="block";
	 $('.main').toggle('hidemain');
});


document.querySelector(".stop-board").addEventListener("click",()=>{
	document.querySelector(".stop-board").style.display="none";
	document.querySelector(".wb-controls").style.display="none";
	canvas.style.display="none";
	$('.main').toggle('hidemain');
});


let context= canvas.getContext("2d");
canvas.width= window.innerWidth;
canvas.height= window.innerHeight;

let drawing = false;
let erasing = false;
let current={
	color: "black"
}

document.querySelector('.color-pick').addEventListener("input",()=>{
	erasing=false;
	let selectedColor= $(".color-pick").val();
	console.log(selectedColor);
	context.strokeStyle = selectedColor;
	current.color=selectedColor;
	context.stroke();
})




document.querySelector('.erase').addEventListener("click",()=>{
	erasing=true
	context.strokeStyle = "white";
	current.color="white";
	context.stroke();
});


function mousedown(e){
	drawing= true;
	current.x= e.clientX || e.touches[0].clientX;
	current.y = e.clientY || e.touches[0].clientY;
}


function mouseup(e){
	if(!drawing){
		return false;
	}
	drawing= false;
	drawLine(current.x,current.y,e.clientX || e.touches[0].clientX,e.clientY || e.touches[0].clientY,current.color,true);
}


function drawLine(x0,y0,x1,y1,color,emit){
	context.beginPath();
	context.moveTo(x0,y0);
	context.lineTo(x1,y1);
	context.strokeStyle= color;
	context.lineWidth= 5;

	context.stroke();
	context.closePath();
	if(emit){
		let w= canvas.width;
		let h= canvas.height;
		socket.emit("drawing",{
			x0: x0/w,
			y0:y0/h,
			x1: x1/w,
			y1: y1/h,
			color

		})
	}

}

function ondrawing(data){
		let w= canvas.width;
		let h= canvas.height;
		drawLine(data.x0*w,data.y0*h,data.x1*w, data.y1*h,data.color,true);

}
socket.on("drawing",ondrawing);
function mousemove(e){
	if(!drawing){
		return;
	}
	drawLine(current.x,current.y,e.clientX || e.touches[0].clientX,e.clientY || e.touches[0].clientY,current.color,true);
	current.x= e.clientX || e.touches[0].clientX;
	current.y = e.clientY || e.touches[0].clientY;
}

function throttle(callback, delay){
	let prev= new Date().getTime();
	return function(){
		let time= new Date().getTime();
		if(time-prev>=delay){
			prev= time;
			callback.apply(null,arguments)
		}
	}
}

function resize(){
	canvas.width= window.innerWidth;
	canvas.height= window.innerHeight;
}

canvas.addEventListener("mousedown",mousedown,false);
canvas.addEventListener("mouseup",mouseup,false);
canvas.addEventListener("mouseout",mouseup,false);
canvas.addEventListener("mousemove",throttle(mousemove,10),false);


canvas.addEventListener("touchstart",mousedown,false);
canvas.addEventListener("touchend",mouseup,false);
canvas.addEventListener("touchcancel",mouseup,false);
canvas.addEventListener("touchmove",throttle(mousemove,10),false);

window.addEventListener("resize",resize,false);