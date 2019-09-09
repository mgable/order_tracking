import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import Orders from './';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import reducer, { initialState }  from './reducer';

import { ORDER_RECEIVED, STATUS_RECEIVED, RESET_ORDER, TIME_RECEIVED, SET_THRESHOLD, SET_SERVER_STATUS, orderRecevied, statusReceived, resetOrder, setTime, setCookThreshold, setServerStatus } from './types';

var order = {
	"destination": "801 Toyopa Dr, Pacific Palisades, CA 90272",
	"event_name": "CREATED",
	"id": "4b76edbf",
	"name": "Cheese pizza",
	"sent_at_second": 4
}

const mockStore = configureStore(reducer);
const store = mockStore(initialState)


describe('Template', () => {
	it('renders without crashing', () => {
		const wrapper = render(<Provider store={store}><Orders  /></Provider>);
		expect(wrapper).toMatchSnapshot();
	});
});

describe('Reducer', () => {
	it('should initial initialState', () => {
		expect(reducer(undefined, { type: 'dummy_action' })).toEqual(
			initialState
		);
	});

	it('should add an order', () => {
		let state = Object.assign({}, initialState, { orders: {[order.id]: order}, currentOrder: order });
		expect(
			reducer(undefined, orderRecevied(order))
		).toEqual(state);
	});

	it('should set the simulation status', () => {
		let status = "connected",
			state = Object.assign({}, initialState, { status });
		expect(
			reducer(undefined, statusReceived(status))
		).toEqual(state);
	});

	it('should reset the order', () => {
		let state = Object.assign({}, initialState);
		expect(
			reducer(undefined, resetOrder())
		).toEqual(state);
	});

	it('should set the server time', () => {
		let time = 10,
			state = Object.assign({}, initialState, {time});
		expect(
			reducer(undefined, setTime(time))
		).toEqual(state);
	});

	it('should set the cooked filter threshold', () => {
		let threshold = 10,
			state = Object.assign({}, initialState, {threshold});
		expect(
			reducer(undefined, setCookThreshold(threshold))
		).toEqual(state);
	});

	it('should set the server status', () => {
		let serverStatus = "connected",
			state = Object.assign({}, initialState, {serverStatus});
		expect(
			reducer(undefined, setServerStatus(serverStatus))
		).toEqual(state);
	});
});

describe('Actions', () => {
	beforeEach(() => {
	// Runs before each test in the suite
	store.clearActions();
});

	it('receives an order', () => {
		store.dispatch(orderRecevied(order));
		expect(store.getActions()).toEqual([
			{ order, type: ORDER_RECEIVED }
		]);
	});

	it('receives an simulation status', () => {
		let status = "started";
		store.dispatch(statusReceived(status));
		expect(store.getActions()).toEqual([
			{ status, type: STATUS_RECEIVED }
		]);
	});

	it('receives an simulation status', () => {
		let status = "started";
		store.dispatch(statusReceived(status));
		expect(store.getActions()).toEqual([
			{ status, type: STATUS_RECEIVED }
		]);
	});

	it('receives a reset order', () => {
		store.dispatch(resetOrder());
		expect(store.getActions()).toEqual([
			{ type: RESET_ORDER }
		]);
	});

	it('receives server time', () => {
		var time = 10;
		store.dispatch(setTime(time));
		expect(store.getActions()).toEqual([
			{ time, type: TIME_RECEIVED }
		]);
	});

	it('receives cooked filter time threshold', () => {
		var threshold = 10;
		store.dispatch(setCookThreshold(threshold));
		expect(store.getActions()).toEqual([
			{ threshold , type: SET_THRESHOLD }
		]);
	});

	it('receives server status', () => {
		var status = "connected";
		store.dispatch(setServerStatus(status));
		expect(store.getActions()).toEqual([
			{ status , type: SET_SERVER_STATUS }
		]);
	});
});