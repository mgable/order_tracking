import React from 'react';
import './order.css';

 
export default class Order extends React.Component {
    render() {
        let {id, destination, event_name, name, sent_at_second } = this.props
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
}

      // "destination": "801 Toyopa Dr, Pacific Palisades, CA 90272",
      //   "event_name": "COOKED",
      //   "id": "4b76edbf",
      //   "name": "Cheese pizza",
      //   "sent_at_second": 10