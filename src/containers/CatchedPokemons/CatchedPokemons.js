import React, { Component } from 'react';
import { Card, Row, Col, Container, FormText, Button, Form, Alert } from 'react-bootstrap';
import PokeCard from '../../components/PokeCard/PokeCard'
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { css } from "@emotion/core";
import { getPokemon } from '../../actions/pokemonActions';
import { cathOrReleasePokemon } from '../../actions/catchAndReleaseActions';
import HashLoader from "react-spinners/HashLoader";
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import styles from '../../assets/styles';
import { bounceInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import '../../assets/cssStyles.css';

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
        let array = []
        for(let poke of this.props.catchedPokemons){
          let detail = await this.props.getPokemon(poke);
          array.push(detail);
        }
        this.setState({pokeDetails:array, loading: false});
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
        return <PokeCard key={i} onClick={()=>this.selectPokemon(pokemon.id)} height={pokemon.height} heightText={this.props.t('height')} weight={pokemon.weight} weightText={this.props.t('weight')} select={select} id={pokemon.id} name={pokemon.name} nameText={this.props.t('name')}></PokeCard>
      })
    }
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
                      <Link to={"/"}><Button variant="dark">{this.props.t('backPokemons')}</Button></Link>
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
              <Button variant="outline-dark" style={{ marginRight: 2 }} onClick={() => this.backPage()} disabled={this.state.offset == 0 ? true : false} ><i className="fa fa-paper-plane-o "></i>{this.props.t('back')}</Button>
              <Button variant="outline-dark" onClick={() => this.nextPage()} >{this.props.t('next')}</Button>
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
  cathOrReleasePokemon, getPokemon
}

export default compose(withTranslation('common'), connect(mapStateToProps, mapDispatchToProps))(CatchedPokemons);