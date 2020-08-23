import React, { Component } from 'react';
import './Pokemons.css';
import { Card, Row, Col, Container, FormText, Button, Form, Alert } from 'react-bootstrap';
import PokeCard from '../../components/PokeCard/PokeCard'
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { css } from "@emotion/core";
import { getPokemons, cathOrReleasePokemon, getPokemon } from '../../actions/pokemonActions';
import HashLoader from "react-spinners/HashLoader";
import { withTranslation, initReactI18next } from 'react-i18next';
import { compose } from 'redux';
import i18n from 'i18next';
import { common } from '../../translations/locales';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: skyblue;
`;

class Pokemons extends Component {

  state = {
    catchedPokemons: [],
    limit: 15,
    offset: 0,
    loading: true,
    language: 'en',
    pokeDetails: [],
    showAlert: false,
    alertText: this.props.t('error')
  };

  componentDidMount(){
    this.getPokemons(15, 0);
    let language = localStorage.getItem('language');
    if(language){
      this.setState({language:language})
    }
  }

  getPokemons = (limit, offset) => {
    try {
      this.props.getPokemons(limit, offset).then(async res=>{
        for(let poke of res.results){
          let url = poke.url.split("/");
          let detail = await this.props.getPokemon(url[6]);
          this.setState({pokeDetails:[...this.state.pokeDetails, detail]})
        }
        this.setState({loading: false});
      }).catch(err => {
        this.setState({showAlert: true}, ()=>setTimeout(()=>this.setState({showAlert:false}), 5000))
      })
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
        return <PokeCard onClick={()=>this.selectPokemon(pokemon.id)} height={pokemon.height} heightText={this.props.t('height')} weight={pokemon.weight} weightText={this.props.t('weight')} select={select} id={pokemon.id} name={pokemon.name} nameText={this.props.t('name')}></PokeCard>
      })
    }
  }

  backPage = () => {
    this.setState({offset: this.state.offset - 15, pokeDetails: [], loading: true});
    this.getPokemons(this.state.limit, this.state.offset - 15);
  }

  nextPage = () => {
    this.setState({offset: this.state.offset + 15, pokeDetails: [], loading: true});
    this.getPokemons(this.state.limit, this.state.offset + 15);
  }

    changeLanguage = (e) => {
      localStorage.setItem('language', e.target.value);
      this.setState({language: e.target.value});
      let language = e.target.value

      const options = {
          interpolation: {
              escapeValue: false,
          },
          debug: true,
          resources: {
              tr: {
                  common: common.tr,
              },
              en: {
                  common: common.en,
              },
          },
          lng: language,
          fallbackLng: language,
          ns: ['common'],
          defaultNS: 'common',
          react: {
              wait: false,
              bindI18n: 'languageChanged loaded',
              bindStore: 'added removed',
              nsMode: 'default'
          },
      };

      i18n
    .use(initReactI18next)
    .init(options)
    }

  render() {
    return (
      <Container>
        <Row style={{backgroundColor:"black", height: '3rem', justifyContent:"center", alignItems:"center", borderRadius:10}}>
          <Col style={{flex:1}}></Col>
          <Col style={{flex:8}}>
            <FormText style={{color: 'white', fontWeight:"600", fontSize:15, marginLeft:"50%"}}>{this.props.t('pokemons')}</FormText>
          </Col>
          <Col style={{flex:1, justifyContent:"center", alignItems:"center"}}>
            <Form.Group>
              <Form.Control size="sm" as="select" onChange={(e)=>this.changeLanguage(e)} value={this.state.language}>
                <option value="tr">Tr</option>
                <option value="en">En</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        
        <Card className="boxShadow" style={{marginTop:20}}>
          <Card.Body>
            <Row style={{justifyContent:"space-around"}}>
              <Card.Text>{this.props.t('catchCount')}: {this.props.catchedPokemons.length}</Card.Text>
              <Link to={"/catchedPokemons"}><Button variant="dark" disabled={this.props.catchedPokemons.length > 0 ? false : true}>{this.props.t('showCatched')}</Button></Link>
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
        <Row style={{marginBottom:20, justifyContent:"flex-end"}}>
          <Button variant="outline-dark" style={{marginRight:2}} onClick={()=>this.backPage()} disabled={this.state.offset == 0 ? true : false} ><i className="fa fa-paper-plane-o "></i>{this.props.t('back')}</Button>
          <Button variant="outline-dark" onClick={()=>this.nextPage()} >{this.props.t('next')}</Button>
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
  getPokemons, cathOrReleasePokemon, getPokemon
}

export default compose(withTranslation('common'), connect(mapStateToProps, mapDispatchToProps))(Pokemons);