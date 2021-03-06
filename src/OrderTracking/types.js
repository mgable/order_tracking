/* constants */
export const activeClass = 'active';
export const activeFilter = 'activeFilter';
export const historyFilter = 'historyFilter'

/* event types */
export const ORDER_RECEIVED = 'ORDER_RECEIVED';
export const STATUS_RECEIVED = 'STATUS_RECEIVED'
export const RESET_ORDER = 'RESET_ORDER';
export const TIME_RECEIVED = 'TIME_RECEIVED';
export const SET_THRESHOLD = 'SET_THRESHOLD';
export const SET_SERVER_STATUS = 'SET_SERVER_STATUS';

/* event creators */
export const orderRecevied = order => {
	return {type: ORDER_RECEIVED, order };
}

export const statusReceived = status => {
	return {type: STATUS_RECEIVED, status };
}

export const resetOrder = () => {
	return {type: RESET_ORDER };
}

export const setTime = time => {
	return {type: TIME_RECEIVED, time };
}

export const setCookThreshold = threshold => {
	return {type: SET_THRESHOLD, threshold };
}

export const setServerStatus = status => {
	return {type: SET_SERVER_STATUS, status }
}