#!/usr/bin/node

var io = require('socket.io').listen(8480);
var sys = require('sys');

//var console = require('./s_console.js');


var stdin = process.openStdin();


stdin.addListener('data', inConsole);

function inConsole(msg){
	msg = msg.toString().substring(0, msg.length-1);

	if ( msg == 'help' ) { l('help not ready yet :p'); return; }
	if ( msg == 'reset' ) { l('Send RESET'); servReset(); return;}
	if ( msg == 'quit' ) { l('bye'); process.exit(); }
	if ( msg == 'stats' ) {
		l('Players: '+Object.size(clients));
		for ( var i in clients ) {
			l('id:'+clients[i].id+'; x:'+clients[i].x+';y:'+clients[i].y+';a:'+clients[i].a);
		}
		return;
	}
	if ( msg == 'sock' ) {
		var sock = io.sockets.clients();
		l(sock.length);
		for ( i in sock ) { l(sock[i]); }
		return;
	}

	l('['+msg+'] undefined, type "help"');
}

function l(msg){
	console.log('Server: '+msg);
}

//io.set('log level', 1);

var clients= new Array();

//Подключение новых клиентов
io.sockets.on('connection', newClient);

function newClient(socket){

	var id = (socket.id).toString();

	l("incoming: "+id);


/*
	var client = {
		id: (socket.id).toString(),
		x: 200 + Math.round(Math.random() * 500),
		y: 200 + Math.round(Math.random() * 500),
		a: 0,
		xv: 0,
		yv: 0
	}
	clients.push(client);

	socket.send('you'
		+';'+client.id
		+','+client.x
		+','+client.y
		+','+client.a
		+','+client.xv
		+','+client.yv
	);

	for ( var i in clients ) {
		if ( clients[i].id == client.id ) continue;
		socket.send('new'
			+';'+clients[i].id
			+','+clients[i].x
			+','+clients[i].y
			+','+clients[i].a
			+','+clients[i].xv
			+','+clients[i].yv
		);
	}

	socket.broadcast.send('new'
		+';'+client.id
		+','+client.x
		+','+client.y
		+','+client.a
		+','+client.xv
		+','+client.yv
	);
*/
	for ( var i in clients ) {
		l(clients[i].id+'|'+clients[i].x+'|'+clients[i].y+'|'+clients[i].a);
	}

	socket.send('ok;');

	socket.on('message', incomingMsg.bind(null, socket, id));

	socket.on('disconnect', remClient.bind(null, id));

}

function incomingMsg(socket, id, msg){
//	l((socket.id).toString()+' | '+id+' | '+msg);
	msg = msg.split(';');
	par = msg[1].split(',');

	//Запрос на новое подключение
	if ( msg[0] == 'new' ) {

		//Создаём игрока
		var client = {
			id: (socket.id).toString(),
			x: 100 + Math.round(Math.random() * 200),
			y: 100 + Math.round(Math.random() * 200),
			a: 0,
			xv: 0,
			yv: 0
		}
		clients.push(client);

		//Посылаем параметры игрока
		socket.send('you'
			+';'+id
			+','+client.x
			+','+client.y
			+','+client.a
			+','+client.xv
			+','+client.yv
		);

		//Посылаем параметры остальных игроков новому игроку
		for ( var i in clients ) {
			if ( clients[i].id == id ) continue;
			socket.send('new'
				+';'+clients[i].id
				+','+clients[i].x
				+','+clients[i].y
				+','+clients[i].a
				+','+clients[i].xv
				+','+clients[i].yv
			);
		}

		//Остальным посылаем о новом игроке
		socket.broadcast.send('new'
			+';'+client.id
			+','+client.x
			+','+client.y
			+','+client.a
			+','+client.xv
			+','+client.yv
		);
	}
}

function remClient(id) {
	console.log("rem: "+id);
	for ( var i in clients ) {
		if ( clients[i].id == id ) {
			io.sockets.send('del'
				+';'+clients[i].id
				+','+clients[i].x
				+','+clients[i].y
				+','+clients[i].a
				+','+clients[i].xv
				+','+clients[i].yv
			);
			clients.splice(i,1);
			break;
		}
	}
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

function servReset(){
	clients = new Array();
	io.sockets.send('ok;');
}
//setTimeout(servReset,1000);

function allUpdate(){
/*
	console.log(Object.size(clients));
	for ( var i in clients ) {
		console.log('Clients: '+clients[i].id);
		console.log('---===---');
	}
*/
}
//setInterval(allUpdate, 2000);
