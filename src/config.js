const port = 8000;
const socketServer = "http://localhost";
const options = { transports: ['websocket'] };
const orderMessage = "order-message";
const systemMessage = "system-message";

const simulationStarted = "Simulation Started";
const simulationCompleted = "Simulation Completed";
const simulationStopped = "Simulation Stopped";

const CREATED = 'CREATED';
const COOKED = 'COOKED';
const DRIVER_RECEIVED = 'DRIVER_RECEIVED';
const DELIVERED = 'DELIVERED';
const CANCELLED = 'CANCELLED';

module.exports.port = port;
module.exports.socketServer = `${socketServer}:${port}`;
module.exports.options = options;
module.exports.orderMessage = orderMessage;
module.exports.systemMessage = systemMessage;
module.exports.simulationStarted = simulationStarted;
module.exports.simulationCompleted = simulationCompleted;
module.exports.simulationStopped = simulationStopped;
module.exports.CANCELLED = CANCELLED;
