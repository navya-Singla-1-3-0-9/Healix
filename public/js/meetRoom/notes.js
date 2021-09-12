$(".notes").on("click",()=>{
document.querySelector(".note").style.display="block";
document.querySelector(".main").style.display="none";
document.querySelector(".end-notes").style.display="block";
});
$(".end-notes").on("click",()=>{
document.querySelector(".note").style.display="none";
document.querySelector(".main").style.display="block";
document.querySelector(".end-notes").style.display="none";
});
document.querySelector(".editor").addEventListener("keypress",()=>{
	socket.emit("taking-notes",document.querySelector(".editor").innerHTML);
});
socket.on("copy-notes",(text)=>{
	document.querySelector(".editor").innerHTML= text;
})
$(".download").on("click",()=>{
	 	let data= document.querySelector(".editor").innerText;
	 	let file= "notes.txt";
	 	download(file,data);
});
function download(file, text) {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, '+ encodeURIComponent(text));
    element.setAttribute('download', file);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
   



document.querySelector(".bold").addEventListener("click",()=>{
    document.execCommand('bold');
});
document.querySelector(".italic").addEventListener("click",()=>{
    document.execCommand('italic');	
});
document.querySelector(".underline").addEventListener("click",()=>{
    document.execCommand('underline');
});
document.querySelector(".right").addEventListener("click",()=>{
    document.execCommand('justifyRight');
});
document.querySelector(".left").addEventListener("click",()=>{
    document.execCommand('justifyLeft');
});
document.querySelector(".center").addEventListener("click",()=>{
    document.execCommand('justifyCenter');
});
document.querySelector(".font-color").addEventListener("input",()=>{
    let color= $('.font-color').val();
    document.execCommand('foreColor',false,color);
});
