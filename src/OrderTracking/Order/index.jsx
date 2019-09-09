import React from 'react';
import './order.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const Order = (props) => {
	let {id, destination, event_name, name, sent_at_second, onCancelOrder } = props;

	return (
		<div className="order" key={id}>
			<div>Order ID:  <span>{id}</span><span data-ut="cancel-order" onClick={() => onCancelOrder(id) } className='cancel'>&nbsp;<FontAwesomeIcon icon={faTimesCircle} /></span></div>
			<div>Name: <span>{name}</span></div>
			<div>Desintation: <span>{destination}</span></div>
			<div>Event: <span>{event_name}</span></div>
			<div>Time: <span>{sent_at_second}</span></div>
		</div>
	);
}

export default  Order;