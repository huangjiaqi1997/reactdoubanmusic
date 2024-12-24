import React, { Component } from "react";
import { connect } from "react-redux";
import { toCurrentSongPlay } from "../../reducer/song";
import { removePlaylistAll } from "../../reducer/song";
import { getHotPlaylist } from "../../reducer/song";
import { toggleCollect } from "../../reducer/song";
import { remove } from "../../reducer/song";

import { List, ListItem } from "material-ui/List";
import Share from "material-ui/svg-icons/action/launch";
import StarBroder from "material-ui/svg-icons/toggle/star-border";
import Star from "material-ui/svg-icons/toggle/star";
import Clear from "material-ui/svg-icons/content/clear";
import Divider from "material-ui/Divider";
import Subheader from "material-ui/Subheader";
import IconButton from "material-ui/IconButton";
import Toggle from "material-ui/Toggle";
import FlatButton from "material-ui/FlatButton";

class Playlist extends Component {
  constructor(props) {
    super(props);
    this.itemClickHandle = this.itemClickHandle.bind(this);
    this.handleRemoveAll = this.handleRemoveAll.bind(this);
    this.handleCollectButton = this.handleCollectButton.bind(this);
    this.handleRemoveButton = this.handleRemoveButton.bind(this);
  }

  componentDidMount() {
    this.props.getHotPlaylist();
  }

  handleRemoveAll() {
    this.props.removePlaylistAll();
  }

  itemClickHandle(song) {
    if (song.id !== this.props.currentSong.id) {
      this.props.toCurrentSongPlay(song);
    }
  }

  handleCollectButton(song, e) {
    e.stopPropagation();
    this.props.toggleCollect(song, song.collected);
  }

  handleRemoveButton(e, song) {
    e.stopPropagation();
    this.props.remove(song);
  }

  componentDidUpdate(prevS, prevP) {
    console.log("s", prevS);
    console.log("p", prevP);
  }

  render() {
    return (
      <div className="playlist" style={{ overflowY: "auto" }}>
        <List>
          <Subheader style={{ overflow: "hidden" }}>
            <div style={{ display: "inline-block", float: "left" }}>
              <span>
                {`正在播放 ${
                  this.props.playlist.length
                } / ${this.props.playlist.findIndex(
                  (p) => p.id === this.props.currentSong.id
                ) + 1}`}{" "}
              </span>
            </div>
            <div style={{ float: "right" }}>
              <FlatButton
                style={{ verticalAlign: "middle" }}
                label="清除全部"
                onClick={this.handleRemoveAll}
              />
              {/* <div style={{ display: "inline-block", verticalAlign: "middle" }}>
                <span>隐藏</span>
                <Toggle
                  style={{
                    verticalAlign: "middle",
                    display: "inline-block",
                    width: 50,
                  }}
                  onChange={this.handleRemoveAllChange}
                />
              </div> */}
            </div>
          </Subheader>
          <Divider />

          <div
            className="item-wrapper"
            style={{ overflow: "auto", height: 370 }}
          >
            {this.props.playlist.map((item) => {
              const star = item.isCollected ? <Star /> : <StarBroder />;
              return (
                <ListItem
                  key={item.id}
                  onClick={() => this.itemClickHandle(item)}
                  primaryText={
                    <div>
                      <div style={{ display: "inline-block", width: 250 }}>
                        {item.name}
                      </div>
                      <div style={{ display: "inline-block" }}>
                        {item.artist}
                      </div>
                    </div>
                  }
                  leftIcon={
                    <div style={{ margin: 0 }}>
                      <IconButton
                        onClick={(e) => this.handleCollectButton(item, e)}
                        style={{ padding: 0 }}
                      >
                        {star}
                      </IconButton>
                    </div>
                  }
                  rightIcon={
                    <div style={{ width: 100, margin: 0 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("share");
                        }}
                        style={{ padding: 0 }}
                      >
                        <Share />
                      </IconButton>
                      <IconButton
                        onClick={(e) => this.handleRemoveButton(e, item)}
                        style={{ padding: 0 }}
                      >
                        <Clear />
                      </IconButton>
                    </div>
                  }
                />
              );
            })}
          </div>
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isPlaying: state.song.isPlaying,
  playlist: state.song.playlist,
  currentSong: state.song.currentSong,
});
const mapDispatchToProps = (dispatch) => ({
  // play: () => dispatch(play()),
  toCurrentSongPlay: (song) => dispatch(toCurrentSongPlay(song)),
  removePlaylistAll: () => dispatch(removePlaylistAll()),
  remove: (song) => dispatch(remove(song)),
  toggleCollect: (song, isCollected) =>
    dispatch(toggleCollect(song, isCollected)),
  getHotPlaylist: () => dispatch(getHotPlaylist()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Playlist);
