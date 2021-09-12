
$(".list").on("click",".task",function(){
	$(this).toggleClass("completed");
});
$(".list").on("click",".element", function(e){
	$(this).parent().fadeOut(500,function(){
		$(this).remove();
	});
	e.stopPropagation();
});
$(".addTask").keypress(function(e){
	if(e.which===13){
		let text = $(this).val();
		$(this).val("");
		$(".list").append("<li class='task'><span class='element'><i class='fa fa-trash'></i></span>"+ text+"</li>");
		//socket.emit("new-task",username,text);

	}
})
$("h1 i").on("click",function(){
	$(".addTask").fadeToggle(200);
})
