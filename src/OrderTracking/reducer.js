import {
	ORDER_RECEIVED,
	CANCELLED,
	DELIVERED
} from './types';

const initial = {
	raw:[],
	orders: {},
	history: [],
	currentOrder: null
};

const Orders = (state = initial, action) => {
	switch (action.type) {
		case ORDER_RECEIVED:
			return orderReceived(state, action);
		default:
			return state;
	}
};

const cancelOrder = (state, action) => {
	let currentOrder = action.order,
		id = currentOrder.id;
	state.history.push(currentOrder);
	console.info("I am removing", id);
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
