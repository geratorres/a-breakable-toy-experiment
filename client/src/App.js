import React, { Component } from 'react';
//TODO import only components css used
import 'antd/dist/antd.css';
import './styles/App.css';

import { BrowserRouter, Route, Link } from "react-router-dom";

import ContactsTable from './components/ContactsTable';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {      
    };
  }

  render() {
    return (
      <ContactsTable/>
    );
  }
}

export default App;
