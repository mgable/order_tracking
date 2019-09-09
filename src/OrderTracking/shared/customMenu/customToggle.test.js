import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import { CustomToggle } from './';

let props = {onClick: jest.fn()},
	event = {preventDefault: jest.fn()};

describe("Custom Toggle", () => {
	it('renders without crashing', () => {
		const wrapper = render(<CustomToggle {...props}  />);
		expect(wrapper).toMatchSnapshot();
	});


	it('should accept a click handler', () => {
		const wrapper = shallow(<CustomToggle {...props}  />);
		wrapper.simulate('click', event);
		expect(props.onClick).toHaveBeenCalled();
		expect(event.preventDefault).toHaveBeenCalled();
	});
});