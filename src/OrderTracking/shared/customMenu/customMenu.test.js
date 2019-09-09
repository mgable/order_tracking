import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import { CustomMenu } from './';
import configureStore from 'redux-mock-store';

let props = {id: "foo", className: "bar"}

describe("Custom Menu", () => {
	it('renders without crashing', () => {
	    const wrapper = render(<CustomMenu {...props} />);
	  	expect(wrapper).toMatchSnapshot();
	});
});