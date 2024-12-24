import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { getThemeColor } from "../../script/script";
import CommentList from "../CommentList/";
import { toggleCollect } from "../../reducer/song";

import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText,
} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";

class Playmain extends Component {
  constructor(props) {
    super(props);
    this.state = { isShowCommitListModal: false };
  }

  // -------------------------------------------------------------render----------------
  componentDidUpdate() {
    //===========================================================
    const lrcWrapper = document.querySelector(".lrc-wrapper");
    const audio = document.querySelector(".audio-element");
    if (this.props.currentSong.lyrics !== "") {
      const lrc = this.props.currentSong.lyrics;
      // ==func
      const lrcArr = lrc.split("["); // 用换行符拆分获取到的歌词
      let lrcObjArr = [];
      lrcArr.forEach((item) => {
        var t = item.substring(0, item.indexOf("]")); // 01:00.15
        lrcObjArr.push({
          t: t.split(":")[0] * 60 + parseInt(t.split(":")[1]),
          c: item.substring(item.indexOf("]") + 1, item.length),
        });
      });

      lrcObjArr = lrcObjArr.filter((i) => !isNaN(i.t)); //去掉转换过程中t=NaN项

      const ulE = document.createElement("ul");
      // 遍历medisArray，并且生成li标签，将数组内的文字放入li标签
      lrcObjArr.forEach((item) => {
        var li = document.createElement("li");
        li.innerText = item.c;
        // li.stye.listStyle = 'none'
        li.dataset.timeline = item.t;
        ulE.appendChild(li);
      });
      lrcWrapper.innerHTML = "";
      lrcWrapper.appendChild(ulE);

      audio.addEventListener("timeupdate", function(e) {
        var time = parseInt(e.target.currentTime);
        var lines = document.querySelectorAll("[data-timeline]");
        var top = 0;
        var _thisHeight = 0;
        var nextLine = {
          i: 0,
          time: 0,
        };
        for (var i in lines) {
          var line = lines[i];
          if (line.dataset != undefined) {
            var timeline = parseInt(line.dataset.timeline);
            if (timeline == time) {
              _thisHeight = line.clientHeight;

              line.className = "now";
              //获取下一句歌词
              nextLine.i = parseInt(i) + 1;
              try {
                nextLine.time = lines[nextLine.i].dataset.timeline;
              } catch (e) {}
              if (nextLine.time > 0) {
                var interval = nextLine.time - timeline;
                (function(k) {
                  setTimeout(function() {
                    lines[k].className = "";
                  }, interval * 1000);
                })(i);
              }
              document.querySelector(".lrc-wrapper").style.marginTop =
                -(top - _thisHeight) + "px";
            } else if (timeline < time) {
              top += line.clientHeight;
            }
          }
        }
      });
    }
    //==============================================================

    if (this.props.currentSong.albumImgURL && this.props.theme === 2) {
      const colors = getThemeColor(this.props.currentSong.albumImgURL).then(
        (colors) => {
          // console.log(colors);
          const { color1, color2, color3 } = colors;
          const sheet = document.styleSheets[0];
          const rulesLen = (sheet.cssRules || sheet.rules).length;
          const rule1 = `body, .playmain>div,.result,.item-wrapper, .login-dialog div div, .chip  {
              background-color: hsl(${color1.h}, ${color1.s *
            100}%, ${color1.l * 100}%)!important;
            }`;
          const rule2 = `.playlist div,.headbar div,.lrc-wrapper,.playmain span,.collection div, .search-result div,.comment-list div, #time, .login-dialog div div, .login-dialog div h3, .login-dialog div input, .chip, .chip div, .comment-header span {
              color: hsl(${color2.h}, ${color2.s * 100}%, ${color2.l *
            100}%)!important;
            }`;
          const rule3 = `svg, button,.playmain span:nth-of-type(2), .login-dialog div label {
              color: hsl(${color3.h}, ${color3.s * 100}%, ${color3.l *
            100}%)!important;
              fill:  hsl(${color3.h}, ${color3.s * 100}%, ${color3.l *
            100}%)!important;
            }`;

          const rule4 = `.collection, .search-result, .comment-list, .comment-list .comment-card{
              background-color: hsl(${color1.h}, ${color1.s *
            100}%, ${color1.l * 100}%)!important;
            }`;
          const rule5 = `.collection, .search-result, .comment-list, .chip {
              border: 1px solid hsl(${color2.h}, ${color2.s *
            100}%, ${color2.l * 100}%)!important;
            }`;

          // console.log(sheet.cssRules);

          if (sheet.cssRules.length === 21) {
            for (let i = 0; i < 5; i++) {
              sheet.deleteRule(0);
            }
          }
          sheet.insertRule(rule1, 0);
          sheet.insertRule(rule2, 0);
          sheet.insertRule(rule3, 0);
          sheet.insertRule(rule4, 0);
          sheet.insertRule(rule5, 0);
        }
      );
    }
  }
  render() {
    const currentSong = this.props.currentSong;
    return (
      <div className="playmain">
        <Card
          style={{
            textAlign: "center",
            marginTop: 10,
            borderLeft: "1.5px solid rgba(0, 0, 0, 0.12)",
            boxShadow: "none",
          }}
        >
          <CardMedia style={{ height: 160 }}>
            <img
              style={{ width: 160, minWidth: 160 }}
              id="drawing"
              src={currentSong.albumImgURL}
              alt=""
            />
          </CardMedia>
          <CardTitle
            style={{ padding: 5, height: 45 }}
            titleStyle={{ fontSize: 16, height: 30 }}
            title={currentSong.name}
            subtitle={currentSong.albumName}
          />
          <CardText style={{ height: 137, padding: 10, overflow: "hidden" }}>
            <div className="lrc-wrapper" />
          </CardText>
          <CardActions style={{ padding: "15px 0 0" }}>
            <FlatButton
              label="关注"
              onClick={() => this.props.toggleCollect(currentSong, true)}
            />
            {/* 改变 state
            显示 commitList 组件 */}
            <FlatButton
              label="评论"
              onClick={() =>
                currentSong.id && this.setState({ isShowCommitListModal: true })
              }
            />
          </CardActions>
        </Card>

        {/* protal组件
        state 满足时，显示在DOM this.container下 */}
        {/* 传递 songID 数据
        和 onClose 回调事件 */}
        {this.state.isShowCommitListModal && (
          <CommentList
            currentSongID={currentSong.songID}
            onClose={() => this.setState({ isShowCommitListModal: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToprops = (state) => ({
  theme: state.user.theme,
  currentSong: state.song.currentSong,
});
const mapDispatchToProps = (dispatch) => ({
  toggleCollect: (song, bool) => dispatch(toggleCollect(song, bool)),
});

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(Playmain);
