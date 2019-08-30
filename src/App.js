import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Socket, Event } from 'react-socket-io';
 
const uri = 'http://localhost:8000';
const options = { transports: ['websocket'] };
 
export default class App extends React.Component {
     constructor(props) {
        super(props);
        this.onMessage = this.onMessage.bind(this);
    }
 
    onMessage(message) {
        console.log(message);
    }
 
    render() {
        return (
            <Socket uri={uri} options={options}> 
                <Event event='chat message' handler={this.onMessage} />
            </Socket>
        );
    }
}


