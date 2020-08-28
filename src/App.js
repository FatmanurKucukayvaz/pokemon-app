import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Pokemons from './containers/Pokemons/Pokemons';
import CatchedPokemons from './containers/CatchedPokemons/CatchedPokemons';
import PokemonDetail from './containers/PokemonDetail/PokemonDetail';

class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
        <Route exact path="/" >
            <Pokemons/>
          </Route>
          <Route exact path="/catchedPokemons" >
            <CatchedPokemons/>
          </Route>
          <Route exact path="/pokemonDetail/:id" >
            <PokemonDetail/>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
