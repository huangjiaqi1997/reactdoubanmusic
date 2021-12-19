import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import {getSingleSearchResult} from '../../reducer/song'
import {getAlbumSearchResult} from '../../reducer/song'
import {addToPlaylist} from '../../reducer/song'
import {toCurrentSongPlay} from '../../reducer/song'
import {toggleCollect} from '../../reducer/song'

import { List, ListItem } from 'material-ui/List';
import { Tabs, Tab } from 'material-ui/Tabs';
import Play from 'material-ui/svg-icons/av/play-arrow';
import StarBroder from 'material-ui/svg-icons/toggle/star-border';
import Close from 'material-ui/svg-icons/content/clear';
import Add from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CircularProgress from 'material-ui/CircularProgress';


class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
      getAlbumsDone: false
    }
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.className = 'Search-result-container portal-shade';
    this.handleTabChange = this.handleTabChange.bind(this)
    this.handleAddToPlay = this.handleAddToPlay.bind(this)
    this.handleAddToPlaylist = this.handleAddToPlaylist.bind(this)
    this.handleCollected = this.handleCollected.bind(this)
  }

  // componentDidMount时 请求搜索数据
  componentDidMount() {
    this.props.getSingleSearchResult(this.props.keyword)
  }

  // 请求 albums
  handleTabChange() {
    // 设置 tab
    const state = this.state;
    this.setState({tab: state.tab === 0 ? 1 : 0})
    // 多次切换到 albums 时，只请求一次
    if (!state.getAlbumsDone) {
      this.props.getAlbumSearchResult(this.props.keyword);
      this.setState({getAlbumsDone: true})
    }
  }

  handleAddToPlay(song) {    
    this.props.addToPlaylist(song,'noAlbumURL')
    // 在addToPlaylist里调用toCurrentSongPlay({albumImgURL, ...song})) 
  }
  handleAddToPlaylist(song) {
    this.props.addToPlaylist(song)
  }
  handleCollected(song) {  
    this.props.toggleCollect(song, '')
  }



  componentWillUnmount() {document.body.removeChild(this.container)}


  render() {    
    const rightIconMenu = (
      <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}>
        <MenuItem>收藏</MenuItem>
        <MenuItem>加入播放列表</MenuItem>
        <MenuItem>Delete</MenuItem>
      </IconMenu>
    );

    /**
     * 设置 single / album tab 内 ListItem 的渲染
     * 有 / 无 结果
     * [] == [] //=> false
     × ''.length === 0 //=> true
     */
    let content = '';
    const singles = this.props.singles;
    const albums = this.props.albums;
    const isLoading = this.props.isLoading;
    
    if (isLoading) {
      content = <CircularProgress
        size={60} thickness={7}
        style={{position: 'absolute',left: '50%',top:'50%',margin:'-30px 0 0 -30px'}}
        />
    } else {

      if (this.state.tab === 0) {

        if (singles.length === 0) {
          content = 'Oops 什么都没有!!'
        } else if (singles.length > 0) {
          content = singles.map(item => {
            return (
              <ListItem
                primaryText={item.name}
                secondaryText={`${item.artist} - ${item.albumName}`}
                rightIcon={
                  <div style={{width:150,margin:0}}>
                    <IconButton
                      onClick={()=>this.handleAddToPlay(item)}
                      style={{padding:0}}>
                      <Play />
                    </IconButton>
                    <IconButton
                      onClick={()=>this.handleCollected(item)}
                      style={{padding:0}}>                  
                      <StarBroder />
                    </IconButton>
                    <IconButton
                      onClick={()=>this.handleAddToPlaylist(item)}
                      style={{padding:0}}>
                      <Add />
                    </IconButton>
                  </div>}
              />
            )
          })
        }

      } else {
        if (albums.length === 0) {
          content = 'Oops 什么都没有!!'
        } else if (albums.length > 0) {
          content = albums.map(item => {
            // containedSong 是后端返回的必有属性
            // 属性值是 '' / 与搜索相关的歌曲
            const contained = item.containedSong;
            const secondaryText = contained === ''
              ? `${item.artistName}`
              : `${item.artistName} 包含单曲 ${contained}`
            return (
              <ListItem
                onClick={()=> console.log('listitem event')}
                primaryText={item.name}
                secondaryText={secondaryText}
                leftAvatar={
                  <Avatar src={item.coverURL} />
                }
                rightIconButton={rightIconMenu}
              />
            )
          })
        }
      }
    }

    return ReactDOM.createPortal (


      <div className="search-result">
        <List  style={{width:600, margin:'0 auto',paddingTop: 20}}>
          <Subheader style={{overflow:'hidden'}}>
            <span>搜索结果</span>
            <IconButton
              onClick={()=>this.props.onClose()}
              style={{padding:0,float: 'right'}}>
              <Close />
            </IconButton>
          </Subheader>
          <Divider></Divider>


          <Tabs onChange={this.handleTabChange}>
            <Tab label="单曲" value="a">
              <div style={{overflow:'auto', height:370}} className='item-wrapper'>
                {content}
              </div>
            </Tab>
            <Tab label="专辑" value="b">
              <div style={{overflow:'auto', height:370}} className='item-wrapper'>
                {content}  
              </div>
            </Tab>
          </Tabs>



        </List>
      </div>,
      this.container
    )
  }
}

const mapStateToprops = (state) => ({
  singles: state.song.searchResult.singles,
  albums: state.song.searchResult.albums,
  collection: state.song.collection,
  isLoading: state.song.isLoading
})
const mapDispatchToProps = (dispatch) => ({
  getSingleSearchResult: (keyword) => dispatch(getSingleSearchResult(keyword)),
  getAlbumSearchResult: (keyword) => dispatch(getAlbumSearchResult(keyword)),
  addToPlaylist: (song, string) => dispatch(addToPlaylist(song, string)),
  toCurrentSongPlay: (id) => dispatch(toCurrentSongPlay(id)),
  toggleCollect: (song, bool) => dispatch(toggleCollect(song, bool))
})

export default connect(mapStateToprops, mapDispatchToProps)(SearchResult);
