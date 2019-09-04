import React from 'react';
import { connect } from 'react-redux';
import { Socket, Event } from 'react-socket-io';
import Order from './Order';
import { orderRecevied } from './types';

 
const uri = 'http://localhost:8000';
const options = { transports: ['websocket'] };
 
class Orders extends React.Component {
     constructor(props) {
        super(props);
        this.onMessage = this.onMessage.bind(this);
        this.orders = [];
    }

    componentDidUpdate() {
    	let newOrder = <Order props={ {...this.props.order} } />
      this.orders.push(newOrder)
      window.scrollTo(0, document.body.scrollHeight);
    }
 
    onMessage(order) {
        this.props.handleOrderReceived(order);
    }
 
    render() {
        return (
        	<div>
	            <Socket uri={uri} options={options}> 
	                <Event event='chat message' handler={this.onMessage} />
	            </Socket>
	            <div id="orders">{this.orders}</div>
	        </div>
        );
    }
}

const getOrder = state => state.currentOrder;


const mapStateToProps = state => {
  return {
  	order: getOrder(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleOrderReceived: order => {
      dispatch(orderRecevied(order));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Orders);