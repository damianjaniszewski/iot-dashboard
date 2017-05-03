import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
import Label from 'grommet/components/Label';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import CheckBox from 'grommet/components/CheckBox';
import Notification from 'grommet/components/Notification';
import Meter from 'grommet/components/Meter';
import Value from 'grommet/components/Value';
import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter';
import Spinning from 'grommet/components/icons/Spinning';
import { getMessage } from 'grommet/utils/Intl';

// import GoogleMap from '../components/GoogleMap';
import GoogleMapReact from 'google-map-react';
import LocationIcon from 'grommet/components/icons/base/Location';

import NavControl from '../components/NavControl';
import {
  loadDashboardEvents, unloadDashboardEvents, loadSensors, unloadSensors
} from '../actions/dashboard';

import { pageLoaded } from './utils';

class Dashboard extends Component {

  constructor (props) {
    super(props);
    this._getBoundsZoomLevel = this._getBoundsZoomLevel.bind(this);
  }

  componentDidMount() {
    pageLoaded('Dashboard');
    this.props.dispatch(loadDashboardEvents());
    this.props.dispatch(loadSensors());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadDashboardEvents());
    this.props.dispatch(unloadSensors());
  }

  _getBoundsZoomLevel(ne, sw, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;

    var lngDiff = ne.lng - sw.lng;
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
  }

  render() {
    const { error, events, sensors } = this.props;
    const { intl } = this.context;

    const sensorsBusy = sensors.filter(sensor => sensor.sensorState);
    const eventsBusy = events.filter(event => event.sensorState);

    let latMin;
    let latMax;
    let lngMin;
    let lngMax;

    sensors.forEach((sensor) => {
      latMin = (!latMin || latMin > sensor.sensorLat) ? sensor.sensorLat : latMin;
    });
    sensors.forEach((sensor) => {
      lngMin = (!lngMin || lngMin > sensor.sensorLng) ? sensor.sensorLng : lngMin;
    });
    sensors.forEach((sensor) => {
      latMax = (!latMax || latMax < sensor.sensorLat) ? sensor.sensorLat : latMax;
    });
    sensors.forEach((sensor) => {
      lngMax = (!lngMax || lngMax < sensor.sensorLng) ? sensor.sensorLng : lngMax;
    });

    const center = [latMin+((latMax-latMin)/2), lngMin+((lngMax-lngMin)/2)];
    const zoom = this._getBoundsZoomLevel({lat: latMax, lng: lngMax}, {lat: latMin, lng: lngMin}, {width: 640, height: 240});

    let errorNode;
    let metersNode;
    let dashboardNode;

    if (error) {
      errorNode = (
        <Notification status='critical' size='large' state={error.message}
          message='An unexpected error happened, please try again later' />
      );
    } else if (sensors.length === 0) {
      dashboardNode = (
        <Box direction='row' responsive={false}
          pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}>
          <Spinning /><span>Loading...</span>
        </Box>
      );
    } else {
      const sensorsNode = (sensors || []).map((sensor, index) => (
        <TableRow key={index} justify='between' pad={{ horizontal: 'medium', vertical: 'none', between: 'small' }} separator='none'>
            <td><Label margin='none' align='end'>{(new Date(sensor.eventTime)).getFullYear() +"-"+ ("0" + (new Date(sensor.eventTime)).getMonth()).slice(-2) +"-"+ ("0" + (new Date(sensor.eventTime)).getDate()).slice(-2) + " " + ("0" + (new Date(sensor.eventTime)).getHours()).slice(-2) + ":" + ("0" + (new Date(sensor.eventTime)).getMinutes()).slice(-2) + ":"  + ("0" + (new Date(sensor.eventTime)).getSeconds()).slice(-2)}</Label></td>
            <td><CheckBox checked={sensor.sensorState == '0' ? false : true} toggle={false} disabled={true} /></td>
            <td><Label margin='none'><Anchor path={`/sensor/${sensor.sensorId}`} label={sensor.sensorId} /></Label></td>
            <td><Label margin='none' align='end'>{sensor.sensorLat}</Label></td>
            <td><Label margin='none' align='end'>{sensor.sensorLng}</Label></td>
        </TableRow>
      ));

      const mapNode = (sensors || []).map((sensor, index) => (
        <LocationIcon lat={sensor.sensorLat} lng={sensor.sensorLng} size='large' colorIndex={sensor.sensorState == '0' ? 'brand' : 'accent-3'} />
      ));

      dashboardNode = (
        <Box direction='column' align='start' pad={{horizontal: 'medium', vertical: 'small'}} full='horizontal'>
          <Box align='start' pad={{horizontal: 'none', vertical: 'none'}} size={{height: 'large', width: 'full'}} full='horizontal'>
            <GoogleMapReact bootstrapURLKeys={{key: 'AIzaSyBJff6RhxRZZVV0P5Tdnl0y-h8BNQ6GBFs'}} center={center} zoom={zoom} options={{panControl: false, mapTypeControl: false, draggable: false, disableDoubleClickZoom: true, scrollwheel: false }}>
              {mapNode}
            </GoogleMapReact>
          </Box>
          <Table>
            <thead>
              <tr><th>Time</th><th>State</th><th>ID</th><th>Lat</th><th>Lng</th></tr>
            </thead>
            <tbody>
              {sensorsNode}
            </tbody>
          </Table>
        </Box>
      );
    }

    metersNode = (
      <Box direction='row' full='horizontal' align='stretch' pad={{horizontal: 'medium', vertical: 'small', between: 'small'}}>
        <AnnotatedMeter type='circle' series={[{"label": "Free", "value": sensors.length - sensorsBusy.length, "colorIndex": "brand"}, {"label": "Busy", "value": sensorsBusy.length, "colorIndex": "accent-3"}]} units={getMessage(intl, 'SensorsD')} max={sensors.length} legend={false} />
        <AnnotatedMeter type='circle' series={[{"label": "Free", "value": events.length - eventsBusy.length, "colorIndex": "brand"}, {"label": "Busy", "value": eventsBusy.length, "colorIndex": "accent-3"}]} units={getMessage(intl, 'EventsD')} max={events.length} legend={false} />
      </Box>
    );

    return (
      <Article primary={true}>
        <Header direction='row' size='large' colorIndex='light-2' align='center' responsive={false} pad={{ horizontal: 'medium' }}>
          <NavControl name={getMessage(intl, 'Dashboard')} />
        </Header>
        {errorNode}
        {metersNode}
        {dashboardNode}
      </Article>
    );
  }
}

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.object),
  sensors: PropTypes.arrayOf(PropTypes.object),
};

Dashboard.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.dashboard });

export default connect(select)(Dashboard);
