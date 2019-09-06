import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { CustomMenu, CustomToggle } from '../customMenu';


export const DropDown = ({ props }) => {
	var { onSetSelected, label, items, id } = props;

	const onClick= (evt) => {
		let menu = document.getElementById(id);

		if (evt.target.classList.contains('active')){
			evt.target.classList.remove("active");
		} else {
			evt.target.classList.add("active");
		}

		menu.childNodes.forEach((item) => {
			if (item !== evt.target){
				item.classList.remove('active');
			}
		});
	}

	let itemsHTML = items.map((item) => <Dropdown.Item key={item} onClick={(evt) => {onClick(evt); onSetSelected(evt)}}>{item}</Dropdown.Item>);

	return (
		<Dropdown>
			<Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
				{label}
			</Dropdown.Toggle>
			<Dropdown.Menu as={CustomMenu} id={id}>
				{itemsHTML}
			</Dropdown.Menu>
		</Dropdown>
	);
};
