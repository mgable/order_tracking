var config = require('./src/config'),
	app = require('express')(), 
	http = require('http').Server(app), 
	io = require('socket.io')(http), 
	port = config.port || 8000, 
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
	socket.on(config.systemMessage, (msg) => {
		console.info("I recieved a message", msg);
		if (msg === "start"){
			io.emit(config.systemMessage, config.simulationStarted );
			console.log(config.simulationStarted)
			let time = 0,
				itemCount = 0,
				totalItems = contentSorted.length;
			cancel = setInterval(() => {
				let results = _.where(contentSorted, {sent_at_second: time});
					_.forEach(results, (result) => {
						io.emit(config.orderMessage, result);
						console.info("result.event_name ", result.event_name)
						itemCount++
					});
					time++;
					if (itemCount === totalItems){
						clearInterval(cancel);
						io.emit(config.systemMessage, config.simulationCompleted );
						console.log(config.simulationCompleted)
					}
			}, 1000);
		} else if (msg === "stop"){
			clearInterval(cancel);
			io.emit(config.systemMessage, config.simulationStopped );
			console.log(config.simulationStopped)
		}
	});
});

http.listen(port, () => {
  console.log('listening on *:' + port);
});
