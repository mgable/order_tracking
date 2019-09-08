// socket io
const port = 8000;
const socketServer = "http://localhost";
const options = {
    'reconnection': true,
    'reconnectionDelay': 1000,
    'reconnectionDelayMax' : 5000,
    'reconnectionAttempts': 5
};

// socket.io message channels
const orderMessage = "order-message";
const systemMessage = "system-message";
const timeMessage = "time-message";

// socket io connection errors
const disconnect = 'disconnect';
const reconnect ='reconnect';
const connect = 'connect';
const reconnecting = 'reconnecting';
const reconnect_failed = 'reconnect_failed';
const socketErrors = [disconnect, reconnect, connect, reconnecting, reconnect_failed ];

// simulation status
const simulationStarted = "started";
const simulationCompleted = "completed";
const simulationStopped = "stopped";

// default time for 'cooked' filter 
const defaultThreshold = 5;

// maximum orders allowed in history
const maxOrders = 5000;

// simulation message statuses
const stop = 'stop';
const start = 'start';
const cancel = 'cancel';

// cloud kitchen order states
const CREATED = 'CREATED';
const COOKED = 'COOKED';
const DRIVER_RECEIVED = 'DRIVER_RECEIVED';
const DELIVERED = 'DELIVERED';
const CANCELLED = 'CANCELLED';

// exports
module.exports.port = port;
module.exports.socketServer = `${socketServer}:${port}`;
module.exports.options = options;
module.exports.orderMessage = orderMessage;
module.exports.systemMessage = systemMessage;
module.exports.timeMessage = timeMessage;
module.exports.disconnect = disconnect;
module.exports.reconnect = reconnect;
module.exports.connect = connect;
module.exports.reconnect_failed = reconnect_failed;
module.exports.reconnecting = reconnecting;
module.exports.socketErrors = socketErrors;
module.exports.simulationStarted = simulationStarted;
module.exports.simulationCompleted = simulationCompleted;
module.exports.simulationStopped = simulationStopped;
module.exports.defaultThreshold = defaultThreshold;
module.exports.maxOrders = maxOrders;
module.exports.CANCELLED = CANCELLED;
module.exports.CREATED = CREATED;
module.exports.DRIVER_RECEIVED = DRIVER_RECEIVED;
module.exports.DELIVERED = DELIVERED;
module.exports.COOKED = COOKED;
module.exports.stop = stop;
module.exports.start = start;
module.exports.cancel = cancel;
