import React from 'react';
import {Template as ServerError} from './serverError';
import {Template as Panel} from './panel';
import { Button } from 'react-bootstrap';
import TimeThreshold from '../shared/timeThreshold';
import './orderTracking.scss';


const Template = (props) => {
	let { failed, reconnectionAttempts, onClick, status, serverStatus, onChange, orders, history } = props,
  		{ status: o_status, items: o_items, dropDownProps: o_dropDownProps} = orders,
  		{ status: h_status, items: h_items, dropDownProps: h_dropDownProps} = history;

	let html =  (failed) ? <ServerError props={ {reconnectionAttempts}} /> : 
		<div className="row panel">
			<Panel props={ {klass: "active", label: "Orders", status: o_status, items: o_items, dropDownProps: o_dropDownProps}} />
			<Panel props={ {klass: "history", label: "History", status: h_status, items: h_items, dropDownProps: h_dropDownProps}} />
		</div>

	return (
		<div className="order-tracking container">
			<header>
				<Button className="status-button" onClick={onClick}>start</Button>
				<span className="simulation-status">simulation: {status}</span>
				<span className="server-status">server: <span className={"circle " + serverStatus}></span></span>
				<TimeThreshold label={"cook threshold"} handleOnChange={onChange}/>
			</header>

			{html}
			
		</div>
	);
};

export default Template;