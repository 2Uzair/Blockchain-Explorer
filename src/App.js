import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Alchemy, Network } from 'alchemy-sdk';
import Table from './Components/Table.js';
import Navbar from './Components/Navbar.js';
import LatestTransactions from './Components/LatestTransactions.js';
import Home from './Components/Home.js';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  return (
    <Router>
      <Navbar alchemy={alchemy}/>
      <Switch>
        <Route exact path="/">
          <Home alchemy={alchemy}/>
        </Route>
        <Route path="/block-details">
          <Table alchemy={alchemy} />
        </Route>
        <Route path="/latest-transactions">
          <LatestTransactions alchemy={alchemy} />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
