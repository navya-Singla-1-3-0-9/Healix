const socket = io("/");
const userList = document.getElementById('users');
let peers={}
var w = window.innerWidth;
let myvideo;
var h = window.innerHeight;
const grid=document.getElementById('all-videos');
const viewVideo= document.createElement('video');
let myuserid;


document.querySelector('.end-call').addEventListener('click',()=>{
  window.location.href ='/users';
});

document.querySelector('.viewchat').addEventListener('click',()=>{
  if(w<=700){
    $('.chat').toggle('showchat');
    $('.chat').removeClass('col-3')
    $('.chat').addClass('col-12')
    $('.col-9').toggle('hidevid');
  }else{
    $('.chat').toggle('showchat');
    $('.members').toggle("showmembers");
  }
});


document.querySelector('.participants').addEventListener('click',()=>{
    $('.members').toggle("showmembers");
    $('.col-9').toggle('hidevid');
    if(w>700){
      $('.chat').toggle('hidechat')
      $('.members').addClass('col-3')
      $('.col-9').toggle('hidevid');
    }
});
let mypeer= new Peer(undefined,{
	path: '/peerjs',
	host:'/',
	port:location.port || (location.protocol === 'https:' ? 443 :80)
});


mypeer.on('open',id=>{
	socket.emit('join-room',room_id,id,username);
})
viewVideo.muted= true;
navigator.mediaDevices.getUserMedia({
	video: true,
	audio: true

})
.then(stream=>{
	myvideo= stream;
	addVideoStream(viewVideo,stream);
  mypeer.on('call', call => {
    call.answer(stream)

    const video = document.createElement('video');
   
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
   socket.on('user-connected',(userid)=>{
    myuserid= userid;
    console.log("user-connected");
    console.log(userid);
    console.log(myuserid);
    connectToNewUser(userid,stream);
  })


  const connectToNewUser=(userid,stream)=>{
    const call= mypeer.call(userid,stream);
    const video= document.createElement('video');
    call.on('stream',userVideo=>{
      addVideoStream(video,userVideo);
    })
    call.on("close", () => {
      video.remove();
    });
    
   peers[userid] = call

    
  }
});

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play();
    grid.appendChild(video)
  })
}





let messages = document.querySelector(".messages");
let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<li class="message ${
          userName == username ? 'me' : 'other'
        }">
       <div><b> ${
          userName == username ? "me" : userName
        } </b></div>
        <span>${message}</span>
    </li>`;
});

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})



socket.on('roomUsers', ({ room, users }) => {
  outputUsers(users);
});


function outputUsers(users) {
  console.log(users);
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    let hr= document.createElement('hr');
    li.appendChild(hr);
    userList.appendChild(li);
  });
}

const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myvideo.getAudioTracks()[0].enabled;
  if (enabled) {
    myvideo.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myvideo.getAudioTracks()[0].enabled = true;
  }

}

const playStop = () => {

  let enabled = myvideo.getVideoTracks()[0].enabled;
  if (enabled) {
    myvideo.getVideoTracks()[0].enabled = false;
    setPlayVideo()
    myvideo.innerHTML+=`<div style="color: white;">${username}</div>`;
  } else {
    setStopVideo()
    myvideo.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
  <button class="btn btn-info rounded-pill">
    <i class="fas fa-microphone fa-2x"></i>
    </button>
   
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
  <button class="btn btn-danger rounded-pill">
    <i class="unmute fas fa-microphone-slash fa-2x"></i>
    </button>
    
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
  <button class="btn btn-info rounded-pill">
    <i class="fas fa-video fa-2x"></i>
    </button>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
   <button class="btn btn-danger rounded-pill">
  <i class="stop fas fa-video-slash fa-2x"></i>
    </button>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}


const shareScreen = async () => {
  let captureStream = null;

  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia();
    console.log("got media");

  } catch (err) {
    console.error("Error: " + err);
  }

  console.log(captureStream);
  const call = mypeer.call(myuserid, captureStream);
  const video = document.createElement("video");
  video.className+="screen"
  addVideoStream(video, captureStream);
};


console.log(peers);


document.querySelector(".share-screen").addEventListener("click",shareScreen);
document.querySelector(".stop").addEventListener("click",function(){
  let screen= document.querySelector(".screen");
  screen.remove();
})

   

