import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import App from './App';
import configureStore from 'redux-mock-store';


import reducer from './OrderTracking/reducer';

const initialState = {
	orders: {}, // all currently "active" orders by id
	history: {}, // all "delivered" or "cancelled" orders by id
	currentOrder: null, // last order received
	status: "stopped", // simulation status
	time: null, // server time in whole secondes
	threshold: 5, // "cooked" filter threshold time
	serverStatus: null // server socket status
};

const mockStore = configureStore(reducer);
const store = mockStore(initialState)


console.info("store", store)


it('renders without crashing', () => {
    const wrapper = render(<App store={store} />);
  	expect(wrapper).toMatchSnapshot();
});



// import React from 'react';
// import ReactDOM from 'react-dom';
// import { shallow, render } from 'enzyme';


// import createSagaMiddleware from 'redux-saga';
// import configureStore from 'redux-mock-store';

// const sagaMiddleware = createSagaMiddleware();
// const mockStore = configureStore([sagaMiddleware]);
// const store = mockStore(
//   Object.assign(
//     {},
//     {
//       ProductData: { offers: [], upsells: [] },
//       Drinks: {
//         config: {
//           productPicker: { selectConfiguration: { mysteryPack: false } }
//         }
//       }
//     }
//   )
// );

// it('product picker matches correct snapshot', () => {
//   const wrapper = render(<ProductPicker store={store} />);
//   expect(wrapper).toMatchSnapshot();
// });
