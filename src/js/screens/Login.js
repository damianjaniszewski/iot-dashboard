import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import Split from 'grommet/components/Split';
import Sidebar from 'grommet/components/Sidebar';
import LoginForm from 'grommet/components/LoginForm';
import Article from 'grommet/components/Article';
import Section from 'grommet/components/Section';
import Heading from 'grommet/components/Heading';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
// import Logo from 'grommet/components/icons/Grommet';
import BrandHpeElementPathIcon from 'grommet/components/icons/base/BrandHpeElementPath';

import { login } from '../actions/session';
import { navEnable } from '../actions/nav';
import { pageLoaded } from './utils';

class Login extends Component {

  constructor() {
    super();
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    pageLoaded('Login');
    this.props.dispatch(navEnable(false));
  }

  componentWillUnmount() {
    this.props.dispatch(navEnable(true));
  }

  _onSubmit(fields) {
    const { dispatch } = this.props;
    dispatch(login(fields.username, fields.password, '/dashboard'));
  }

  render() {
    const { session: { error } } = this.props;

    return (
      <Split flex='left' separator={true}>

      <Article>
        <Section full={true} colorIndex='brand'
          pad='large' justify='center' align='center'>
          <Paragraph align='center' size='small' margin='none'>
            <BrandHpeElementPathIcon type='logo' size='xlarge' />
          </Paragraph>
          <Paragraph align='center' size='large' margin='none'>
            <strong>HPE Reimagine IT</strong>
          </Paragraph>
          <Paragraph align='center' size='large' margin='none'>
            Everything Computes
          </Paragraph>
        </Section>
      </Article>

      <Sidebar justify='between' align='center' pad='none' size='large'>
        <span />
        <LoginForm align='start'
          title='IoT Demo'
          onSubmit={this._onSubmit} errors={[error]} usernameType='text' />
        <Footer direction='row' size='small'
          pad={{ horizontal: 'medium', vertical: 'small' }}>
          <span className='secondary'>IoT&nbsp;|&nbsp;Dashboard&nbsp;|&nbsp;&copy; 2017 HPE Damian Janiszewski</span>
        </Footer>
      </Sidebar>

      </Split>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.shape({
    error: PropTypes.string
  })
};

const select = state => ({
  session: state.session
});

export default connect(select)(Login);
