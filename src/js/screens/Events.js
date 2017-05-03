import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Label from 'grommet/components/Label';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
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
        <ListItem key={index} justify='between' pad={{ horizontal: 'medium', vertical: 'none', between: 'small' }} separator='none'>
            <Label margin='none'>{event.eventTime}</Label>
            <CheckBox checked={event.sensorState == '0' ? false : true} toggle={false} disabled={true} />
            <Label margin='none'><Anchor path={`/sensor/${event.sensorId}`} label={event.sensorId} /></Label>
            <Label margin='none'>{event.sensorLat}</Label>
            <Label margin='none'>{event.sensorLng}</Label>
        </ListItem>
      ));

      listNode = (
        <List>
          {eventsNode}
        </List>
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
