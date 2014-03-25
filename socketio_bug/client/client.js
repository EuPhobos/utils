
var url = document.location.href.split('?');
var server = url[1] || '127.0.0.1:8480';
var me = '';
var frame = 0;
var H, W, fps;
var clients;
//alert(server);

//динамическая подгрузка модуля socket.io
var js = document.createElement("script");
js.type = "text/javascript";
js.src = "http://"+server+"/socket.io/socket.io.js";
document.body.appendChild(js);

var ship = [
	{x: 0, y: 0},
	{x:-1, y:-1},
	{x: 2, y: 0},
	{x:-1, y: 1}
];

var socket;
function websock(){
	socket = io.connect('http://'+server);
}

function allReset(){
	socket.socket.reconnect();
	clients = new Array();
	socket.send('new;'+W+','+H);
}

function newMessage(msg){
	msg = msg.split(';');
	var par = msg[1].split(',');

	if (msg[0] == 'ok') { me = msg[1]; allReset(); return; }

	if (msg[0] == 'you') {
//		for ( var i in clients ){
//			if ( clients[i].id == par[0] ) clients.splice(i,1);
//		}
		clients.unshift({
			stat: msg[0],
			id: par[0],
			x: par[1],
			y: par[2],
			a: par[3],
			xv: par[4],
			yv: par[5]
		});
		me = par[0];
		return;
	}

	if ( msg[0] == 'new' ) {
		if (par[0] == me) return;
		clients.push({
			stat: msg[0],
			id: par[0],
			x: par[1],
			y: par[2],
			a: par[3],
			xv: par[4],
			yv: par[5]
		
		});
		return;
	}
	if ( msg[0] == 'del' ) {

		for ( var i in clients ) {
			if ( clients[i].id == par[0] ) {
				clients.splice(i,1);
				break;
			}
		}
	}
}

function newConnection(){
	socket.on('message', newMessage);
}

function init() {
	websock();
	setSize();
	socket.on('connect', newConnection);
	setInterval(draw, 16);
	setInterval(showFPS, 1000);
}
setTimeout(init, 1000);

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.backgroundColor = "#000";

window.onresize = setSize;
function setSize(w,h){
	if ( typeof h === "undefined" ) H = window.innerHeight - 20;
	else H = h;
	if ( typeof h === "undefined" ) W = window.innerWidth - 20;
	else W = w;

	ctx.canvas.width  = W;
	ctx.canvas.height = H;

}

function showFPS(){
	fps = frame;
	frame = 0;
}

function drawShips(){
	
}

function draw() {

	//Background
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, W, H);


	for ( var i in clients ) {

		ctx.fillStyle = "#f00";
		if ( me == clients[i].id ) ctx.fillStyle = "#00f";

		ctx.beginPath();
		ctx.arc(clients[i].x, clients[i].y, 20, Math.PI*2, false);
		ctx.closePath();
		ctx.fill();

	}

	ctx.font = "bold 12px sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillStyle = "red";
	ctx.fillText('Players: '+Object.size(clients)+"; fps: "+fps+"; key: "+keycode, 10, 10 );
	++frame;
}

function rotate(x, y, xm, ym, a) {
    var cos = Math.cos, sin = Math.sin,
    a = a * Math.PI / 180,
    xr = (x - xm) * cos(a) - (y - ym) * sin(a)   + xm,
    yr = (x - xm) * sin(a) + (y - ym) * cos(a)   + ym;

    return [xr, yr];
}

var keys=[];
var keycode=0;
window.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
	keycode = e.keyCode;
	if ( e.keyCode == '77' ) setSize (800, 600);
	if ( e.keyCode == '72' ) setSize ();
	if ( e.keyCode == '65' ) {
		var out = '';
		for ( var i in clients ) {
			out += clients[i].id+'|'+clients[i].x+'|'+clients[i].y+'|'+clients[i].a+'|'+clients[i].stat+"\n";
		}
		alert(out);
	}
//	if ( e.keyCode == '90' ) { alert(io.socket.clients().length); }

});
window.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
