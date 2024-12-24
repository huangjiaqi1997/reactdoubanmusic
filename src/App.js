import React, { Component } from "react";
import Headbar from "./container/Headbar/";
import Playlist from "./container/Playlist/";
import Playmain from "./container/Playmain/";
import Spectrum from "./container/Spectrum/";
import Controllerbar from "./container/Controllerbar/";
import Alert from "./container/Alert/";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import lightBaseTheme from "material-ui/styles/colors";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { theme: darkBaseTheme };
  }
  changeMuiTheme(num) {
    this.setState({ theme: num === 1 ? lightBaseTheme : darkBaseTheme });
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.theme)}>
        <div className="app">
          <Headbar onChangeTheme={(num) => this.changeMuiTheme(num)} />
          <div className="l-m-s-c-wrapper">
            <div className="list-main-wrapper">
              <Playlist />
              <Playmain />
            </div>

            <Controllerbar />
            <Spectrum />
            <Alert />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
