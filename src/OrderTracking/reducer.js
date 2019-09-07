import {
	ORDER_RECEIVED,
	CANCELLED,
	DELIVERED,
	STATUS_RECEIVED,
	RESET_ORDER,
	TIME_RECEIVED
} from './types';

import { simulationStopped } from '../config';

const initial = {
	raw:[],
	orders: {},
	history: {},
	currentOrder: null,
	status: simulationStopped,
	time: null
};

const Orders = (state = initial, action) => {
	switch (action.type) {
		case ORDER_RECEIVED:
			return orderReceived(state, action);
		case STATUS_RECEIVED:
			return setStatus(state, action)
		case RESET_ORDER:
			return reset(state, action);
		case TIME_RECEIVED:
			return setTime(state, action);
		default:
			return state;
	}
};

const setTime = (state, action) => {
	let time = action.time;
	if (state.time !== time){
		console.info("time is now", time)
		return Object.assign({}, state, {time});
	}

	return state;
}

const reset = (state, action) => {
	return Object.assign({}, {
		raw:[],
		orders: {},
		history: {},
		currentOrder: null,
		status: simulationStopped
	});
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
		id = currentOrder.id;
	state.history[id] = currentOrder;
	delete state.orders[id];
	return Object.assign({}, state, {currentOrder})
}

const addOrder = (state, action) => {
	let currentOrder = action.order;
	if (currentOrder.id) {
		state.orders[currentOrder.id] = currentOrder
		state.raw.push(currentOrder);
		return Object.assign({}, state, {currentOrder});
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
