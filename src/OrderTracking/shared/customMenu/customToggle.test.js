import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, render } from 'enzyme';
import { CustomToggle } from './';

let props = {onClick: jest.fn()}

it('renders CustomToggle without crashing', () => {
    const wrapper = render(<CustomToggle props = { {...props} } />);
  	expect(wrapper).toMatchSnapshot();
});

