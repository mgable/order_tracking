import React from 'react';
import { DropDown  } from '../shared/dropDown';

export const Template = ( {props} ) => {
	var { label, status, dropDownProps, items, klass } = props;

	return (
		<div className={"col-md-6 border panel " + klass }>
			<div className="status-bar">
				<h3>{label}</h3>
				{status}
				<DropDown props={ {...dropDownProps} } />
			</div>
			{items}
		</div>
	);
};