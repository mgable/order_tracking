import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import App from './App';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import reducer, { initialState }  from './OrderTracking/reducer';

const mockStore = configureStore(reducer);
const store = mockStore(initialState)

describe("The Order Tracking App", () => {
	it('renders without crashing', () => {
		const wrapper = render(<Provider store={store}><App  /></Provider>);
		expect(wrapper).toMatchSnapshot();
	});
});
