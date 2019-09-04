export const ORDER_RECEIVED = 'ORDER_RECEIVED';

export const orderRecevied = (order) => {
	return {type: ORDER_RECEIVED, order }
}