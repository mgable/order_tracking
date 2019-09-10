import {
	ORDER_RECEIVED,
	STATUS_RECEIVED,
	RESET_ORDER,
	TIME_RECEIVED,
	SET_THRESHOLD,
	SET_SERVER_STATUS
} from './types';

import { simulationStopped, simulationStarted, defaultThreshold, maxOrders, CANCELLED, DELIVERED } from '../config';

// data model
export const initialState = {
	orders: {}, // all currently "active" orders by id
	history: {}, // all "delivered" or "cancelled" orders by id
	currentOrder: null, // last order received
	status: simulationStopped, // simulation status
	time: null, // server time in whole secondes
	threshold: defaultThreshold, // "cooked" filter threshold time
	serverStatus: null // server socket status
};


/** public function
 * @description  model for Order tracking app
 */
const Orders = (state = initialState, action) => {
	switch (action.type) {
		case ORDER_RECEIVED:
			return orderReceived(state, action);
		case STATUS_RECEIVED:
			return setSimulationStatus(state, action);
		case RESET_ORDER:
			return reset(state, action);
		case TIME_RECEIVED:
			return setTime(state, action);
		case SET_THRESHOLD:
			return setThreshold(state, action);
		case SET_SERVER_STATUS:
			return setServerStatus(state, action);
		default:
			return state;
	}
};

// reset the order to restart the simulation
// do not reset "serverStatus" or "threshold"
const reset = (state, action) => {
	return Object.assign({}, state, {orders: {}, history: {}, time: null, currentOrder: null, status: simulationStopped });
}

// set the status of the socket server
const setServerStatus = (state, action) => {
	let serverStatus = action.status;

	if (state.serverStatus !== serverStatus) {
		return Object.assign({}, state, {serverStatus});
	}

	return state;
}

// set the cooked filter time threshold
const setThreshold = (state, action) => {
	let threshold = action.threshold;

	if (state.threshold !== threshold){
		return Object.assign({}, state, {threshold});
	}

	return state;
}

// set the time supplied by the server
const setTime = (state, action) => {
	let time = action.time;
	if (state.time !== time){
		return Object.assign({}, state, {time});
	}

	return state;
}

// set the simulation status to "start" or "stop"
const setSimulationStatus = (state, action) => {
	let status = action.status;
	if (state.status !== status){
		return Object.assign({}, state, {status});
	}

	return state;
}

// add an order of type CANNCELLED or DELIEVERED to history
const addToHistory = (state, action) => {
	let currentOrder = action.order,
		id = currentOrder.id,
		history = Object.assign({}, state.history),
		orders = Object.assign({}, state.orders);

	history[id] = currentOrder;

	// manage the memory on this as the history will grow with each order
	if (Object.keys(history).length >= maxOrders) { // do not let the history object get too big
		let values = Object.values(history),
			sortedValues = values.sort((v1, v2) => v1.sent_at_second > v2.sent_at_second ? 1 : -1),
			lowestValue = sortedValues.pop(),
			id = lowestValue.id;

		delete history[id];

	}

	delete orders[id];

	return Object.assign({}, state, {currentOrder, history, orders})
}

// add an order of type CREATED, COOKED, DRIVER_RECEIVED to orders
const addOrder = (state, action) => {
	let currentOrder = action.order;
	if (currentOrder.id) {
		let orders = Object.assign({}, state.orders);

		orders[currentOrder.id] = currentOrder;
		return Object.assign({}, state, {currentOrder, orders, status: simulationStarted});
	}

	return state;
}

// receive all orders
const orderReceived = (state, action) => {
	let currentOrder = action.order;
	switch (currentOrder.event_name) {
		case CANCELLED: 
		case DELIVERED:
			return addToHistory(state, action);
		default:
			return addOrder(state, action);
	}
};

export default Orders;
