var config = require('./src/config'),
	app = require('express')(), 
	http = require('http').Server(app), 
	io = require('socket.io')(http), 
	port = config.port || 8000, 
	fs = require('fs'),
	 _ = require('underscore'),
	 cancelledOrders = {},
	 contentSorted;

try {
	let contentRaw = fs.readFileSync('./data.json'),
		contentJSON = JSON.parse(contentRaw);
	
	contentSorted = _.sortBy(contentJSON, "sent_at_second");
} catch(e) {
	throw new Error("There was an error parsing the data: " + e)
}

console.info("the config", config)

var time = 0;

io.on('connection', (socket) => {
	var cancel;
	socket.on(config.systemMessage, (msg) => {
		console.info("I recieved a message", msg);
		time = 0;
		if (msg === config.start){
			io.emit(config.systemMessage, config.simulationStarted );
			console.log(config.simulationStarted)
			var itemCount = 0,
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
		} else if (msg === connfig.stop){
			clearInterval(cancel);
			io.emit(config.systemMessage, config.simulationStopped );
			console.log(config.simulationStopped)
		}
	});

	socket.on(config.orderMessage, (msg, orderID) => {
		console.info(msg, orderID);
		if (msg === config.cancel && orderID){
			removeFromFeed(orderID);
		}
	});
});


const removeFromFeed = (id) => {
	let item = _.findWhere(contentSorted, {id});
	console.info("the item", item);
	if (item){
		item.event_name = config.CANCELLED;
		contentSorted = contentSorted.filter((item) => item.id !== id)
		io.emit(config.orderMessage, item);
	} else {
		throw new Error ("Can not find the item to cancel. Perhaps it was already delivered or cancelled")
	}
}

http.listen(port, () => {
  console.log('listening on *:' + port);
});
