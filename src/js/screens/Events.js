import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Tiles from 'grommet/components/Tiles';
import Notification from 'grommet/components/Notification';
import Paragraph from 'grommet/components/Paragraph';
import CheckBox from 'grommet/components/CheckBox';
// import Meter from 'grommet/components/Meter';
// import Value from 'grommet/components/Value';
import Spinning from 'grommet/components/icons/Spinning';
import { getMessage } from 'grommet/utils/Intl';

import NavControl from '../components/NavControl';

import {
  loadEvents, unloadEvents
} from '../actions/events';

import { pageLoaded } from './utils';

class Events extends Component {

  componentDidMount() {
    pageLoaded('Events');
    this.props.dispatch(loadEvents());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadEvents());
  }

  render() {
    const { error, events } = this.props;
    const { intl } = this.context;

    let errorNode;
    let listNode;
    if (error) {
      errorNode = (
        <Notification status='critical' size='large' state={error.message}
          message='An unexpected error happened, please try again later' />
      );
    } else if (events.length === 0) {
      listNode = (
        <Box direction='row' responsive={false}
          pad={{ between: 'small', horizontal: 'medium', vertical: 'medium' }}>
          <Spinning /><span>Loading...</span>
        </Box>
      );
    } else {
      const eventsNode = (events || []).map((event, index) => (
        <TableRow key={index} justify='between' pad={{ horizontal: 'medium', vertical: 'none', between: 'small' }} separator='none'>
            <td><Label margin='none' align='end'>{(new Date(event.eventTime)).getFullYear() +"-"+ ("0" + (new Date(event.eventTime)).getMonth()).slice(-2) +"-"+ ("0" + (new Date(event.eventTime)).getDate()).slice(-2) + " " + ("0" + (new Date(event.eventTime)).getHours()).slice(-2) + ":" + ("0" + (new Date(event.eventTime)).getMinutes()).slice(-2) + ":"  + ("0" + (new Date(event.eventTime)).getSeconds()).slice(-2)}</Label></td>
            <td><CheckBox checked={event.sensorState == '0' ? false : true} toggle={false} disabled={true} /></td>
            <td><Label margin='none'><Anchor path={`/sensor/${event.sensorId}`} label={event.sensorId} /></Label></td>
            <td><Label margin='none' align='end'>{event.sensorLat}</Label></td>
            <td><Label margin='none' align='end'>{event.sensorLng}</Label></td>
        </TableRow>
      ));

      listNode = (
        <Table>
          <thead>
            <tr><th>Time</th><th>State</th><th>ID</th><th>Lat</th><th>Lng</th></tr>
          </thead>
          <tbody>
            {eventsNode}
          </tbody>
        </Table>
      );
    }

    return (
      <Article primary={true}>
        <Header direction='row' size='large' colorIndex='light-2' align='center' responsive={false} pad={{ horizontal: 'medium' }}>
          <NavControl name={getMessage(intl, 'Events')} />
        </Header>
        {errorNode}
        {listNode}
      </Article>
    );
  }
}

Events.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.object)
};

Events.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.events });

export default connect(select)(Events);
