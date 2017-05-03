import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Anchor from 'grommet/components/Anchor';
import Article from 'grommet/components/Article';
import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Heading from 'grommet/components/Heading';
// import Label from 'grommet/components/Label';
// import List from 'grommet/components/List';
// import ListItem from 'grommet/components/ListItem';
import Notification from 'grommet/components/Notification';
// import Paragraph from 'grommet/components/Paragraph';
// import Value from 'grommet/components/Value';
// import Meter from 'grommet/components/Meter';
import Spinning from 'grommet/components/icons/Spinning';
import { getMessage } from 'grommet/utils/Intl';

import GoogleMap from '../components/GoogleMap';

import NavControl from '../components/NavControl';
import {
  loadDashboard, unloadDashboard
} from '../actions/dashboard';

import { pageLoaded } from './utils';

class Dashboard extends Component {

  componentDidMount() {
    pageLoaded('Dashboard');
    this.props.dispatch(loadDashboard());
  }

  componentWillUnmount() {
    this.props.dispatch(unloadDashboard());
  }

  render() {
    const { error, events } = this.props;
    const { intl } = this.context;

    let errorNode;
    let metersNode;
    let sensorsNode;

    if (error) {
      errorNode = (
        <Notification status='critical' size='large' state={error.message}
          message='An unexpected error happened, please try again later' />
      );
    }

    metersNode = (
      <Box align='start' pad={{horizontal: 'medium', vertical: 'medium'}} size={{width: 'full'}}>

      </Box>
    );

    sensorsNode = (
      <Box align='start' pad={{horizontal: 'medium', vertical: 'medium'}} size={{height: 'large', width: 'full'}}>
        <Heading tag='h3' strong={true}>{getMessage(intl, 'Sensors')}</Heading>
        <GoogleMap center={{lat: 52.1699, lng: 21.0143}} zoom={12} options={{panControl: false, mapTypeControl: false, draggable: false, disableDoubleClickZoom: true, scrollwheel: false }} />
      </Box>
    );

    return (
      <Article primary={true}>
        <Header direction='row' size='large' colorIndex='light-2' align='center' responsive={false} pad={{ horizontal: 'medium' }}>
          <NavControl name={getMessage(intl, 'Dashboard')} />
        </Header>
        {errorNode}
        {metersNode}
        {sensorsNode}
      </Article>
    );
  }
}

Dashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  error: PropTypes.object,
  events: PropTypes.arrayOf(PropTypes.object)
};

Dashboard.contextTypes = {
  intl: PropTypes.object
};

const select = state => ({ ...state.dashboard });

export default connect(select)(Dashboard);
