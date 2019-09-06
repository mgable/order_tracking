import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { Socket, Event } from 'react-socket-io';
import Order from './Order';
import { orderRecevied, statusReceived, DELIVERED, CANCELLED, CREATED, COOKED, activeClass, resetOrder } from './types';
import  * as config  from '../config';

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
	}

  componentDidMount(){
    let socket = window.io(uri);
    socket.on(config.orderMessage, this.onOrderMessage.bind(this));
    socket.on(config.systemMessage, this.onSystemMessage.bind(this));
  }

	format(orders) {
    let results = []
		for (let id in orders){
			let order = orders[id];
			if (order.id){
				results.push(<Order key={id} {...order} />);
			}
		}

    return results
	}

  componentDidUpdate(prevProps, prevState) {
		let { orders, history, currentOrder } = this.props;

    if ( (currentOrder !== prevState.currentOrder) || (this.state.activeFilter !== prevState.activeFilter) || (this.state.historyFilter !== prevState.historyFilter) ){

  		if (this.state.activeFilter) {
  			orders = filter(orders, this.state.activeFilter);
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

  		let formattedOrders = this.format(orders),
  		  formattedHistory = this.format(history);


      this.setState({orders: formattedOrders, currentOrder, history:formattedHistory}) 

    }
	}

	onStartSimulation(){
		var socket = window.io(uri);
    this.props.handleReset();
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
						{this.state.orders}
					</div>
					<div className="col-sm-6 border col">
						<div className="status-bar">
							<h3>History</h3>
							{this.historyStatus}
							<DropDown props={ {id: "completedOrdersID", items: [CANCELLED, DELIVERED], label: "Filter", onSetSelected: (evt) => this.onSetSelected(evt,'historyFilter') }} />
						</div>
						{this.state.history}
				  </div>
				</div>
			</div>
	  	);
	}
}

const hasOrders = orders => {
  return Object.keys(orders).length
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
  	},
    handleReset: () => {
      dispatch(resetOrder())
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);