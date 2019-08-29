import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

function App() {

      $(function () {
        var socket = window.io();
        $('form').submit(function(){
          socket.emit('chat message', $('#m').val());
          $('#m').val('');
          return false;
        });
        socket.on('chat message', function(msg){
          $('#messages').append($('<li>').text(msg));
          window.scrollTo(0, document.body.scrollHeight);
        });
      });


  return (
    <div className="App">
     hello
    </div>
  );
}

export default App;
