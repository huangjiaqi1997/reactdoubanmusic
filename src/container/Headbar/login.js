import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email:'',
      password: '',
      // autoLogin => 设置登录储存cookie，重载时检测cookies
      saveCookie: false
    };
    this.container = document.querySelector('.app')
    this.closeHandle = this.closeHandle.bind(this);
    this.loginHandle = this.loginHandle.bind(this);
    this.toRegister = this.toRegister.bind(this);
    // this.changeHandle = this.changeHandle.bind(this);
  }

  closeHandle() {
    this.props.onClose()
  }
  toRegister() {
    this.props.changeDialog('register');
  }
  loginHandle() {
    const {telEml, pwd, saveCookie} = this.state;
    this.props.onLogin({telEml, pwd, saveCookie})
  }

  render () { 
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        keyboardFocused={true}
        onClick={this.closeHandle}
      />,
    ];
    return (
      <div className="login">
        <Dialog
          title="Dialog With Date Picker"
          actions={actions}
          modal={false}
          open={true}
          onRequestClose={this.handleClose}
        >
        <div>
          <TextField
            onChange={(e)=>this.setState({email: e.target.value})}
            hintText="Hint Text"
            floatingLabelText="Floating Label Text"/>
          <TextField
            onChange={(e)=>this.setState({password: e.target.value})}
            hintText="Hint Text"
            floatingLabelText="Floating Label Text"
            type="password"/>
          <FlatButton
            label="登录"
            primary={true}
            keyboardFocused={true}
            onClick={()=> this.props.onLogin(this.state) }
          />
        </div>
          
        </Dialog>
      </div>
    );
  }
}




export default Login;

