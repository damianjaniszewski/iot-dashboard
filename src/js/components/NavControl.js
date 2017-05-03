// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Box from 'grommet/components/Box';
import Columns from 'grommet/components/Columns';
import Button from 'grommet/components/Button';
import Title from 'grommet/components/Title';
import Menu from 'grommet/components/Menu';
// import Logo from 'grommet/components/icons/Grommet';
import MenuIcon from 'grommet/components/icons/base/Menu';

import { navActivate } from '../actions/nav';

class NavControl extends Component {
  render() {
    const { name, nav: { active } } = this.props;

    let result;
    const title = <Title>{name || 'Dashboard'}</Title>;
    if (!active) {
      result = (
          <Box direction='row' full='horizontal' justify='between' align='center' pad={{ between: 'small' }}>
            {title}
            <Menu direction="column" justify="end" align="center">
              <Button icon={<MenuIcon />} onClick={() => this.props.dispatch(navActivate(true))} />
            </Menu>
          </Box>
      );
    } else {
      result = title;
    }
    return result;
  }
}

NavControl.propTypes = {
  dispatch: PropTypes.func.isRequired,
  name: PropTypes.string,
  nav: PropTypes.object
};

const select = state => ({
  nav: state.nav
});

export default connect(select)(NavControl);
