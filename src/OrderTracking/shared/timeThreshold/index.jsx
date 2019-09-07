import React from 'react';
import { Form } from 'react-bootstrap';

const TimeThreshold = ({ label = "please add label", start = 0, end = 20, step = 5, handleOnChange }) => {
	var options = [];
	for (var i = start; i <= end; i += step){
		if (i) {
			options.push(<option key={i} value={i}>{i}</option>)
		}
	}

	return (
		<span className="time-threshold">
			<Form>
				<Form.Label>{label}</Form.Label>
				<Form.Control as="select" onChange={handleOnChange}>
					{options}
				</Form.Control>
			</Form>
		</span>
	);
};

export default TimeThreshold;