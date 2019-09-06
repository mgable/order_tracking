import React from 'react';
import './order.css';

const Order = (props) => {
    let {id, destination, event_name, name, sent_at_second } = props;        
    return (
       <div className="order" key={id}>
        <div>Order ID:  <span>{id}</span></div>
        <div>Name: <span>{name}</span></div>
        <div>Desintation: <span>{destination}</span></div>
        <div>Event: <span>{event_name}</span></div>
        <div>Time: <span>{sent_at_second}</span></div>
       </div>
    );
  
}


export default  Order;