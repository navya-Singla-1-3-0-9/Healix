if(process.env.NODE_ENV!=="production"){
	require('dotenv').config();
}

const express= require('express');
let app= express();
app.set("view engine","ejs");

const { v4: uuidv4}= require('uuid');
const server= require('http').Server(app);
const io= require('socket.io')(server);
const { ExpressPeerServer }= require('peer');
const port= process.env.PORT||3000;
const peerServer= ExpressPeerServer(server,{
	debug:true
})

const session = require('express-session')
const flash = require('connect-flash');
const passport= require('passport');
const localStrategy= require('passport-local'); 
app.use('/peerjs',peerServer);
const path = require('path')
app.use(express.static("public"));



 const sessionConfig={
	secret: 'Thisisasecret',
	resave: false,
	saveUninitialized: true,
	cookie:{
		httpOnly: true,
		expires: Date.now()+1000*60*60*24*7,
		maxAge: 1000*60*60*24*7
	}
}


const  User = require("./models/userschema");
const  Appointment = require("./models/appointments");
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
//handling login
passport.serializeUser(User.serializeUser());
//handling logout
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
	//console.log(req.session);
	res.locals.currUser= req.user;
	res.locals.success=  req.flash('success');
	res.locals.error= req.flash('error');
	next();
})
const  mongoose  = require("mongoose");

//const url= 'mongodb://localhost:27017/consultm'
const  connect  =  mongoose.connect(url, { useNewUrlParser: true  });
const  Call = require("./models/callschema");
const  Doctor = require("./models/doctors");
const  Review = require("./models/review.js");
const Profile =require("./models/userprofile.js");
const Notif =require("./models/notifschema.js");
const Prescription =require("./models/prescription.js");
const { profile } = require('console');


app.use(express.urlencoded({extended:true}));
app.set('views',path.join(__dirname,'views'));
const users = [];
let findusers= async()=>{

}
findusers();

function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

