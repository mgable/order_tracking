var config = require('./src/config'),
	app = require('express')(), 
	http = require('http').Server(app), 
	io = require('socket.io')(http), 
	port = config.port || 8000, 
	fs = require('fs'),
	 _ = require('underscore'),
	 cancelledOrders = {},
	 contentSorted;


var time = 0;
var currentContent = null;

const fetchtData = () => {
	try {
		contentRaw = fs.readFileSync('./data.json')
		return contentJSON = JSON.parse(contentRaw);
	} catch(e) {
		throw new Error("There was an error parsing the data: " + e)
	}
}


const getDataFn = (data) => {
	return () => {
		let contentJSON = JSON.parse(JSON.stringify(data));
		return contentSorted = _.sortBy(contentJSON, "sent_at_second");
	}
}

const getData = getDataFn(fetchtData())

io.on('connection', (socket) => {
	var cancel;
	socket.on(config.systemMessage, (msg) => {
		console.info("I recieved a message", msg);
		time = 0;
		if (msg === config.start){
			io.emit(config.systemMessage, config.simulationStarted );
			console.log(config.simulationStarted)
			var itemCount = 0;

			currentContent = getData();

			cancel = setInterval(() => {
				let results = _.where(currentContent, {sent_at_second: time});

				_.forEach(results, (result) => {
					io.emit(config.orderMessage, result);
					itemCount++
				});

				io.emit(config.timeMessage, {time});

				time++;

				if (itemCount >= currentContent.length){
					clearInterval(cancel);
					io.emit(config.systemMessage, config.simulationCompleted);
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
		if (msg === config.cancel && orderID){
			removeFromFeed(orderID);
		}
	});
});


const removeFromFeed = (id) => {
	let item = _.findWhere(currentContent, {id});
	if (item){
		item.event_name = config.CANCELLED;
		currentContent = currentContent.filter((item) => item.id !== id)
		io.emit(config.orderMessage, item);
	} else {
		throw new Error ("Can not find the item to cancel. Perhaps it was already delivered or cancelled")
	}
}

http.listen(port, () => {
  console.log('listening on *:' + port);
});
