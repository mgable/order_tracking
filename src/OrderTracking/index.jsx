import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { Socket, Event } from 'react-socket-io';
import Order from './Order';
import { orderRecevied, statusReceived, DELIVERED, CANCELLED, CREATED, COOKED, activeClass } from './types';
import  * as config  from '../config';
import { Button } from 'react-bootstrap';
import { DropDown  } from './shared/dropDown';
import './orderTracking.scss';


const uri = config.socketServer;
const options = config.options;
 
class Orders extends React.Component {
	 constructor(props) {
		super(props);
		this.state = {activeFilter: null, historyFilter: null};
		this.orders = [];
		this.history = []
		this.onSetSelected = this.onSetSelected.bind(this)
	}

	formatOrders(orders, type) {
		for (let id in orders){
			let order = orders[id];
			if (order.id){
				type.push(<Order key={id} {...order} />);
			}
		}
	}

	UNSAFE_componentWillUpdate() {
		let orders = this.props.orders,
		history = this.props.history;

		this.orders = [];
		this.history = []

		if (this.state.activeFilter) {
			orders = filter(orders, this.state.activeFilter)
			this.activeStatus = <span>orders ({getLength(this.props.orders) || 0} / {getLength(orders) || 0})</span>
		} else {
			this.activeStatus = <span>orders {getLength(orders) || 0}</span>
		}

		if (this.state.historyFilter){
			history = filter(history, this.state.historyFilter);
			this.historyStatus = <span>orders (<span title='visible'>{getLength(this.props.history) || 0}</span> / <span title="total">{getLength(history) || 0}</span>)</span>
		} else {
			this.historyStatus = <span>orders {getLength(history) || 0}</span>
		}

		this.formatOrders(orders, this.orders);
		this.formatOrders(history, this.history);
	
		if (!this.orders.length){
			this.orders = <p>There are no orders</p>
		} 

		if (!this.history.length){
			this.history = <p>There is no history</p>
		}
	}

	onStartSimulation(){
		var socket = window.io(uri);
		socket.emit(config.systemMessage, "start");
	}
 
	onOrderMessage(order) {
		this.props.handleOrderReceived(order);
	}

	onSystemMessage(status){
		this.props.handleStatusReceived(status)
	}

	onSetSelected(evt, filter) {
		let isActive = evt.target.classList.contains(activeClass);
		if (isActive){
		if (this.state[filter] !== evt.target.text){
			this.setState({[filter]: evt.target.text})
		}
		} else {
		this.setState({[filter]: null})
		}
	}
 
	render() {
		return (
			<div className="order-tracking container">
				<Socket uri={uri} options={options}> 
					<Event event={config.orderMessage} handler={this.onOrderMessage.bind(this)} />
				</Socket>
				<Socket uri={uri} options={options}> 
					<Event event={config.systemMessage} handler={this.onSystemMessage.bind(this)} />
				</Socket>
				<div>
					<Button className="status-button" onClick={this.onStartSimulation.bind(this)}>start</Button>
					<span>status: {this.props.status}</span>
				</div>

				<div className="row panel">
					<div className="col-sm-6 border col">
						<div className="status-bar">
							<h3>Orders</h3>
							{this.activeStatus}
							<DropDown props={ {id: "activeOrdersID", items: [CREATED, COOKED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt,'activeFilter') }} />

						</div>
						{this.orders}
					</div>
					<div className="col-sm-6 border col">
						<div className="status-bar">
							<h3>History</h3>
							{this.historyStatus}
							<DropDown props={ {id: "completedOrdersID", items: [CANCELLED, DELIVERED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt,'historyFilter') }} />
						</div>
						{this.history}
				  </div>
				</div>
			</div>
	  	);
	}
}

const getLength = obj => {
	return Object.keys(obj).length
}

const filter = (orders, filterBy) => {
  let results = {}
  for (let id in orders){
	let order = orders[id];
	if (order.event_name === filterBy){
	  results[id] = order
	}
  }

  return results;
}

const getCurrentOrder = state => state.currentOrder;
const getOrders = state => state.orders;
const getStatus = state => state.status;
const getHistory = state => state.history;

const mapStateToProps = state => {
  return {
	currentOrder: getCurrentOrder(state),
	orders: getOrders(state),
	status: getStatus(state),
	history: getHistory(state),

  };
};

const mapDispatchToProps = dispatch => {
  return {
	handleOrderReceived: order => {
	  dispatch(orderRecevied(order));
	},
	handleStatusReceived: status => {
	  dispatch(statusReceived(status))
	}
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);