import React, { Component } from 'react';
import _ from 'lodash';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import propSchema from './PropTypes';

const WrappedMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={11}
    center={props.center}
  >
    {props.markers.map(marker => (
      <Marker
        {...marker}
      />
    ))}
  </GoogleMap>
));

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: { lat: 0, lng: 0 },
    };

    this.handleMapLoad = this.handleMapLoad.bind(this);
    this.calculateCenter = this.calculateCenter.bind(this);
  }

  componentDidMount() {
    this.calculateCenter(this.props.markers);
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(prevProps.markers, this.props.markers)) {
      this.calculateCenter(this.props.markers);
    }
  }

  handleMapLoad(map) {
    this._mapComponent = map;
    if (map) {
      console.log(map.getZoom());
    }
  }

  calculateCenter(markers) {
    // calc average lat and lng to center the map
    let center = Object.assign({}, this.state.center);
    if (markers.length > 0) {
      center = markers.reduce((coords, location) => {
        const curr = coords;
        curr.lat += location.position.lat;
        curr.lng += location.position.lng;
        return curr;
      }, {
        lat: 0,
        lng: 0,
      });

      center.lat /= markers.length;
      center.lng /= markers.length;
    }

    this.setState({ center });
  }

  render() {
    return (
      <div>
        <div style={{ height: '550px', width: '95%', margin: 'auto' }}>
          <WrappedMap
            containerElement={
              <div style={{ height: '100%', width: '100%' }} />
            }
            mapElement={
              <div style={{ height: '100%', width: '100%' }} />
            }
            onMapLoad={this.handleMapLoad}
            markers={this.props.markers}
            center={this.state.center}
          />
        </div>
      </div>
    );
  }
}

MapView.propTypes = {
  markers: propSchema.markers,
};

export default MapView;
