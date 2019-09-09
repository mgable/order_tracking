import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import Order from './';

var wrapper,
	props = {id: "1", destination: "foo" , event_name: "CREATED", name: "name", sent_at_second: 1, onCancelOrder: jest.fn()}

describe("Order Module", () => {

	beforeEach(() => {
		wrapper = shallow(<Order {...props} />);
	});

	it('renders without crashing', () => {
		expect(wrapper).toMatchSnapshot();
	});

	it('should accept a click handler', () => {
		wrapper
			.find('span[data-ut="cancel-order"]')
			.simulate('click');

		expect(props.onCancelOrder).toHaveBeenCalled();
	})
});
