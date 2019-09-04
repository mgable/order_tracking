/* constants */
export const CANCELLED = 'CANCELLED';
export const DELIVERED = 'DELIVERED';

/* event types */
export const ORDER_RECEIVED = 'ORDER_RECEIVED';
export const STATUS_RECEIVED = 'STATUS_RECEIVED'

/* event creators */
export const orderRecevied = order => {
	return {type: ORDER_RECEIVED, order }
}

export const statusReceived = status => {
	return {type: STATUS_RECEIVED, status}
}