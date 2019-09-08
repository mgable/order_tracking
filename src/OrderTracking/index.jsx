import React from 'react';
import { connect } from 'react-redux';
import Order from './Order';
import { orderRecevied, statusReceived, activeClass, resetOrder, setTime, setCookThreshold, setServerStatus } from './types';
import  * as config  from '../config'; 
import { DELIVERED, CANCELLED, CREATED, COOKED } from '../config'; 
import Template from './templates';
import {Template as ToolBar} from './templates/toolBar';

const uri = config.socketServer;
const options = config.options;

class Orders extends React.Component {
	 constructor(props) {
		super(props);

		this.formattedHistory = <p>There is no history</p>
		this.formattedOrders = <p>There are no orders</p>
		this.state = {currentOrder: null, activeFilter: null, historyFilter: null, orders: this.formattedOrders, history: this.formattedHistory};
		this.onSetSelected = this.onSetSelected.bind(this);
		this.onCancelOrder = this.onCancelOrder.bind(this);

		this.filters = {
			DELIVERED: filter,
			CANCELLED: filter,
			CREATED: filter,
			COOKED: (orders, filterBy) => advancedFilter(orders, filterBy, (this.props.time - this.props.threshold)) // time = curerent time - thresold)
		};
	}

	componentDidMount(){
		this.socket = window.io(uri, options);
		this.socket.on(config.orderMessage, this.onOrderMessage.bind(this));
		this.socket.on(config.systemMessage, this.onSystemMessage.bind(this));
		this.socket.on(config.timeMessage, this.onTimeMessage.bind(this));

		this.socketErrors();
	}

	socketErrors() {
		config.socketErrors.forEach((error) => {
			this.socket.on(error, (evt) => this.props.handleSetServerStatus(error));
		});
	}

	format(orders) {
		let results = [];
		for (var id in orders){
			let order = orders[id];
			if (order.id){
				results.push(<Order key={id} {...order } onCancelOrder={this.onCancelOrder} />);
			}
		}

		return this.sort(results);
	}

	sort(orders) {
		return orders.sort((order1, order2) => order1.props.sent_at_second < order2.props.sent_at_second ? 1 : -1)
	}

	componentDidUpdate(prevProps, prevState) {
		let { orders, history, currentOrder } = this.props;

		if ( 
				(currentOrder !== prevState.currentOrder) || // new current order
				(this.state.activeFilter !== prevState.activeFilter) || // new active filter
				(this.state.historyFilter !== prevState.historyFilter) || // new hisotry filter
				(this.props.threshold !== prevProps.threshold) // new cooking time threshold
			){

			if (this.state.activeFilter) {
				orders = this.filters[this.state.activeFilter](orders, this.state.activeFilter);
				this.activeStatus = <ToolBar { ...{ label: "orders", total: (getLength(this.props.orders) || 0), visible: (getLength(orders) || 0)} }  />
			} else {
				this.activeStatus = <span>orders {getLength(orders) || 0}</span>
			}

			if (this.state.historyFilter){
				history = this.filters[this.state.historyFilter](history, this.state.historyFilter);
				this.historyStatus = <ToolBar { ...{ label: "orders", total: (getLength(this.props.history) || 0), visible: (getLength(history) || 0)} }  />
			} else {
				this.historyStatus = <span>orders {getLength(history) || 0}</span>
			}

			let formattedOrders = this.format(orders),
				formattedHistory = this.format(history);

			this.setState({orders: formattedOrders, currentOrder, history:formattedHistory}) 

		}
	}

	onStartSimulation(){
		this.props.handleReset();
		this.socket.emit(config.systemMessage, config.start);
	}

	onCancelOrder(id) {
		this.socket.emit(config.orderMessage, config.cancel, id);
	}

	onTimeMessage(time){
		this.props.handleTime(time);
	}

	onOrderMessage(order) {
		this.props.handleOrderReceived(order);
	}

	onSystemMessage(status){
		this.props.handleStatusReceived(status);
	}

	onSetCookThreshold(evt) {
		let threshold = evt.target.value;
		this.props.handleSetCookThreshold(threshold);
	}

	onSetSelected(evt, filter) {
		let isActive = evt.target.classList.contains(activeClass);
		if (isActive){
			if (this.state[filter] !== evt.target.text){
				this.setState({[filter]: evt.target.text});
			}
		} else {
			this.setState({[filter]: null});
		}
	}
 
	render() {
		let failed = this.props.serverStatus === config.reconnect_failed;
		return (
			<Template 
				{...{ failed, 
					reconnectionAttempts: config.options.reconnectionAttempts, 
					orders: {
						status: this.activeStatus, 
						items: this.state.orders, 
						dropDownProps: {id: "activeOrdersID", items: [CREATED, COOKED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt,'activeFilter') }}, 
					history: {
						status: this.historyStatus, 
						items: this.state.history, 
						dropDownProps: {id: "completedOrdersID", items: [CANCELLED, DELIVERED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt,'historyFilter') }}, 
					status: this.props.status, 
					serverStatus: this.props.serverStatus, 
					onClick: this.onStartSimulation.bind(this), 
					onChange: this.onSetCookThreshold.bind(this) 
				}
			}
			/>
		);
	}
}


const getLength = obj => {
	return Object.keys(obj).length;
}

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