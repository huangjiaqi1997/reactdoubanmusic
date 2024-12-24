import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "13702056736@163.com",
      password: "Swu6kfzrBLhhb",
      // autoLogin => 设置登录储存cookie，重载时检测cookies
      saveCookie: false,
      emailErrorText: "",
      passwordErrorText: "",
    };
    this.container = document.querySelector(".app");
    this.closeHandle = this.closeHandle.bind(this);
    this.loginHandle = this.loginHandle.bind(this);
    this.toRegister = this.toRegister.bind(this);
    // this.changeHandle = this.changeHandle.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
  }

  checkEmail() {
    this.setState({
      emailErrorText: this.state.email ? "" : "请输入邮箱",
    });
  }
  checkPassword() {
    this.setState({
      passwordErrorText: this.state.password ? "" : "请输入密码",
    });
  }
  closeHandle() {
    this.props.onClose();
  }
  toRegister() {
    this.props.changeDialog("register");
  }
  loginHandle() {
    const { email, password } = this.state;
    this.checkEmail();
    this.checkPassword();
    if (!email || !password) return;
    this.props.onLogin(this.state);
  }

  render() {
    const actions = [
      <FlatButton
        label="登录"
        primary={true}
        keyboardFocused={true}
        onClick={this.loginHandle}
      />,
      <FlatButton
        label="取消"
        primary={true}
        keyboardFocused={true}
        onClick={this.closeHandle}
      />,
    ];
    return (
      <div className="login">
        <Dialog
          className="login-dialog"
          title="登录"
          actions={actions}
          modal={false}
          open={true}
          onRequestClose={this.handleClose}
        >
          <div style={{ textAlign: "center" }}>
            <TextField
              value={this.state.email}
              onChange={(e) => this.setState({ email: e.target.value })}
              hintText="邮箱"
              floatingLabelText="邮箱"
              style={{ marginRight: "100px" }}
              errorText={this.state.emailErrorText}
              onBlur={this.checkEmail}
            />
            <TextField
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
              hintText="密码"
              floatingLabelText="密码"
              type="password"
              errorText={this.state.passwordErrorText}
              onBlur={this.checkPassword}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Login;
