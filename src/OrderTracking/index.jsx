import React from 'react';
import { connect } from 'react-redux';
import { Socket, Event } from 'react-socket-io';
import Order from './Order';
import { orderRecevied, statusReceived } from './types';
import  * as config  from '../config';
import {Button} from 'react-bootstrap';
import './orderTracking.scss';


const uri = config.socketServer;
const options = config.options;
 
class Orders extends React.Component {
     constructor(props) {
        super(props);
        this.orders = [];
    }

    UNSAFE_componentWillUpdate() {
      let orders = this.props.orders,
        history = this.props.history;

      this.orders = [];
      this.history = []

      for (let id in orders){
        let order = orders[id]
        if (order.id){
          this.orders.push(<Order key={id} {...order} />);
        }
      }

      this.history = history.map((order) => <Order key={order.id} {...order} />)
    
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
      console.info("I started");
    }
 
    onOrderMessage(order) {
      console.info("I received an order", order);
        this.props.handleOrderReceived(order);
    }

    onSystemMessage(status){
      this.props.handleStatusReceived(status)
    }
 
    render() {
      return (
      	<div className="order-tracking container">
            <div>
              <Button className="status-button" onClick={this.onStartSimulation.bind(this)}>start</Button>
              <span>status: {this.props.status}</span>
            </div>
            <Socket uri={uri} options={options}> 
                <Event event={config.orderMessage} handler={this.onOrderMessage.bind(this)} />
            </Socket>
            <Socket uri={uri} options={options}> 
              <Event event={config.systemMessage} handler={this.onSystemMessage.bind(this)} />
            </Socket>

            <div className="row panel">
              <div className="col-sm-6 border col">
                <h3>Orders</h3>
                {this.orders}
              </div>
              <div className="col-sm-6 border col">
                <h3>History</h3>
                {this.history}
              </div>
            </div>
        </div>
      );
    }
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
    history: getHistory(state)
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