var app = require('express')(), 
	http = require('http').Server(app), 
	io = require('socket.io')(http), 
	port = process.env.PORT || 8000, 
	fs = require('fs'),
	 _ = require('underscore'),
	 contentSorted;

try {
	let contentRaw = fs.readFileSync('./data.json'),
		contentJSON = JSON.parse(contentRaw);
	
	contentSorted = _.sortBy(contentJSON, "sent_at_second");
} catch(e) {
	throw new Error("There was an error parsing the data: " + e)
}

/*app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});*/

io.on('connection', (socket) => {
	var cancel;
	socket.on('system-message', (msg) => {
		console.info("I recieved a message", msg);
		if (msg === "start"){
			io.emit('system-message', "Simulation Started" );
			console.log("Simulation Started")
			let time = 0,
				itemCount = 0,
				totalItems = contentSorted.length;
			cancel = setInterval(() => {
				let results = _.where(contentSorted, {sent_at_second: time});
					_.forEach(results, (result) => {
						io.emit('order-message', result);
						console.info("result.event_name ", result.event_name)
						itemCount++
					});
					time++;
					if (itemCount === totalItems){
						clearInterval(cancel);
						io.emit('system-message', "Simulation Completed" );
						console.log("Simulation Completed")
					}
			}, 1000);
		} else if (msg === "stop"){
			clearInterval(cancel);
			io.emit('system-message', "Simulation Stopped" );
			console.log("Simulation Stopped")
		}
	});
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});
