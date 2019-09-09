import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import { CustomMenu } from './';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import reducer, { initialState }  from '../../reducer';

const mockStore = configureStore(reducer);
const store = mockStore(initialState);

let props = {onClick: jest.fn()}

it('renders CustomMenu without crashing', () => {
    const wrapper = render(<Provider store={store}><CustomMenu props = { {...props} } /></Provider>);
  	expect(wrapper).toMatchSnapshot();
});