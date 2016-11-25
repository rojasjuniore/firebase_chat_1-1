;(function(){
	// Initialize Firebase
   var config = {
    apiKey: "AIzaSyBk3x6pvOi8sfsfCYTc9JHU_6oC-RW7Q9U",
    authDomain: "chat-1-1-cf-25112016.firebaseapp.com",
    databaseURL: "https://chat-1-1-cf-25112016.firebaseio.com",
    storageBucket: "chat-1-1-cf-25112016.appspot.com",
    messagingSenderId: "83532153713"
  };

  firebase.initializeApp(config);

  var database = firebase.database();//Crear bd no sql
  var loginBtn = document.getElementById('start-login') //obtiene el llamado de el boton
  var user = null;
  var usuariosConectado = null
  var conectadoKey = ""
  var rooms

  loginBtn.addEventListener("click", googleLogin)
  window.addEventListener("unload", unlogin)

function googleLogin(){

  	var provider = new firebase.auth.GoogleAuthProvider();

  	firebase.auth().signInWithPopup(provider)
  			.then(function(result){
  				user = result.user
  				console.log(user)
  				$("#login").fadeOut()
  				initApp()

  			})
  }
  
  function initApp(){

   usuariosConectado = database.ref("/connected")
   rooms = database.ref("/rooms")

   login(user.uid, user.displayName || user.email)

   usuariosConectado.on("child_added", addUser)
   usuariosConectado.on("child_removed", removeUser)

   rooms.on("child_added", newRoom)
  	
  }
  
 function login(uid,name){

  	var conectado = usuariosConectado.push({
  		uid: uid,
  		name: name
  	})

  	conectadokey = conectado.key 
 }

 function unlogin(){
	database.ref("/connected/"+conectadokey).remove()
 }
  
function addUser(data){
	
	if(data.val().uid == user.uid) return
	var friend_id = data.val().uid
	var $li = $("<li>").addClass("collection-item")
					   .html(data.val().name)
					   .attr("id",friend_id )
					   .appendTo("#users")

	$li.on("click", function(){

		var room = rooms.push({
			creator: user.uid,
			friend: friend_id
		})

		//new Chat(room.key, user, "chats", database)

	});

 }

function removeUser(data){
	$("#"+data.val().uid).slideUp('fast', function(){
		$(this).remove()
	})
 }

 function newRoom(data){
 	if(data.val().friend ==  user.uid){
 		new Chat(data.key, user, "chats", database)
 	}

 	if(data.val().creator ==  user.uid){
 		new Chat(data.key, user, "chats", database)
 	}
 	


 }

  })()