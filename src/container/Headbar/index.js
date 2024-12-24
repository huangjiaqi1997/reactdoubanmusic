import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { getUserID } from "../../reducer/user";
import { login, register, logout } from "../../reducer/user";
import { getMyPlaAndCol } from "../../reducer/song";
import { removePlaAndColAll } from "../../reducer/song";
import { changeTheme } from "../../reducer/user";
import Login from "./login";
import Collection from "../Collection/";
import SearchResult from "../SearchResult/";

import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import Star from "material-ui/svg-icons/toggle/star";
import Search from "material-ui/svg-icons/action/search";
import ColorLens from "material-ui/svg-icons/image/color-lens";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";

// import { changeTheme } from '../../reducer/song'

const styles = {
  button: {
    margin: 3,
    height: 35,
    lineHeight: "20px",
  },
};
const deteleRules = () => {
  const sheet = document.styleSheets[0];
  const rulesLen = (sheet.cssRules || sheet.rules).length;
  if (sheet.cssRules.length === 21) {
    for (let i = 0; i < 5; i++) {
      sheet.deleteRule(0);
    }
  }
};
class Headbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginModal: false,
      showSearchButton: true,
      showSearchModal: false,
      showCollectionModal: false,
      searchText: "",
      searchResult: [],
      // 标志， 避免多次请求
      getMyPlaAndColDone: false,
    };
    this.child_loginHandle = this.child_loginHandle.bind(this);
    this.child_registerHandle = this.child_registerHandle.bind(this);
    this.logoutHandle = this.logoutHandle.bind(this);
    // this.handleChangeTheme = this.handleChangeTheme.bind(this)
  }

  // 载入页面后
  // 获取用户cookies，获取userId（标志）
  componentDidMount() {
    this.props.getUserID();
  }

  // 获取userId后
  // 获取用户播放列表、收藏的歌曲
  componentDidUpdate() {
    // 登录后， 有---componentDidUpdate--- // 或者在 render 里 ？ ？ ？
    // 调用 getMyPlaAndCol()
    // 设置 getMyPlaAndColDone 标志为 true
    if (!this.state.getMyPlaAndColDone) {
      if (this.props.userID) {
        this.props.getMyPlaAndCol(this.props.userID);
        this.setState({ getMyPlaAndColDone: true });
      }
    }
  }

  // 父组件处理登录和注册
  child_loginHandle(data) {
    const { email, password, saveCookie } = data;
    // const dispatch = useDispatch();
    if (!email || !password) {
      console.log("sub");
      this.props.submitErr();
    }
    this.props.login(data);
  }
  child_registerHandle(data) {
    this.props.register(data);
  }
  // 登出 removePlaAndColAll() -----------------------playlist 做一个userId检测
  //设置 getMyPlaAndColDone 标志为 false
  logoutHandle() {
    this.props.logout();
    this.props.removePlaAndColAll();
    this.setState({ showLoginModal: false, getMyPlaAndColDone: false });
  }
  // --------------------------------------------------------------------------

  render() {
    // this.child_loginHandle()
    return (
      <div className="headbar">
        <FlatButton
          label="豆瓣音乐人"
          style={styles.button}
          onClick={() =>
            window.open("https://music.douban.com/artists/", "_blank")
          }
        />
        <div style={{ float: "right" }}>
          {this.state.showSearchButton ? (
            <FlatButton
              onClick={() => {
                this.setState({ showSearchButton: false });
              }}
              style={styles.button}
              label="搜索音乐"
              icon={<Search />}
            />
          ) : (
            <div style={{ display: "inline-block", height: 35, margin: 3 }}>
              <Search style={{ height: 35, float: "left" }} />
              <TextField
                className="search-input"
                hintText="输入关键字"
                style={{
                  fontSize: 14,
                  height: 32,
                  paddingBottom: 8,
                  marginLeft: 10,
                }}
                onBlur={() => {
                  this.setState({ showSearchButton: true });
                }}
                onChange={(e) => this.setState({ searchText: e.target.value })}
                onKeyDown={(e) => {
                  if (e.keyCode === 13 && e.target.value !== "") {
                    this.setState({ showSearchModal: true });
                  }
                }}
              />
            </div>
          )}

          <IconMenu
            iconButtonElement={
              <FlatButton
                onClick={this.handleChangeTheme}
                style={styles.button}
                label="更换皮肤"
                icon={<ColorLens />}
              />
            }
            open={this.state.openMenu}
            onRequestChange={this.handleOnRequestChange}
          >
            <MenuItem
              value="2"
              primaryText="彩色模式"
              onClick={() => this.props.changeTheme(2)}
            />
            <MenuItem
              value="2"
              primaryText="暗黑模式"
              onClick={() => {
                this.props.changeTheme(0);
                document.body.style.backgroundColor = "rgb(48, 48, 48)";
                deteleRules();
                this.props.onChangeTheme(0);
              }}
            />
            {/* <MenuItem value="1" primaryText="White"  onClick={()=>{
              deteleRules()
              document.body.style.backgroundColor = '#fff'
              // console.log(document.querySelector('.collection'));
              
              // document.querySelector('.collection').style.backgroundColor = '#fff'
              // document.querySelector('.search-result').style.backgroundColor = '#fff'
              // document.querySelector('.comment-list').style.backgroundColor = '#fff'
              document.querySelectorAll('.playlist span').style.color = '#000'
            //   const sheet = document.styleSheets[0];
            //   const rulesLen = (sheet.cssRules || sheet.rules).length;
            //   const rule1 = .playlist span {color: #000!important;}
            //   const rule2 = svg, button,.playmain span:nth-of-type(2) {color: hsl(240, 0%, 0%)!important;fill:  hsl(101, 10%, 0%)!important;}

            // const rule3 = .collection, .search-result, .comment-list {background-color: rgb(255, 255, 255)!important;}

            // sheet.insertRule(rule1, rulesLen-1)
            // sheet.insertRule(rule2, rulesLen-1)
            // sheet.insertRule(rule3, rulesLen-1)
            // sheet.insertRule(rule4, rulesLen-1)
              this.props.changeTheme(1)
              this.props.onChangeTheme(1)}}/> */}
          </IconMenu>

          <FlatButton
            style={styles.button}
            label="我的收藏"
            icon={<Star />}
            onClick={() => this.setState({ showCollectionModal: true })}
          />
          {!this.props.userID ? (
            <FlatButton
              onClick={() => this.setState({ showLoginModal: true })}
              style={styles.button}
              label="登录"
              // icon={<Star />}
            />
          ) : (
            <FlatButton
              onClick={this.logoutHandle}
              style={styles.button}
              label="登出"
              labelStyle={{}}
              // icon={<Star />}
            />
          )}
        </div>

        {/* 应用 react protal */}
        <div>
          {/* 登录后，无法设置showLoginModal 为 false，使弹窗自动消失
            所以 添加 && !this.props.userID 条件
            但登出时，弹窗又会显示出来
            所以，在登出同时，将showLoginModal 设置回 false
            */}
          {this.state.showLoginModal &&
            !this.props.userID && (
              <Login
                onLogin={this.child_loginHandle}
                onRegister={this.child_registerHandle}
                onClose={() => this.setState({ showLoginModal: false })}
              />
            )}
          {this.state.showCollectionModal && (
            <Collection
              onClose={() => this.setState({ showCollectionModal: false })}
            />
          )}
          {this.state.showSearchModal && (
            // 传递keyword
            <SearchResult
              keyword={this.state.searchText}
              onClose={() => this.setState({ showSearchModal: false })}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userID: state.user.userID,
  currentSong: state.song.currentSong,
  playlist: state.song.playlist,
});
const mapDispatchToProps = (dispatch) => ({
  getUserID: () => dispatch(getUserID()),
  login: (data) => dispatch(login(data)),
  register: (data) => dispatch(register(data)),
  logout: () => dispatch(logout()),
  getMyPlaAndCol: (userID) => dispatch(getMyPlaAndCol(userID)),
  removePlaAndColAll: () => dispatch(removePlaAndColAll()),
  changeTheme: (num) => dispatch(changeTheme(num)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Headbar);
