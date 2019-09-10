import React from 'react';
import { connect } from 'react-redux';
import Order from './Order';
import { orderRecevied, statusReceived, activeClass, resetOrder, setTime, setCookThreshold, setServerStatus, historyFilter, activeFilter } from './types';
import * as config  from '../config'; 
import { DELIVERED, CANCELLED, CREATED, COOKED } from '../config'; 
import Template from './templates';
import {Template as ToolBar} from './templates/toolBar';

/** public function
 * @description  controller for Order tracking app
 * @param { object }  orders  active orders indexed by id
 * @param { object }  history  completed orders indexed by id
 * @param { object }  currentOrder   last order recieved
 * @param { string }  status   simulation status
 * @param { string }  serverStatus   socket server status
 * @param { int }  time   server time in whole seconds
 * @param { int }  threshold   "cooked" filter time
 * @return { template }  order tracking module
 */
class Orders extends React.Component {
	 constructor(props) {
		super(props);

		// set state variables so page will render correctly
		// currentOrder = props.currentOrder
		// activeFilter = current filter for active orders: null || ENUM: "COOKED" or "CREATED"
		// historyFilter = current filter for history: null || ENUM: "CANCELLED" or "DELIVERED"
		// orders = array for active orders
		// history = array for completed orders
		this.state = {currentOrder: null, activeFilter: null, historyFilter: null, orders: [<p key="orders">There are no orders</p>], history:  [<p key="history">There is no history</p>]};
		// set the selected filter
		this.onSetSelected = this.onSetSelected.bind(this);
		// cancel the order
		this.onCancelOrder = this.onCancelOrder.bind(this);
		// event types are filtered in different ways
		this.filters = {
			DELIVERED: filter,
			CANCELLED: filter,
			CREATED: filter,
			// cooked event needs a lower time limit to filter on
			COOKED: (orders, filterBy) => advancedFilter(orders, filterBy, (this.props.time - this.props.threshold)) // time = curerent time - thresold)
		};
	}

	componentDidMount(){
		// manage socket communication, status and errors
		this.socket = window.io(config.socketServer, config.options);
		this.socket.on(config.orderMessage, this.onOrderMessage.bind(this));
		this.socket.on(config.systemMessage, this.onSystemMessage.bind(this));
		this.socket.on(config.timeMessage, this.onTimeMessage.bind(this));

		this.socketErrors();
	}

	// handle socket io error conditions
	socketErrors() {
		config.socketErrors.forEach((error) => {
			this.socket.on(error, (evt) => this.props.handleSetServerStatus(error));
		});
	}

	// format order or history object into an "Order"
	format(orders) {
		let results = [];
		for (var id in orders){
			let order = orders[id];
			if (order.id){
				results.push(<Order key={id} {...order } onCancelOrder={this.onCancelOrder} />);
			}
		}

		return sort(results);
	}

	componentDidUpdate(prevProps, prevState) {
		let { orders, history, currentOrder } = this.props;

		if ( // render only if these conditions:
				(currentOrder !== prevState.currentOrder) || // new current order
				(this.state.activeFilter !== prevState.activeFilter) || // new active filter
				(this.state.historyFilter !== prevState.historyFilter) || // new history filter
				(this.props.threshold !== prevProps.threshold) // new cooking time threshold
			){

			// if active orders are being filtered
			if (this.state.activeFilter) {
				orders = this.filters[this.state.activeFilter](orders, this.state.activeFilter); // get correct filter for tytpe
				this.activeStatus = <ToolBar { ...{ label: "orders", total: (getLength(this.props.orders) || 0), visible: (getLength(orders) || 0)} }  />
			} else {
				this.activeStatus = <ToolBar { ...{ label: "orders", total: (getLength(this.props.orders) || 0)} }  />
			}

			// if history is being filtered
			if (this.state.historyFilter){
				history = this.filters[this.state.historyFilter](history, this.state.historyFilter); // get correct filter for type
				this.historyStatus = <ToolBar { ...{ label: "orders", total: (getLength(this.props.history) || 0), visible: (getLength(history) || 0)} }  />
			} else {
				this.historyStatus = <ToolBar { ...{ label: "orders", total: (getLength(this.props.history) || 0)} } />
			}

			let formattedOrders = this.format(orders),
				formattedHistory = this.format(history);

			this.setState({orders: formattedOrders, currentOrder, history:formattedHistory}) 
		}
	}

