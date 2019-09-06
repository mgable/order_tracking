import {
	ORDER_RECEIVED,
	CANCELLED,
	DELIVERED,
	STATUS_RECEIVED
} from './types';

import { simulationStopped } from '../config';

const initial = {
	raw:[],
	orders: {},
	history: [],
	currentOrder: null,
	status: simulationStopped
};

const Orders = (state = initial, action) => {
	switch (action.type) {
		case ORDER_RECEIVED:
			return orderReceived(state, action);
		case STATUS_RECEIVED:
			return setStatus(state, action)
		default:
			return state;
	}
};

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
	state.history.push(currentOrder);
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