import React, { Component } from 'react';
import './CatchedPokemons.css';
import { Card, Row, Container, FormText, Button, Alert } from 'react-bootstrap';
import PokeCard from '../../components/PokeCard/PokeCard'
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { css } from "@emotion/core";
import { cathOrReleasePokemon, getPokemon } from '../../actions/pokemonActions';
import HashLoader from "react-spinners/HashLoader";
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: skyblue;
`;
class CatchedPokemons extends Component {

  state = {
    catchedPokemons: [],
    limit: 15,
    offset: 0,
    loading: true,
    pokeDetails: [],
    showAlert: false,
    alertText: this.props.t('error')
  };

  componentDidMount(){
    this.getCatchedPokes()
  }
  
  getCatchedPokes = async () => {
    try {
      if(this.props.catchedPokemons){
        for(let poke of this.props.catchedPokemons){
          let detail = await this.props.getPokemon(poke);
          this.setState({pokeDetails:[...this.state.pokeDetails, detail]});
        }
        this.setState({loading: false});
      } else {
        this.setState({loading:false})
      }
    } catch (error) {
      this.setState({showAlert: true}, ()=>setTimeout(()=>this.setState({showAlert:false}), 5000))
    }
  }

  selectPokemon = async (id) => {
    let exist = false;
    let pokemons = []
    this.props.catchedPokemons.map((poke,i)=>{
        if(poke == id){
            exist = true;
        } else {
            pokemons.push(poke)
        }
    })
    if(!exist){
        pokemons.push(id)
    }
    this.props.cathOrReleasePokemon(pokemons).then(res=>console.log("ok")).catch(err => {
      this.setState({showAlert: true}, ()=>setTimeout(()=>this.setState({showAlert:false}), 5000))
    })
  }

  renderPokemons = () => {
    if(this.state.pokeDetails){
      let pokemons = this.state.pokeDetails;
      return pokemons.map((pokemon, i)=>{
        let select = false;
        this.props.catchedPokemons.map((poke)=>{
            if(poke == pokemon.id){
                select = true;
            }
        })
        if(select)
        return <PokeCard onClick={()=>this.selectPokemon(pokemon.id)} height={pokemon.height} heightText={this.props.t('height')} weight={pokemon.weight} weightText={this.props.t('weight')} select={select} id={pokemon.id} name={pokemon.name} nameText={this.props.t('name')}></PokeCard>
      })
    }
  }

  render() {
    return (
      <Container>
        <Row style={{backgroundColor:"black", height: '3rem', justifyContent:"center", alignItems:"center", borderRadius:10}}>
          <FormText style={{color: 'white', fontWeight:"600", fontSize:15}}>{this.props.t('catchedPokemons')}</FormText>
        </Row>
        <Card className="boxShadow" style={{marginTop:20}}>
          <Card.Body>
            <Row style={{justifyContent:"space-around"}}>
              <Card.Text>{this.props.t('catchCount')}: {this.props.catchedPokemons.length}</Card.Text>
              <Link to={"/"}><Button variant="dark">{this.props.t('backPokemons')}</Button></Link>
            </Row>
          </Card.Body>
        </Card>
        {this.state.showAlert ? <Row style={{marginTop:20, justifyContent:"center"}}> <Alert variant="danger"> {this.state.alertText} </Alert> </Row> : null}

        <Row style={{marginTop:20}}>
          <HashLoader
            css={override}
            size={70}
            color={"#123abc"}
            loading={this.state.loading}
          />
        </Row>
        <Row style={{justifyContent: "center"}}>
          {this.state.pokeDetails ? this.renderPokemons() : null}
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  pokemons: state.pokemonReducer.pokemons,
  catchedPokemons: state.catchAndReleaseReducer.catchedPokemons,
});


const mapDispatchToProps = {
  cathOrReleasePokemon, getPokemon
}

export default compose(withTranslation('common'), connect(mapStateToProps, mapDispatchToProps))(CatchedPokemons);