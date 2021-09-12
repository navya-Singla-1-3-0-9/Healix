$(".toggle-cap").on("click",(e)=>{
	$(".toggle-cap").toggle("show-cap");
});

if ("webkitSpeechRecognition" in window) {

  console.log("avail");
  let speechRecognition = new webkitSpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  	speechRecognition.start();
  	let final_transcript = "";
 speechRecognition.onresult = (event) => {
    final_transcript="";
    let interim_transcript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
   
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
     document.querySelector('.captions').innerText=final_transcript;

speechRecognition.onend = () => {
 
};

}
} else {
  console.log("Speech Recognition Not Available")
}