import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import { DropDown } from './';

var props = {onSetSelected: jest.fn(), items: [], label: "foo", id: "bar"}


it('renders without crashing', () => {
    const wrapper = render(<DropDown props={ {...props} } />);
  	expect(wrapper).toMatchSnapshot();
});