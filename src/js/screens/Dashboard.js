import React, { Component, PropTypes } from 'react';
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

import GoogleMap from '../components/GoogleMap';

import NavControl from '../components/NavControl';
import {
  loadDashboardEvents, unloadDashboardEvents, loadSensors, unloadSensors
} from '../actions/dashboard';

import { pageLoaded } from './utils';

class Dashboard extends Component {

  componentDidMount() {
    pageLoaded('Dashboard');
    this.props.dispatch(loadDashboardEvents());
    this.props.dispatch(loadSensors());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadDashboardEvents());
    this.props.dispatch(unloadSensors());
  }

  render() {
    const { error, events, sensors } = this.props;
    const { intl } = this.context;

    const sensorsBusy = sensors.filter(sensor => sensor.sensorState);
    const eventsBusy = events.filter(event => event.sensorState);

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
            <td><Label margin='none' align='end'>{sensor.eventTime}</Label></td>
            <td><CheckBox checked={sensor.sensorState == '0' ? false : true} toggle={false} disabled={true} /></td>
            <td><Label margin='none'><Anchor path={`/sensor/${sensor.sensorId}`} label={sensor.sensorId} /></Label></td>
            <td><Label margin='none' align='end'>{sensor.sensorLat}</Label></td>
            <td><Label margin='none' align='end'>{sensor.sensorLng}</Label></td>
        </TableRow>
      ));

      dashboardNode = (
        <Box direction='column' align='start' pad={{horizontal: 'medium', vertical: 'small'}} full='horizontal'>
          <Heading tag='h3' strong={true}>{getMessage(intl, 'Sensors')}</Heading>
          <Box align='start' pad={{horizontal: 'none', vertical: 'medium'}} size={{height: 'large', width: 'full'}} full='horizontal'>
            <GoogleMap center={{lat: 52.1699, lng: 21.0143}} zoom={12} options={{panControl: false, mapTypeControl: false, draggable: false, disableDoubleClickZoom: true, scrollwheel: false }} />
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
