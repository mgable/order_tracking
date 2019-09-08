import React from 'react';

export const Template = (props) => {
	var { label, total, visible  } = props;

	if (label && total && visible) {
		return (
			<span>{label} (<span title='total'>{total}</span> / <span title="visible">{visible}</span>)</span>
		);
	} else {
		return (
			<span>{label} {total}</span>
		);
	}
};