function userLeave(id) {
	
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

let curr=[];
let grpname;
io.on("connection", (socket) => {
  	socket.on("join-room", (roomId, userId, userName) => {
	    socket.join(roomId);
	    const nuser = userJoin(userId, userName, roomId);
	    io.to(nuser.room).emit('roomUsers', {
		      room: nuser.room,
		      users: getRoomUsers(nuser.room)
	    });

	   socket.on("disconnect", () => {
	      const user = userLeave(userId);
	      socket.to(roomId).emit("user-disconnected", userId);
	      io.to(user.room).emit("roomUsers", {
			      room: user.room,
			      users: getRoomUsers(user.room)
		    });
    });
	   
	    socket.on("drawing", data => socket.to(roomId).emit("drawing", data));

	    socket.to(roomId).emit("user-connected", userId);
	    
	    socket.on("message", (message) => {

	    io.to(roomId).emit("createMessage", message, userName);
	    });

	     socket.on('taking-notes',(text)=>{
	    	socket.to(roomId).emit("copy-notes",text);
	    });     
  });

  	socket.on("save-app",(doc,patient,date,time,desc)=>{
  		console.log(doc);
  		console.log(patient);
  		console.log(date);
  		console.log(time);
  		  connect.then(async (db)  =>  {
  		  	let meet= `still-wave-47357.herokuapp.com/${uuidv4()}`
			    let  app  =  new Appointment({doctor: doc,patient,date, time, description:desc, meeting_link:meet});
			    await app.save();
			    let notif = new Notif({from: doc, for: patient,date,time,description:`Your appointment has been Scheduled with me on ${date} at ${time}. Please Join at:`,link: meet});
				await notif.save()
				 let notif2 = new Notif({from:patient, for:doc,date,time,description:`${patient} has scheduled an appointment on ${date} at ${time}. Please view at:`,link:"still-wave-47357.herokuapp.com/calendar"});
				await notif2.save();
				socket.emit("popup",`${doc} : Your appointment has been Scheduled with me on ${date} at ${time}.`,patient);
			});
  	});

  	socket.on("get-avail",(date,doc)=>{
  		  connect.then(async (db)  =>  {
			    let ts = await Appointment.find({doctor: doc, date: date});
			   // console.log(ts);
			    let unavail=[];
			    for(let x of ts){
			    	unavail.push(x.time);
			    }
			    console.log(unavail);
			    socket.emit("update-time",unavail)
			});
  		});

  	socket.on("prescribe",(patient,symptoms,tests,advice,medicines,names)=>{
  		 connect.then(async (db)  =>  {
  		 	/*console.log(patient);
  		 	console.log(symptoms);
  		 	console.log(advice);
  		 	console.log(tests);
  		 	console.log(medicines);*/
			   let p= new Prescription({from:"mini",for:patient,symptoms,tests,advice,medicines,names});
			   await p.save();
			});
  	});

});




let name="";

const isLoggedIn= async (req,res,next)=>{
	if(!req.isAuthenticated()){
		
		req.flash('error','You must be logged in');
		return res.redirect('/login');

	}
	
	next();
}

let landing= (req,res)=>{
	res.render('home.ejs');
};
let startMeeting=(req,res)=>{
	res.redirect(`/${req.params.groupid}`);
}


let loginPg=(req,res)=>{
 	res.render('login.ejs');
}
let registerPg=(req,res)=>{
 	res.render('register.ejs');
}
let handleLogin=(req,res)=>{
	if(req.session.returnTo){
		res.redirect(req.session.returnTo);
		delete req.session.returnTo;
	}else{
		req.flash('success', 'Successfully logged in');
		res.redirect(`/doctors`);
	}
}
let handleRegister=async (req,res)=>{
 	const {email, username, password}= req.body;
	const nu = new User({email, username, role:"patient"});
	const regdUser= await User.register(nu, password);
	req.flash('success','Successfully registered')
	res.redirect('/login')
}
let videoCall= (req,res)=>{
  let room= req.params.room;
  	if(req.user){
	 	const username= req.user.username;
		res.render('room.ejs',{roomid: room, username, groupid:room});
	}
}


let logout = (req,res)=>{
	req.logout();
	req.flash('success', 'logged out')
	res.redirect('/login');
}
app.get('/',landing);
//app.get('/room/:groupid',isLoggedIn,startMeeting);
app.get('/login',loginPg)
app.get('/register',registerPg)
app.get('/doctor/register',(req,res)=>{
	res.render('docreg.ejs');
})
app.post('/doctor/register',async (req,res)=>{
		
		const {email,username,password,description,price,b_uni,b_loc,m_uni,m_loc,first_name,last_name,specialty,img}= req.body;
		const nu = new User({email, username, role:"doctor"});
		const regdUser= await User.register(nu, password);

		const doc= new Doctor({username, email,description,price,b_uni,b_loc,m_uni,m_loc,first_name,last_name,specialty,img});
		await doc.save();
		req.flash('success','Successfully registered')
		
		res.redirect('/login')
})

app.post('/profile',isLoggedIn,async function(req,res){
	console.log(req.body);
	const {name,Surname,number,address,email,e,age,weight,diseases,doctors}=req.body;
	const profile=new Profile({name,Surname,number,address,email,e,age,weight,diseases,doctors});
	await profile.save();
	 let notifs = await Notif.find({for: req.user.username});
	notifs.reverse();
	res.redirect('/profile');
})
app.post('/login',passport.authenticate('local',{failureFlash:'Invalid username or password', failureRedirect:'/login'}),handleLogin);
app.post('/register',handleRegister);
app.get('/logout',logout);
app.get('/doctors',isLoggedIn, async (req,res)=>{
	if(req.user.role=='doctor'){
		res.redirect('/calendar');
		return;
	}else{
	let doctors= await Doctor.find({});
	let notifs = await Notif.find({for: req.user.username});
	notifs.reverse();
	
	res.render('doctors.ejs',{doctors , notifs});
}
});

app.get('/doctors/:id',isLoggedIn,async (req,res)=>{
	const {id}= req.params;
	let doc= await Doctor.findById(id);
	let rev=[];
	for(let r of doc.reviews){
		let review= await Review.findById(r);
		
		let name = await User.findById(review.author);
		rev.push({name: name, review});
	}
	
	res.render('show.ejs',{doc, rev, curr:req.user.username});
});
app.post('/doctors/:id/reviews',isLoggedIn,async (req,res)=>{
	const doc = await Doctor.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    doc.reviews.push(review);
    await review.save();
    await doc.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/doctors/${doc._id}`);
});

app.post('/doctors/:id/reviews/:revid',isLoggedIn,async (req,res)=>{
	const { id, revid } = req.params;
    await Doctor.findByIdAndUpdate(id, { $pull: { reviews: revid } });
    await Review.findByIdAndDelete(revid);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/doctors/${id}`);
});

app.get('/calendar',isLoggedIn,async (req,res)=>{
	let appointments=await Appointment.find({doctor: req.user.username});
	let notifs = await Notif.find({for: req.user.username});
	notifs.reverse();
	let role= req.user.role;
	console.log(role);
	console.log(appointments);
	let id=[];
	let name=[];
	let date=[];
	let badge=[];
	let desc=[];
	let meet=[];

	for(let a of appointments){
		id.push(a._id);
		name.push(a.patient);
		date.push(a.date);
		badge.push(a.time);
		let s= a.description;
		desc.push(s);
		meet.push(a.meeting_link);
	}
	//console.log(name);
	res.render('calendar.ejs',{id, name,date,badge,desc,meet, notifs});
})

app.get("/profile",async function(req,res){
	 let notifs = await Notif.find({for: req.user.username});
	notifs.reverse();
	let prof = await Profile.find({name: req.user.username});
	res.render('profile',{notifs, prof});
});

app.get('/prescription',isLoggedIn,async function(req,res){
	let notifs = await Notif.find({for: req.user.username});
	notifs.reverse();
	res.render('prescription',{notifs});
})
app.get('/myprescription',isLoggedIn,async function(req,res){
	let ps= await Prescription.find({for: req.user.username});
	let notifs = await Notif.find({for: req.user.username});
	notifs.reverse();
	res.render('mypresc',{ps,notifs});
})
app.get('/selfcare',(req,res)=>{
	res.render('selfcare.ejs')
})
app.get('/selfcare/mind',(req,res)=>{
	res.render('mind.ejs')
})
app.get('/selfcare/bmi',(req,res)=>{
	res.render('bmi.ejs')
})

app.get('/:room',isLoggedIn,videoCall);

server.listen(port,(req,res)=>{
	console.log('HELLOOO!');
});
