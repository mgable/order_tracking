import {
  ORDER_RECEIVED
} from './types';

const initial = {
  raw:[],
  orders: [],
  history: [],
  currentOrder: null
};

const Orders = (state = initial, action) => {
  switch (action.type) {
    case ORDER_RECEIVED:
      return orderReceived(state, action);
    default:
      return state;
  }
};

const orderReceived = (state, action) => {
  let currentOrder = action.order;
  state.orders.push(currentOrder);
  state.raw.push(currentOrder);
  return Object.assign({}, state, {currentOrder});
};


export default Orders;
