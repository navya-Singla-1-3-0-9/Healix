 $("#calendar").evoCalendar();
 //console.log(name);
 let b = name.split(",");
 let a = id.split(",");
 let c = badge.split(",");
 let d = date.split(",");
 let e= desc.split(",")
 let m = meet.split(",");
 for(let i=0;i<a.length;i++){
  $("#calendar").evoCalendar('addCalendarEvent', [
    {
      id: a[i],
      name: b[i],
      date: d[i],
      badge:c[i],
      type: "birthday",
      description: e[i]+`<br><a href=" https://${m[i]}" >${m[i]}</a>`,
      everyYear: false
    }
  ]);
}
   //$("#calendar").evoCalendar('addCalendarEvent', app);
   document.getElementById("calendar").addEventListener("click",()=>{
   	console.log($("#calendar").evoCalendar('getActiveDate'));
   });



   
