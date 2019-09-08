var config = require('./src/config'),
	app = require('express')(), 
	http = require('http').Server(app), 
	io = require('socket.io')(http), 
	port = config.port || 8000, 
	fs = require('fs'),
	 _ = require('underscore'),
	 cancelledOrders = {},
	 contentSorted;


var time = 0; // int - server time in whole seconds
var currentContent = []; // array - holder for data.json

// fetch and parse data 
const fetchtData = () => {
	try {
		contentRaw = fs.readFileSync('./data.json')
		return contentJSON = JSON.parse(contentRaw);
	} catch(e) {
		throw new Error("There was an error parsing the data: " + e)
	}
}

// get copy of data
const getDataFn = (data) => {
	return () => {
		return JSON.parse(JSON.stringify(data)); // deep copy the data "for simulation purposes only"
	}
}

// get fresh data at every "start"
const getData = getDataFn(fetchtData())

io.on('connection', (socket) => {
	var cancel; // holder for setInterval ID

	// system channel handler
	socket.on(config.systemMessage, (msg) => {
		if (msg === config.start){
			time = 0; // reset time at start simulation
			io.emit(config.systemMessage, config.simulationStarted); // emit simulation started message

			currentContent = getData(); // get fresh data

			cancel = setInterval(() => { // set the interval timer to send data every second
				let results = _.where(currentContent, {sent_at_second: time}); // find all orders which madtch the current time

				_.forEach(results, (result) => {
					io.emit(config.orderMessage, result); // emit orders
				});

				io.emit(config.timeMessage, {time}); // emit the current time

				time++; // advance the time

				// delete all the orders sent
				while(results.length){
					let sentOrder = results.pop();
					currentContent = currentContent.filter((order) => order !== sentOrder); // for simulation purposes only
				}

				// if there are no more orders then complete the simulation
				if (!currentContent.length){
					clearInterval(cancel);
					io.emit(config.systemMessage, config.simulationCompleted);
				}

			}, 1000);

		} else if (msg === config.stop){
			clearInterval(cancel);
			io.emit(config.systemMessage, config.simulationStopped );
		} else {
			throw new Error ("Error: Unknown message type: ", msg);
		}
	});

	// order message handler
	socket.on(config.orderMessage, (msg, orderID) => {
		if (msg === config.cancel && orderID){
			removeFromFeed(orderID);
		} else {
			throw new Error ("Error: Unknown message type: ", msg);
		}
	});
});


const removeFromFeed = (id) => {
	let item = _.findWhere(currentContent, {id}); // find an instance of the item to be cancelled
	if (item){
		item.event_name = config.CANCELLED; // make it cancalled
		io.emit(config.orderMessage, item); // send it back
		currentContent = currentContent.filter((item) => item.id !== id); // remove all instances of the order from currentContent
	} else {
		throw new Error ("Can not find the item to cancel. Perhaps it was already delivered or cancelled")
	}
}

http.listen(port, () => {
  console.log('listening on *:' + port); // just for good measure ;)
});
