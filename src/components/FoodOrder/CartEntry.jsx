import React from 'react';
import { FlatButton, CardText, FontIcon } from 'material-ui';
import { Row, Col } from 'react-flexbox-grid';
import 'font-awesome/css/font-awesome.min.css';
import propSchema from '../common/PropTypes';

const CartEntry = props => (
  <Row>
    <Col xs={6} sm={6} md={6} lg={6}>
      <CardText>{props.currentItem.quantity} X {props.currentItem.name}</CardText>
    </Col>
    <Col xs={4} sm={4} md={4} lg={4}>
      <CardText>${(props.currentItem.price / 100) * props.currentItem.quantity}</CardText>
    </Col>
    <Col xs={2} sm={2} md={2} lg={2}>
      <FlatButton
        label={<FontIcon className="fa fa-cart-arrow-down" />}
        onClick={() => props.removeFromOrder(props.index)}
      />
    </Col>
  </Row>
);

CartEntry.propTypes = {
  currentItem: propSchema.currentItem,
  removeFromOrder: propSchema.removeFromOrder,
  index: propSchema.index,
};

export default CartEntry;
