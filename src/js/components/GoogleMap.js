import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import LocationIcon from 'grommet/components/icons/base/Location';
// import SVGIcon from 'grommet/components/SVGIcon';

export default class GoogleMap extends Component {

  constructor (props) {
    super(props);
  }

  render () {
    return (
        <GoogleMapReact apiKey='AIzaSyBJff6RhxRZZVV0P5Tdnl0y-h8BNQ6GBFs' center={this.props.center} zoom={this.props.zoom} options={this.props.options} onChange={this.props.onChange} onClick={this.props.onClick}>
          <LocationIcon lat={this.props.center.lat} lng={this.props.center.lng} size='large' colorIndex='brand' />
        </GoogleMapReact>
    );
  }
}

GoogleMap.propTypes = {
  center: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
  options: PropTypes.array,
  onChange: PropTypes.function,
  onClick: PropTypes.function
};
