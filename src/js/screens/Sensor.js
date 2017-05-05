import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Meter from 'grommet/components/Meter';
import Notification from 'grommet/components/Notification';
import Value from 'grommet/components/Value';
import Spinning from 'grommet/components/icons/Spinning';
import LinkPrevious from 'grommet/components/icons/base/LinkPrevious';
import { getMessage } from 'grommet/utils/Intl';
import CheckBox from 'grommet/components/CheckBox';
import Paragraph from 'grommet/components/Paragraph';
// import GoogleMap from '../components/GoogleMap';
import GoogleMapReact from 'google-map-react';
import LocationIcon from 'grommet/components/icons/base/Location';

import {
  loadSensor, unloadSensor
} from '../actions/events';

import { pageLoaded } from './utils';

class Sensor extends Component {

  componentDidMount() {
    const { params, dispatch } = this.props;
    pageLoaded('Sensor');
    dispatch(loadSensor(params.id));
  }

  componentWillUnmount() {
    const { params, dispatch } = this.props;
    dispatch(unloadSensor(params.id));
  }

  render() {
    const { error, sensor } = this.props;
    const { intl } = this.context;

    let errorNode;
    let sensorNode;

    if (error) {
      errorNode = (
        <Notification status='critical' size='large' state={error.message}
          message='An unexpected error happened, please try again later' />
      );
    } else if (!sensor) {
      sensorNode = (
        <Box direction='row' responsive={false} pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}>
          <Spinning /><span>Loading...</span>
        </Box>
      );
    } else {
      sensorNode = (
        <Box direction='column' align='start' pad={{horizontal: 'medium', vertical: 'small'}} full='horizontal'>
          <Box align='start' pad={{horizontal: 'none', vertical: 'small'}}>
            <Heading tag='h3' strong={true} pad='none' margin='none'>ID: {sensor.sensorId}</Heading>
            <Label margin='none'>Sensor Type: {sensor.sensorType}</Label>
          </Box>
          <Box align='start' pad={{horizontal: 'none', vertical: 'none'}} size={{height: 'medium', width: 'full'}} full='horizontal'>
            <GoogleMapReact bootstrapURLKeys={{key: 'AIzaSyBJff6RhxRZZVV0P5Tdnl0y-h8BNQ6GBFs'}} center={[sensor.sensorLat, sensor.sensorLng]} zoom={12} options={{panControl: false, mapTypeControl: false, draggable: false, disableDoubleClickZoom: true, scrollwheel: false }}>
              <LocationIcon lat={sensor.sensorLat} lng={sensor.sensorLng} size='large' colorIndex={sensor.sensorState == '0' ? 'brand' : 'accent-3'} />
            </GoogleMapReact>
          </Box>
          <Box align='start' pad={{horizontal: 'none', vertical: 'none'}}>
            <Paragraph margin='none' size='medium'>
              lat: {sensor.sensorLat} lng: {sensor.sensorLng}
            </Paragraph>
          </Box>
          <Box align='start' pad={{horizontal: 'none', vertical: 'small'}}>
            <CheckBox id='parkingBusy' checked={sensor.sensorState == '0' ? false : true} toggle={false} disabled={true} label='Parking Space Busy' />
          </Box>
        </Box>
      );
    }

    return (
      <Article primary={true} full={true}>
        <Header direction='row' size='large' colorIndex='light-2' align='center' responsive={false} pad={{ horizontal: 'small' }}>
          <Anchor path='/dashboard'><LinkPrevious a11yTitle='Back to Dashboard' /></Anchor><Heading margin='none' tag='h3' strong={true}>{getMessage(intl, 'Sensor')}</Heading>
        </Header>
        {errorNode}
        {sensorNode}
      </Article>
    );
  }
}

Sensor.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  params: PropTypes.object.isRequired,
  sensor: PropTypes.object
};

Sensor.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.events });

export default connect(select)(Sensor);
