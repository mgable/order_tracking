import React from 'react';
import { connect } from 'react-redux';
import Order from './Order';
import { orderRecevied, statusReceived, activeClass, resetOrder, setTime, setCookThreshold, setServerStatus } from './types';
import  * as config  from '../config'; 
import { DELIVERED, CANCELLED, CREATED, COOKED } from '../config'; 
import TimeThreshold from './shared/timeThreshold';
import { Button } from 'react-bootstrap';
import { DropDown  } from './shared/dropDown';
import './orderTracking.scss';

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


		this.socket.on(config.disconnect, (evt) => this.props.handleSetServerStatus(config.disconnect));
		this.socket.on(config.error, (evt) => this.props.handleSetServerStatus(config.error));
		this.socket.on(config.reconnecting, (evt) => this.props.handleSetServerStatus(config.reconnecting));
		this.socket.on(config.connect, (evt) => this.props.handleSetServerStatus(config.connect));
		this.socket.on(config.reconnect_failed, (evt) => this.props.handleSetServerStatus(config.reconnect_failed));
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

		if ( (currentOrder !== prevState.currentOrder) || (this.state.activeFilter !== prevState.activeFilter) || (this.state.historyFilter !== prevState.historyFilter) ){

			if (this.state.activeFilter) {
				orders = this.filters[this.state.activeFilter](orders, this.state.activeFilter);
				this.activeStatus = <span>orders (<span title='total'>{getLength(this.props.orders) || 0})</span> / <span title="visible">({getLength(orders) || 0}</span>)</span>
			} else {
				this.activeStatus = <span>orders {getLength(orders) || 0}</span>
			}

			if (this.state.historyFilter){
				history = this.filters[this.state.historyFilter](history, this.state.historyFilter);
				this.historyStatus = <span>orders (<span title='total'>{getLength(this.props.history) || 0}</span> / <span title="visible">{getLength(history) || 0}</span>)</span>
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
		let html =  (this.props.serverStatus === config.reconnect_failed) ? <div className="server-error"><h1>Server Error</h1><span>The client has lost the connection from the server and has timed out after {config.options.reconnectionAttempts} reconnect attemps. Please check the server and restart this app.</span></div> :
					<div className="row panel">
						<div className="col-sm-6 border col active">
							<div className="status-bar">
								<h3>Orders</h3>
								{this.activeStatus}
								<DropDown props={ {id: "activeOrdersID", items: [CREATED, COOKED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt,'activeFilter') }} />

							</div>
							{this.state.orders}
						</div>
						<div className="col-sm-6 border col history">
							<div className="status-bar">
								<h3>History</h3>
								{this.historyStatus}
								<DropDown props={ {id: "completedOrdersID", items: [CANCELLED, DELIVERED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt,'historyFilter') }} />
							</div>
							{this.state.history}
						</div>
					</div>

		return (
			<div className="order-tracking container">
				<header>
					<Button className="status-button" onClick={this.onStartSimulation.bind(this)}>start</Button>
					<span className="simulation-status">simulation: {this.props.status}</span>
					<span className="server-status">server: <span className={"circle " + this.props.serverStatus}></span></span>
					<TimeThreshold label={"cook threshold"} handleOnChange={this.onSetCookThreshold.bind(this)}/>
				</header>

				{html}
				
			</div>
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