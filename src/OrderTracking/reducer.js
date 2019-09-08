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

import { simulationStopped, defaultThreshold } from '../config';

const initialState = {
	raw:[],
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
			return setStatus(state, action)
		case RESET_ORDER:
			return initialState;
		case TIME_RECEIVED:
			return setTime(state, action);
		case SET_THRESHOLD:
			return setThreshold(state, action);
		case SET_SERVER_STATUS:
			return setServerStatus(state, action)
		default:
			return state;
	}
};

const  setServerStatus = (state, action) => {
	let serverStatus = action.status;

	if (state.serverStatus !== serverStatus) {
		console.info("serverStatus", serverStatus)
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

const cancelOrder = (state, action) => {
	let currentOrder = action.order,
		id = currentOrder.id,
		history = Object.assign({}, state.history)

	history[id] = currentOrder;

	delete state.orders[id];
	return Object.assign({}, state, {currentOrder, history})
}

const addOrder = (state, action) => {
	let currentOrder = action.order;
	if (currentOrder.id) {
		let raw = state.raw.slice(0),
			orders = Object.assign({}, state.orders);

		orders[currentOrder.id] = currentOrder;
		raw.push(currentOrder);
		return Object.assign({}, state, {currentOrder, orders, raw});
	}

	return state;
}
 
const orderReceived = (state, action) => {
	let currentOrder = action.order;
	switch (currentOrder.event_name) {
		case CANCELLED: 
		case DELIVERED:
			return cancelOrder(state, action);
		default:
			return addOrder(state, action);
	}
};


export default Orders;
