import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Chip } from 'material-ui'
import { AlertError } from 'material-ui/svg-icons';

class Alert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      message: ''
    }
    this.show = false
  }
  componentDidUpdate(prevProps) {
    const propsUserErr = this.props.userErr
    const propsSongErr = this.props.songErr
    if(prevProps.userErr !== propsUserErr || prevProps.songErr !== propsSongErr) {
      let timer;
      this.state.show && clearTimeout(timer)

      this.setState({ show: true, message: prevProps.userErr !== propsUserErr ? propsUserErr.message : propsSongErr.message })
      timer = setTimeout(() => {
        this.setState({ show: false })
      }, 1500)
    }
  }

  render() {
    return <Chip
    className='chip'
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        transition: 'top .3s ease',
        top: this.state.show ? '20px' : '-50px',
        minWidth: '120px'
      }}
      color="secondary"
    >
      <AlertError></AlertError>
      <div style={{ marginLeft: '10px' }}>{this.state.message}</div>
    </Chip>
  }
}

const mapStateToprops = (state) => ({
  userErr: state.user.error,
  songErr: state.song.error
})
export default connect(mapStateToprops, null)(Alert);