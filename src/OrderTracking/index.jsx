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

    UNSAFE_componentWillUpdate() {
      let orders = this.props.orders;
      this.orders = [];

      for (let id in orders){
        let order = orders[id]
        if (order.id){
          this.orders.push(<Order key={id} {...order} />);
        }
      }
    
      if (!this.orders.length){
        this.orders = <h4>There are no orders</h4>
      } 
    }
 
    onMessage(order) {
        this.props.handleOrderReceived(order);
    }
 
    render() {
      return (
      	<div className="order-tracking">
            <Socket uri={uri} options={options}> 
                <Event event='order-message' handler={this.onMessage} />
            </Socket>
            {this.orders}
        </div>
      );
    }
}

const getCurrentOrder = state => state.currentOrder;
const getOrders = state => state.orders;

const mapStateToProps = state => {
  return {
  	currentOrder: getCurrentOrder(state),
    orders: getOrders(state)
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