 const socket = io();
 document.querySelector("._0800-0830").addEventListener("click",()=>{
 	console.log("hii");
 });

 
 function displayRadioValue() {
            var ele = document.getElementsByName('time');
              
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked)
                	return ele[i].classList[0];
            }
   }
   //$(".timings").on("click",displayRadioValue);
   $(".sc").on("click",(e)=>{
   	e.preventDefault();
   	console.log(current+" "+$(".date").val());
   		let s=displayRadioValue();
   		s= s.substring(1,3)+":"+s.substring(3,8)+":"+s.substring(8);
   		console.log(s);
   		socket.emit("save-app",username,current, $(".date").val(),s,$(".desc").val());
   })

   document.querySelector(".date").addEventListener("change",()=>{
   let date = $(".date").val();
   socket.emit("get-avail",date,username);
   });
   socket.on("update-time",(a)=>{
   	let rb= document.querySelectorAll(".chiller_cb");
   	for(let e of rb){
   		e.removeAttribute("id")
   	}
   		for(let el of a){
   			let s = "_"+el.substring(0,2)+el.substring(3,8)+el.substring(9);
   			document.querySelector(`.${s}`).setAttribute("id","disabled");
   		}
   })

   socket.on('popup',(data,patient)=>{
      if(current==patient){
   console.log("here")
   let div= document.createElement("div");
   div.innerHTML = `<div class="alert alert-primary alert-dismissible fade show test" role="alert">
  <strong>${data}</strong>
  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`
document.querySelector(".card").appendChild(div);
}
})