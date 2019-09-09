import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import TimeThreshold from './';

describe("Time Threshold", () => {
	it('renders without crashing', () => {
		const wrapper = render(<TimeThreshold  />);
		expect(wrapper).toMatchSnapshot();
	});
})
