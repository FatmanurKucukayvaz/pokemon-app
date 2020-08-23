import React from "react";
import { Card, Row, Col, Image } from 'react-bootstrap';
import './pokeCard.css';
const PokeCard = (props) => {
    
  return (
    <Card onClick={props.onClick} border="info" className="boxShadow" style={{ width: '18rem', height: '20rem', margin:30, borderWidth:props.select ? 8 : 1}}>
            <div class="bg-image"></div>
            <div class="bg-element">

        <Card.Body style={{justifyContent:"center", alingnItems:"center"}}>
            <Col style={{backgroundColor:"white", height: '15rem', width: '14rem', opacity:0.8, borderRadius:9}}>
                <Row style={{justifyContent:"center", alingnItems:"center"}}>
                    <Image style={{width:100}} src={"https://pokeres.bastionbot.org/images/pokemon/"+props.id+".png"} rounded />
                </Row>
                <Row>
                    <Col>
                        <Card.Text style={{color: 'black', fontSize: 18, fontFamily:"sans-serif", fontWeight: 600}}>
                            {props.nameText} : {props.name}
                        </Card.Text>
                        <Card.Text style={{color: 'black', fontSize: 18, fontFamily:"sans-serif", fontWeight: 600}}>
                            {props.heightText} : {props.height}
                        </Card.Text>
                        <Card.Text style={{color: 'black', fontSize: 18, fontFamily:"sans-serif", fontWeight: 600}}>
                            {props.weightText} : {props.weight}
                        </Card.Text>
                    </Col>
                </Row>
            </Col>
        </Card.Body>
        </div>

    </Card>
  );
}
  
  export default PokeCard;