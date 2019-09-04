import React from 'react';
import './App.css';
import Orders from './OrderTracking';
import 'bootstrap/dist/css/bootstrap.css';
import {Button} from 'react-bootstrap';
import { Socket, Event } from 'react-socket-io';

 
const uri = 'http://localhost:8000'
const options = { transports: ['websocket'] };

const onClick = () => {
	var socket = window.io(uri);
    socket.emit('system-message', "start");
    console.info("I started");
}

const onMessage = (msg) => {
	console.info(msg);
}
 
export const App = () => {
    return (
    	<div className="app">
    		<Button onClick={onClick}>start</Button>
    		<Socket uri={uri} options={options}> 
                <Event event='system-message' handler={onMessage} />
            </Socket>
        	<Orders />
        </div>
    );
}

export default App;
