import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import Order from './';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import reducer, { initialState }  from '../reducer';

const mockStore = configureStore(reducer);
const store = mockStore(initialState)

it('renders without crashing', () => {
    const wrapper = render(<Provider store={store}><Order  /></Provider>);
  	expect(wrapper).toMatchSnapshot();
});