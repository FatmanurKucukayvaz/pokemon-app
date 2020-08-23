import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const Pokemons = Loadable({
  loader: () => import('./containers/Pokemons/Pokemons'),
  loading
});

const CatchedPokemons = Loadable({
  loader: () => import('./containers/CatchedPokemons/CatchedPokemons'),
  loading
});
class App extends Component {

  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/catchedPokemons" name="Catched Pokemons" component={CatchedPokemons}/>
          <Route path="/" name="Pokemons" component={Pokemons} />
        </Switch>
      </HashRouter>
    );
  }
}

export default App;
