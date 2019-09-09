import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import { CustomMenu } from './';
import configureStore from 'redux-mock-store';

let props = {onClick: jest.fn()}

it('renders CustomMenu without crashing', () => {
    const wrapper = render(<CustomMenu props = { {...props} } />);
  	expect(wrapper).toMatchSnapshot();
});