	// simulation controls: start and stop
	onSimulationControls(){
		this.props.handleReset();

		if(this.props.status === config.simulationStopped || this.props.status === config.simulationCompleted) {
			this.socket.emit(config.systemMessage, config.start);
		} else {
			this.socket.emit(config.systemMessage, config.stop);
		}
	}

	// socket io cancel order handler
	onCancelOrder(id) {
		this.socket.emit(config.orderMessage, config.cancel, id);
	}

	// socket io "time message" handler
	onTimeMessage(time){
		this.props.handleTime(time);
	}

	// socket io "order message" handler
	onOrderMessage(order) {
		this.props.handleOrderReceived(order);
	}

	// socket io "system messages" handler
	onSystemMessage(status){
		this.props.handleStatusReceived(status);
	}

	// set cooked filter threshold
	onSetCookThreshold(evt) {
		let threshold = evt && evt.target && evt.target.value;
		if (threshold) {
			this.props.handleSetCookThreshold(threshold);
		} else {
			throw new Error ("ERROR: no threshold value sent");
		}
	}

	// set selected filter
	onSetSelected(evt, filter) {
		let isActive = evt && evt.target && evt.target.classList && evt.target.classList.contains(activeClass);
		if (isActive){
			if (this.state[filter] !== evt.target.text){
				this.setState({[filter]: evt.target.text});
			}
		} else {
			this.setState({[filter]: null});
		}
	}
 
	render() {
		let failed = this.props.serverStatus === config.reconnect_failed; // has the socket server failed?
		return (
			<Template 
				{...{ failed, 
					reconnectionAttempts: config.options.reconnectionAttempts, 
					orders: {
						status: this.activeStatus, 
						items: this.state.orders, 
						dropDownProps: {id: "activeOrdersID", items: [CREATED, COOKED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt, activeFilter) }}, 
					history: {
						status: this.historyStatus, 
						items: this.state.history, 
						dropDownProps: {id: "completedOrdersID", items: [CANCELLED, DELIVERED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt, historyFilter) }}, 
					status: this.props.status, 
					serverStatus: this.props.serverStatus, 
					onClick: this.onSimulationControls.bind(this), 
					onChange: this.onSetCookThreshold.bind(this) 
					}
				}
			/>
		);
	}
}

// class functions

// used to get the total number of orders from a history or order object
const getLength = obj => {
	if (obj && typeof obj === "object"){
		return Object.keys(obj).length;
	} else {
		throw new Error (`${obj} is probably not an object ;)`);
	}
}

// sort orders by time with most current being first
const sort = orders => {
	if (orders && Array.isArray(orders)){
		return orders.sort((order1, order2) => order1.props.sent_at_second < order2.props.sent_at_second ? 1 : -1);
	} else {
		throw new Error (`${orders} is probably not an array ;)`);
	}
}

// filter orders by event_name
const filter = (orders, filterBy) => {
	let results = {}
	for (var id in orders){
		let order = orders[id];
		if (order.event_name === filterBy){
			results[id] = order
		}
	}

	return results;
}

// filter orders by event name and time
const advancedFilter = (orders, filterBy, time) => { // time = curerent time - thresold
	let results = {}
	for (var id in orders){
		let order = orders[id];
		if (order.event_name === filterBy && order.sent_at_second > time){
			results[id] = order
		}
	}

	return results;
}

// Redux state management
const getCurrentOrder = state => state.currentOrder;
const getOrders = state => state.orders;
const getStatus = state => state.status;
const getHistory = state => state.history;
const getTime = state => state.time;
const getThreshold = state => state.threshold;
const getServerStatus = state => state.serverStatus;

const mapStateToProps = state => {
	return {
		currentOrder: getCurrentOrder(state),
		orders: getOrders(state),
		status: getStatus(state),
		history: getHistory(state),
		time: getTime(state),
		threshold: getThreshold(state),
		serverStatus: getServerStatus(state)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		handleOrderReceived: order => {
			dispatch(orderRecevied(order));
		},
		handleStatusReceived: status => {
			dispatch(statusReceived(status))
		},
		handleReset: () => {
			dispatch(resetOrder())
		},
		handleTime: time => {
			dispatch(setTime(time))
		},
		handleSetCookThreshold: threshold => {
			dispatch(setCookThreshold(threshold))
		},
		handleSetServerStatus: status => {
			dispatch(setServerStatus(status))
		}
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Orders);