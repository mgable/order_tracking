import React from 'react';
import './order.css';

 
export default class Order extends React.Component {
     constructor(props) {
        super(props);
        console.info(props)
    }
 
    render() {
        let {id, destination, event_name, name, sent_at_second } = this.props.props
        return (
           <div className="order">
            <div className="id">Order ID:  {id}</div>
            <div className="name">Name: {name}</div>
            <div>Desintation: {destination}</div>
            <div>Event: {event_name}</div>
            <div>Time: {sent_at_second}</div>
           </div>
        );
    }
}

      // "destination": "801 Toyopa Dr, Pacific Palisades, CA 90272",
      //   "event_name": "COOKED",
      //   "id": "4b76edbf",
      //   "name": "Cheese pizza",
      //   "sent_at_second": 10