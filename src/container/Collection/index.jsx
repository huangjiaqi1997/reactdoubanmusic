import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { toggleCollect } from '../../reducer/song'
import { addToPlaylist } from '../../reducer/song'
import { toCurrentSongPlay } from '../../reducer/song'

import { List, ListItem } from 'material-ui/List';
import PlaylistPlay from 'material-ui/svg-icons/av/playlist-play';
import Star from 'material-ui/svg-icons/toggle/star';
import Close from 'material-ui/svg-icons/content/clear';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Add from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';

class Collection extends Component {
  constructor(props) {
    super(props);
    this.container = document.createElement('div');
    document.body.appendChild(this.container)
    this.container.className = 'collection-container portal-shade'
    this.handleToggleCollect = this.handleToggleCollect.bind(this);
    this.handleAddToPlay = this.handleAddToPlay.bind(this);
    this.handleAddToPlaylist = this.handleAddToPlaylist.bind(this);
  }

  componentWillUnmount() {document.body.removeChild(this.container)}

  handleToggleCollect(song) {    
    this.props.toggleCollect(song, true)
  }

  handleAddToPlay(song) {
    this.props.addToPlaylist(song)
    this.props.toCurrentSongPlay(song)
  }

  handleAddToPlaylist(song) {
    this.props.addToPlaylist(song)
  }

  render() {
    return ReactDOM.createPortal (


      <div className="collection">
        <List style={{width:600, margin:'0 auto',paddingTop: 20}}>
          <Subheader>
            <div style={{display: 'inline-block'}}>
              <span>我收藏的音乐人歌曲</span>
              <IconButton style={{verticalAlign:'middle'}}><PlaylistPlay /></IconButton>
            </div>
            {/* 关闭按钮
            信息传给父组件 Headbar
            更改 state */}
            <IconButton
              style={{padding:0,float: 'right'}}
              onClick={()=>this.props.onClose()}>
              <Close />
            </IconButton>
          </Subheader>
          <Divider></Divider>


          <div style={{overflowY:'auto', height:470}}  className='item-wrapper'>
            {this.props.collection.map((item) => 
              <ListItem
                key={item.id}
                primaryText={
                  <div><div style={{display:'inline-block', width: 250}}>{item.name}</div><div style={{display:'inline-block'}}>{item.artist}</div></div>}
                leftIcon={
                  <div style={{margin:0}}>
                    <IconButton
                      onClick={()=>this.handleToggleCollect(item)}
                      style={{padding:0}}>
                      <Star />
                    </IconButton>
                  </div>}
                rightIcon={
                  <div style={{width:100,margin:'0 15px'}}>
                    <IconButton
                      onClick={()=>this.handleAddToPlay(item)}
                      style={{padding:0}}>
                      < Play />
                    </IconButton>
                    {item.inPlaylist ?<div style={{position: 'absolute', left: 50, top:16}}>已添加</div>:
                    <IconButton
                      onClick={()=>this.handleAddToPlaylist(item)}
                      style={{padding:0}}>
                      <Add />
                    </IconButton>
                    }
                  </div>}
              />
            )}
          </div>

          
        </List>
      </div>,
      this.container
    )
  }
}

const mapStateToprops = (state) => ({
  collection: state.song.collection,
  playlist: state.song.playlist
})
const mapDispatchToprops = (dispatch) => ({
  toggleCollect: (id, isCollected)=>dispatch(toggleCollect(id, isCollected)),
// addToPlay: (id)=>dispatch(addToPlay(id)),
addToPlaylist: (id)=>dispatch(addToPlaylist(id)),
toCurrentSongPlay: (id)=> dispatch(toCurrentSongPlay(id))
})

export default connect(mapStateToprops, mapDispatchToprops)(Collection);
