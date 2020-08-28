import React, { Component } from 'react';
import '../../assets/cssStyles.css';
import { Card, Row, Col, Container, FormText, Button, Form, Alert } from 'react-bootstrap';
import PokeCard from '../../components/PokeCard/PokeCard'
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { css } from "@emotion/core";
import { getPokemons, getPokemon } from '../../actions/pokemonActions';
import { cathOrReleasePokemon } from '../../actions/catchAndReleaseActions';
import HashLoader from "react-spinners/HashLoader";
import { withTranslation, initReactI18next } from 'react-i18next';
import { compose } from 'redux';
import i18n from 'i18next';
import { common } from '../../translations/locales';
import styles from '../../assets/styles';
import { bounceInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import Pagination from "react-js-pagination";
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

class Pokemons extends Component {

  state = {
    catchedPokemons: [],
    limit: 15,
    offset: 0,
    loading: true,
    language: 'en',
    pokeDetails: [],
    showAlert: false,
    alertText: this.props.t('error'),
    activePage:1
  };

  componentDidMount(){
    this.getPokemons(15, 0);
    let language = localStorage.getItem('language');
    if(language){
      this.setState({language:language})
    }
  }

  getPokemons = async (limit, offset) => {
    try {
      let pokemons = await this.props.getPokemons(limit, offset);
      this.setState({loading: false, pokeDetails:pokemons.results, offset: this.state.offset + 15})
    } catch (error) {
      this.setState({showAlert: true}, ()=>setTimeout(()=>this.setState({showAlert:false}), 5000))
    }
  }

  selectPokemon = async (id) => {
    let exist = false;
    let pokemons = []
    this.props.catchedPokemons.map((poke)=>{
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
        let url = pokemon.url.split("/");
        this.props.catchedPokemons.map((poke)=>{
            if(poke == url[6]){
                select = true;
            }
        })
        return <PokeCard key={i} onClick={()=>this.selectPokemon(url[6])} select={select} id={url[6]} name={pokemon.name} nameText={this.props.t('name')}></PokeCard>
      })
    }
  }

  backPage = () => {
    this.setState({offset: this.state.offset - 15, pokeDetails: [], loading: true});
    this.getPokemons(this.state.limit, this.state.offset - 15);
  }

  changePage = (e) => {
    this.setState({offset: (e-1)*15, pokeDetails: [], loading: true, activePage:e}, console.log((e-1)*15));
    this.getPokemons(this.state.limit, (e-1)*15);
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
      <StyleRoot>
        <div style={stylesFade.bounce}>

          <Container>
            <Row style={styles.title}>
              <Col style={{ flex: 1 }}></Col>
              <Col style={{ flex: 8 }}>
                <FormText style={styles.titleText}>{this.props.t('pokemons')}</FormText>
              </Col>
              <Col style={styles.lang}>
                <Form.Group>
                  <Form.Control size="sm" as="select" onChange={(e) => this.changeLanguage(e)} value={this.state.language}>
                    <option value="tr">Tr</option>
                    <option value="en">En</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <StyleRoot>
              <div style={styles.bounceInDown}>
                <Card className="boxShadow" style={{ marginTop: 20 }}>
                  <Card.Body>
                    <Row style={{ justifyContent: "space-around" }}>
                      <Card.Text>{this.props.t('catchCount')}: {this.props.catchedPokemons.length}</Card.Text>
                      <Link to="/catchedPokemons"><Button variant="dark" disabled={this.props.catchedPokemons.length > 0 ? false : true}>{this.props.t('showCatched')}</Button></Link>
                    </Row>
                  </Card.Body>
                </Card>
              </div>

            </StyleRoot>

            {this.state.showAlert ? <Row style={styles.alert}> <Alert variant="danger"> {this.state.alertText} </Alert> </Row> : null}

            <Row style={{ marginTop: 20 }}>
              <HashLoader
                css={override}
                size={70}
                color={"#123abc"}
                loading={this.state.loading}
              />
            </Row>
            <Row style={{ justifyContent: "center" }}>

              {this.state.pokeDetails ? this.renderPokemons() : null}
            </Row>

            <Row style={styles.paginationButton}>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={10}
                totalItemsCount={450}
                pageRangeDisplayed={10}
                onChange={this.changePage.bind(this)}
              />
            </Row>
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

export default compose(withTranslation('common'), connect(mapStateToProps, mapDispatchToProps))(Pokemons);