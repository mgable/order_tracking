import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { CustomMenu, CustomToggle } from '../customMenu';
import { activeClass } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'



export const DropDown = ({ props }) => {
	var { onSetSelected, label, items, id } = props;

	const onClick= (evt) => {
		let menu = document.getElementById(id);

		if (evt.target.classList.contains(activeClass)){
			evt.target.classList.remove(activeClass);
		} else {
			evt.target.classList.add(activeClass);
		}

		menu.childNodes.forEach((item) => {
			if (item !== evt.target){
				item.classList.remove(activeClass);
			}
		});
	}

	let itemsHTML = items.map((item) => <Dropdown.Item key={item} onClick={(evt) => {onClick(evt); onSetSelected(evt)}}>{item}</Dropdown.Item>);

	return (
		<Dropdown>
			<Dropdown.Toggle split as={CustomToggle} id="dropdown-custom-components">
				{label} <FontAwesomeIcon icon={faSortDown} />
			</Dropdown.Toggle>
			<Dropdown.Menu as={CustomMenu} id={id}>
				{itemsHTML}
			</Dropdown.Menu>
		</Dropdown>
	);
};
