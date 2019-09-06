/* constants */
export const CREATED = 'CREATED';
export const COOKED = 'COOKED';
export const DRIVER_RECEIVED = 'DRIVER_RECEIVED';
export const DELIVERED = 'DELIVERED';
export const CANCELLED = 'CANCELLED';

export const activeClass = 'active';

export const statusCodes = {[CREATED]: 1, [COOKED]: 2, [DRIVER_RECEIVED]: 3, [DELIVERED]: 4, [CANCELLED]: 5}

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