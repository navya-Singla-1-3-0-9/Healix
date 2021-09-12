socket.on('popup',data=>{
	console.log("here")
	let alert = `<div class="alert alert-primary alert-dismissible fade show test" role="alert">
  <strong>${data}</strong>
  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`
document.body.appendChild(alert);
})