import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import { DropDown } from './';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import reducer, { initialState }  from '../../reducer';

var props = {onSetSelected: jest.fn(), items: [], label: "foo", id: "bar"}

const mockStore = configureStore(reducer);
const store = mockStore(initialState)

it('renders without crashing', () => {
    const wrapper = render(<Provider store={store}><DropDown props={ {...props} } /></Provider>);
  	expect(wrapper).toMatchSnapshot();
});