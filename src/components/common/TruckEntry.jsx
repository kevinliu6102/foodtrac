import React from 'react';
import { Link } from 'react-router-dom';
import { Col } from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import propSchema from './PropTypes';
import FollowButton from './FollowButton';
import './TruckEntry.scss';

const TruckEntry = props => (
  <Col xs={12} sm={12} md={6} lg={6}>
    <Paper className="truckEntry">
      <p>{props.truck.brands.name}: {props.truck.name !== 'null' ? <em>{props.truck.name}</em> : null}</p>
      <p>Type of food: {props.truck.brands.food_genres.name}</p>
      <p>Current location: {props.truck.locations ? props.truck.locations.address : 'Not currently active'}</p>
      {props.path === '/brand/:brandId/trucks'
      ? null
      : <Link to={`/brand/${props.truck.brand_id}/trucks`}>
        <RaisedButton label="Go to Profile" />
      </Link>}
      <FollowButton brandId={props.truck.brand_id} user={props.user} path={props.path} />
      {/* temporary order button, switch to only show when order is active*/}
      <Link to={`/order/${1}`}>
        <RaisedButton
          label="Order"
        />
      </Link>
    </Paper>
  </Col>
    );

TruckEntry.propTypes = {
  truck: propSchema.truck,
  user: propSchema.user,
  path: propSchema.path,
};

export default TruckEntry;
