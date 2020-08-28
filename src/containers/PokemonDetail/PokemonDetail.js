import React, { Component } from 'react';
import { Card, Row, Col, Container, FormText, Button, Alert, Image } from 'react-bootstrap';
import { connect } from "react-redux";
import { css } from "@emotion/core";
import { getPokemons, getPokemon } from '../../actions/pokemonActions';
import { cathOrReleasePokemon } from '../../actions/catchAndReleaseActions';
import HashLoader from "react-spinners/HashLoader";
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import styles from '../../assets/styles';
import { bounceInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
 
const stylesFade = {
  bounce: {
    animation: 'x 1s',
    animationName: Radium.keyframes(bounceInDown, 'bounceInDown')
  }
}
const override = css`
  display: block;
  margin: 0 auto;
  border-color: skyblue;
`;

class PokemonDetail extends Component {

  constructor(props){
    super(props);
    this.state = {
      catchedPokemons: [],
      limit: 15,
      offset: 0,
      loading: true,
      language: 'en',
      pokeDetails: [],
      showAlert: false,
      alertText: this.props.t('error'),
      select :false,
      pokemon: null
    };
}

  componentDidMount(){
    let url = window.location.href;
    let partOfurl = url.split("/");
      this.props.getPokemon(partOfurl[4]).then(res=>{
        this.setState({pokemon: res, loading:false});
      }).catch(err => {
        this.setState({showAlert: true}, ()=>setTimeout(()=>this.setState({showAlert:false}), 5000))
      })
      this.props.catchedPokemons.map((poke)=>{
        if(poke == partOfurl[4]){
          this.setState({select:true})
        }
      })

  }

  renderAbilities = (abilities) => {
    return abilities.map((ablt, i)=>{
      return <Button key={i} variant={i%4 == 0 ? "success" : i%4 == 1 ? "warning" : i%4 == 2 ? "danger" : "info"} style={styles.abilityButton}>{ablt.ability.name}</Button>
      })
  }

  selectButton = async (id) => {
    let pokemons = []
    this.props.catchedPokemons.map((poke)=>{
        if(this.state.select && poke != id){
          pokemons.push(poke)
        }
    })
    if(!this.state.select){
        pokemons.push(id)
    }
    this.props.cathOrReleasePokemon(pokemons).then(res=>{
      this.setState({select:!this.state.select})
    }).catch(err => {
      this.setState({showAlert: true}, ()=>setTimeout(()=>this.setState({showAlert:false}), 5000))
    })
  }
  render() {
    return (
      <StyleRoot>
      <div style={stylesFade.bounce}>
      <Container>
         <Row style={styles.titleBackground}>
          <FormText style={styles.detailTitle}>{(this.state.pokemon ? (this.state.pokemon.name.charAt(0).toUpperCase() + this.state.pokemon.name.substring(1)) : "") + " " + this.props.t('detail')}</FormText>
        </Row>
        {this.state.showAlert ? <Row style={styles.alert}> <Alert variant="danger"> {this.state.alertText} </Alert> </Row> : null}

        <Row style={{marginTop:20}}>
          <HashLoader
            css={override}
            size={70}
            color={"#123abc"}
            loading={this.state.loading}
          />
        </Row>

      {this.state.pokemon ? 
       <Card className="boxShadow" style={{marginTop:20}}>
          <Card.Body style={{}}>
              <Row style={styles.center}> #{this.state.pokemon.id} {this.state.pokemon.name.charAt(0).toUpperCase() + this.state.pokemon.name.substring(1)}</Row>
            <Row style={{justifyContent:"space-around"}}>
              <Col style={{flex:1}}>
                <Image style={{width:100}} src={"https://pokeres.bastionbot.org/images/pokemon/"+this.state.pokemon.id+".png"} rounded />
              </Col>
              <Col style={{flex:3}}>
                <Card.Text>{this.props.t('weight')} : {this.state.pokemon.weight}</Card.Text>
                <Card.Text>{this.props.t('height')} : {this.state.pokemon.height}</Card.Text>
                <Card.Text>{this.props.t('abilities')} : {this.renderAbilities(this.state.pokemon.abilities)}</Card.Text>
              </Col>
            </Row>
            <Row style={{justifyContent:"flex-end"}}>
              <Button onClick={()=>this.selectButton(this.state.pokemon.id)} variant="danger" style={styles.favButton}>{this.state.select ? <ion-icon name="star"></ion-icon> : <ion-icon name="star-outline"></ion-icon>}</Button>
            </Row>
          </Card.Body>
        </Card> : null
        }
      </Container>
      </div>
    </StyleRoot>
    );
  }
}

const mapStateToProps = state => ({
  pokemons: state.pokemonReducer.pokemons,
  catchedPokemons: state.catchAndReleaseReducer.catchedPokemons,
});


const mapDispatchToProps = {
  getPokemons, cathOrReleasePokemon, getPokemon
}

export default compose(withTranslation('common'), connect(mapStateToProps, mapDispatchToProps))(PokemonDetail);