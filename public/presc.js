const socket=io();
document.querySelector(".issue").addEventListener("click",(e)=>{
	e.preventDefault()
	let x=[];
	$(".med_name").each(function(){
 var input = $(this); 
 x.push(input.val());
 // This is the jquery object of the input, do what you will
});
	socket.emit("prescribe",$(".for").val(),document.querySelector(".symp").innerHTML, document.querySelector(".tst").innerHTML,document.querySelector(".adv_text").innerHTML,document.querySelector(".med_list").innerHTML,x);

	
});