import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleIsPlaying } from "../../reducer/song";
import { toCurrentSongPlay } from "../../reducer/song";

import Slider from "material-ui/Slider";
import Volume from "material-ui/svg-icons/av/volume-up";
import RepeatPlaylist from "material-ui/svg-icons/av/loop";
import RepeatTrack from "material-ui/svg-icons/av/replay";
import Random from "material-ui/svg-icons/action/swap-horiz";
import Play from "material-ui/svg-icons/av/play-arrow";
import Pause from "material-ui/svg-icons/av/pause";
import Next from "material-ui/svg-icons/av/fast-forward";
import Previous from "material-ui/svg-icons/av/fast-rewind";
import IconButton from "material-ui/IconButton";

// 181s => 3:01
const secondToMinute = (time) => {
  let min = Math.floor(time / 60).toFixed(0);
  min = min > 9 ? min : 0 + min;
  let sec = Math.round(time % 60).toFixed(0);
  sec = sec > 9 ? sec : 0 + sec;
  return min + ":" + sec;
};

// 返回数组随机的 index
const getRandomIndex = (length, prevI) => {
  // length = 10
  // random -> 0.001 ～ 0.999
  // => 0.01 ～ 9.99
  // ex 0 ～ 9
  const i = Math.floor(length * Math.random());
  // if (i===prevI) {
  //   return randomIndex(length, prevI);
  // }
  return i;
};

class Controllerbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 赋值一个变量，无法通过 props 改变，更改其属性值
      volume: 0.5,
      playModel: 0,
      duration: 0,
      currentTime: 0,
    };
    this.togglePlayPauseHandle = this.togglePlayPauseHandle.bind(this);
    this.playNextHandle = this.playNextHandle.bind(this);
    this.playPreviousHandle = this.playPreviousHandle.bind(this);
    this.modelChangeHandle = this.modelChangeHandle.bind(this);
    this.timeSliderChangeHandle = this.timeSliderChangeHandle.bind(this);
    this.volSliderChangeHandle = this.volSliderChangeHandle.bind(this);
  }

  componentDidMount() {
    // 取得DOM
    this.audioElement = this.refs.audioElement;
    this.changeTimeSlider = this.refs.changeTimeSlider;
    this.changeVolSlider = this.refs.changeVolSlider;
    const audio = this.audioElement;

    audio.volume = this.state.volume;

    // 载入数据后 获取音乐时长
    audio.onloadeddata = () => {
      this.setState({ duration: audio.duration.toFixed(2) });
    };

    // onplay 无法启动 spectrum
    audio.onplaying = () => {
      // 每秒获取 currentTime 到 state
      setInterval(() => {
        this.setState({ currentTime: audio.currentTime.toFixed(2) });
      }, 1000);
    };

    // 播放完一首歌曲时
    // 相当于 调用 playNextHandle()
    // 注意：loop 属性为 false 时才会触发 ended事件
    audio.onended = () => {
      this.playNextHandle();
    };
  }

  // 播放 / 暂停按钮
  // => store[isPlaying]
  togglePlayPauseHandle() {
    if (!this.props.currentSong) return;

    if (this.props.isPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.props.toggleIsPlaying();
  }

  // 上 / 下一首
  // 根据 playlist、currentId 计算 newCurrentSong
  // playlistRepeat、oneTackPepeat、random 三种情况
  // 无 currentSong return
  // 当 currentSong 不在播放列表里，需要设置 newCurrentSong 为 playlist[0]
  playNextHandle() {
    const currentSong = this.props.currentSong;
    if (!currentSong) return;
    const playlist = this.props.playlist;
    const state = this.state;
    let newCurrentSong;
    // 列表循环
    if (state.playModel === 0) {
      // 遍历 playlist
      // 获取 下一个的 newCurrentSong
      playlist.forEach((item, i) => {
        if (item.id === currentSong.id) {
          return (newCurrentSong =
            i + 1 === playlist.length ? playlist[0] : playlist[i + 1]);
        }
      });
      // 如果 currentSong 已被 remove
      !newCurrentSong && (newCurrentSong = playlist[0]);
      this.props.toCurrentSongPlay(newCurrentSong);

      // 单曲循环
    } else if (this.state.playModel === 1) {
      this.audioElement.load();
    } else {
      // 随机
      const newIndex = getRandomIndex(playlist.length);
      const newCurrentSong = playlist[newIndex];
      this.props.toCurrentSongPlay(newCurrentSong);
    }
  }
  // 上一首
  playPreviousHandle() {
    const currentSong = this.props.currentSong;
    if (!currentSong) return;
    const playlist = this.props.playlist;
    const state = this.state;
    let newCurrentSong;

    if (state.playModel === 0) {
      playlist.forEach((item, i) => {
        if (item.id === currentSong.id) {
          newCurrentSong =
            i === 0 ? playlist[playlist.length - 1] : playlist[i - 1];
        }
      });
      this.props.toCurrentSongPlay(newCurrentSong);
    } else if (this.state.playModel === 1) {
      this.audioElement.load();
    } else {
      const newIndex = getRandomIndex(playlist.length);
      const newCurrentSong = playlist[newIndex];
      this.props.toCurrentSongPlay(newCurrentSong);
    }
  }

  // 模式改变
  modelChangeHandle() {
    const playModel = this.state.playModel;
    let num = playModel === 2 ? 0 : playModel + 1;
    this.setState({ playModel: num });
  }

  // 播放进度改变
  timeSliderChangeHandle(e) {
    // console.log(e);

    // 用 ref 获取 Mater-UI 组件
    // 获取 Slider 的 value（0.00 - 1.00）
    const sliderValue = this.changeTimeSlider.state.value;
    const newCurrentTime = this.state.duration * sliderValue;
    this.audioElement.currentTime = newCurrentTime;
    this.setState({ currentTime: newCurrentTime });
  }

  // 音量调节
  volSliderChangeHandle() {
    const sliderValue = this.changeVolSlider.state.value;
    const newVol = 1 * sliderValue;
    this.audioElement.volume = newVol;
    this.setState({ volume: newVol });
  }

  render() {
    const currentId = this.props.currentSong.id;
    const state = this.state;
    const timeSliderDisabled = !currentId;
    let timeSliderValue = parseFloat(
      (state.currentTime / state.duration).toFixed(2)
    );
    timeSliderValue = isNaN(timeSliderValue) ? 0 : timeSliderValue;

    const volSliderValue = state.volume;
    const time = currentId
      ? `${secondToMinute(state.currentTime)} / ${secondToMinute(
          state.duration
        )}`
      : "00:00";
    // 播放模式
    const playModelButton =
      state.playModel === 0 ? (
        <RepeatPlaylist />
      ) : state.playModel === 1 ? (
        <RepeatTrack />
      ) : (
        <Random />
      );
    // 播放 / 暂停
    const playOrPauseButton = this.props.isPlaying ? (
      <Pause onClick={this.togglePlayPauseHandle} />
    ) : (
      <Play onClick={this.togglePlayPauseHandle} />
    );

    return (
      <div className="controllerbar">
        <div
          style={{
            display: "inline-block",
            width: 500,
            height: 50,
            float: "left",
            margin: "0 20px 0 10px",
          }}
        >
          <div
            id="time"
            style={{ textAlign: "right", color: "#fff", fontSize: "15px" }}
          >
            {time}
          </div>
          <Slider
            disabled={timeSliderDisabled}
            value={timeSliderValue}
            ref="changeTimeSlider"
            onDragStop={(e) => this.timeSliderChangeHandle(e)}
            style={{ marginTop: -28 }}
          />
        </div>

        <div
          style={{
            display: "inline-block",
            width: 160,
            height: 50,
            float: "left",
          }}
        >
          <IconButton onClick={this.modelChangeHandle}>
            {playModelButton}
          </IconButton>
          <IconButton>
            <Volume />
          </IconButton>
          <Slider
            onChange={this.volSliderChangeHandle}
            value={volSliderValue}
            ref="changeVolSlider"
            style={{
              marginTop: -30,
              verticalAlign: "middle",
              width: 50,
              height: 50,
              display: "inline-block",
            }}
          />
        </div>

        <div style={{ display: "inline-block", width: 300, float: "right" }}>
          <div style={{ textAlign: "center" }}>
            <IconButton>
              <Previous onClick={this.playPreviousHandle} />
            </IconButton>
            <IconButton>{playOrPauseButton}</IconButton>
            <IconButton>
              <Next onClick={this.playNextHandle} />
            </IconButton>
          </div>
        </div>

        {/* 加上crossOrigin="anonymous" */}
        <audio
          id="audio-element"
          className="audio-element"
          ref="audioElement"
          // src={`/song/media/outer/url?id=${currentId}.mp3`}
          src={this.props.songUrl}
          crossOrigin="anonymous"
          autoPlay={this.props.isPlaying}
        />
      </div>
    );
  }
}

const mapStateToprops = (state) => ({
  currentSong: state.song.currentSong,
  isPlaying: state.song.isPlaying,
  playlist: state.song.playlist,
  songUrl: state.song.songUrl,
});
const mapDispatchToProps = (dispatch) => ({
  toggleIsPlaying: () => dispatch(toggleIsPlaying()),
  toCurrentSongPlay: (song) => dispatch(toCurrentSongPlay(song)),
});

export default connect(
  mapStateToprops,
  mapDispatchToProps
)(Controllerbar);
