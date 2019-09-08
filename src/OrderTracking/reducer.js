import {
	ORDER_RECEIVED,
	CANCELLED,
	DELIVERED,
	STATUS_RECEIVED,
	RESET_ORDER,
	TIME_RECEIVED,
	SET_THRESHOLD,
	SET_SERVER_STATUS
} from './types';

import { simulationStopped, defaultThreshold, maxOrders } from '../config';

const initialState = {
	orders: {},
	history: {},
	currentOrder: null,
	status: simulationStopped,
	time: null,
	threshold: defaultThreshold,
	serverStatus: null
};

const Orders = (state = initialState, action) => {
	switch (action.type) {
		case ORDER_RECEIVED:
			return orderReceived(state, action);
		case STATUS_RECEIVED:
			return setStatus(state, action);
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


const reset = (state, action) => {
	return Object.assign({}, state, {orders: {}, history: {}, time: null, currentOrder: null, status: simulationStopped });
}

const  setServerStatus = (state, action) => {
	let serverStatus = action.status;

	if (state.serverStatus !== serverStatus) {
		return Object.assign({}, state, {serverStatus});
	}

	return state;
}

const setThreshold = (state, action) => {
	let threshold = action.threshold;

	if (state.threshold !== threshold){
		return Object.assign({}, state, {threshold});
	}

	return state;
}
 
const setTime = (state, action) => {
	let time = action.time.time;
	if (state.time !== time){
		console.info(time)
		return Object.assign({}, state, {time});
	}

	return state;
}

const setStatus = (state, action) => {
	let status = action.status;
	if (state.status !== status){
		return Object.assign({}, state, {status})
	}

	return state;
}

const addToHistory = (state, action) => {
	let currentOrder = action.order,
		id = currentOrder.id,
		history = Object.assign({}, state.history),
		orders = Object.assign({}, state.orders);

	history[id] = currentOrder;

	if (Object.keys(history).length >= maxOrders) { // do not let the object get too big
		let values = Object.values(history),
			sortedValues = values.sort((v1, v2) => v1.sent_at_second > v2.sent_at_second ? 1 : -1),
			lowestValue = sortedValues.pop(),
			id = lowestValue.id;

		delete history[id];

	}

	delete orders[id];

	return Object.assign({}, state, {currentOrder, history, orders})
}

const addOrder = (state, action) => {
	let currentOrder = action.order;
	if (currentOrder.id) {
		let orders = Object.assign({}, state.orders);

		orders[currentOrder.id] = currentOrder;
		return Object.assign({}, state, {currentOrder, orders});
	}

	return state;
}
 
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
