import React from "react";
import { Card, Row, Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { bounceInDown } from 'react-animations';
import Radium, {StyleRoot} from 'radium';
import styles from '../../assets/styles';
import '../../assets/cssStyles.css';
 
const stylesFade = {
  bounce: {
    animation: 'x 1s',
    animationName: Radium.keyframes(bounceInDown, 'bounceInDown')
  }
}

const PokeCard = (props) => {
    
    return (
        <StyleRoot>
            <div style={stylesFade.bounce} >
                <Row style={{ marginRight: 15 }}>
                    <Button variant="danger" onClick={props.onClick} style={styles.favButton}>{props.select ? <ion-icon name="star"></ion-icon> : <ion-icon name="star-outline"></ion-icon>}</Button>
                    <Link to={"/pokemonDetail/" + props.id } params={{ id: props.id }}>
                        <Card border="info" className="boxShadow" style={{ width: '20rem', height: '10rem', margin: 5, borderWidth: props.select ? 8 : 1 }}>
                            <div className="bg-image"></div>
                            <div className="bg-element">
                                <Card.Body style={styles.pokeCardBody}>
                                    <Row style={styles.info}>
                                        <Col style={styles.center}>
                                            <Image style={{ width: 100 }} src={"https://pokeres.bastionbot.org/images/pokemon/" + props.id + ".png"} rounded />
                                        </Col>
                                        <Col>
                                            <Card.Text style={styles.infoText}>
                                                {props.name}
                                            </Card.Text>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </div>

                        </Card>
                    </Link>

                </Row>

            </div>
        </StyleRoot>


    );
}

  export default PokeCard;