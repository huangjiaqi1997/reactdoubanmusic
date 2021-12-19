import axios from 'axios';

const initialState = {
  isPlaying: false,
  currentSong: {},
  playlistID: '',
  collectionID: '',
  playlist: [
    // {ID、名称、歌手、类型、imgUrl}
  ],
  collection: [],
  searchResult: {
    singles: '', 
    albums: ''
  },
  commentList: {
    hotComments:[],
    comments: []
  },
  isLoading: false,
  message: ''
}
// 获取播放列表、收藏列表，及其ID
const SONG_GET_PLA_AND_COL_SUCCESS = 'SONG_GET_PLA_AND_COL_SUCCESS'
// 获取歌词 => store[currentSong] （播放）
const SONG_GET_LRC_SUCCESS = 'SONG_GET_LRC_SUCCESS'
// playlist 移除一首歌曲
const SONG_REMOVE_SUCCESS = 'SONG_REMOVE_SUCCESS'
const SONG_REMOVE_PLALIST_ALL = 'SONG_REMOVE_PLALIST_ALL'
const SONG_REMOVE_PLA_COL_ALL = 'SONG_REMOVE_PLA_COL_ALL'// 登出 
// 切换收藏
const SONG_TOGGLE_COLLECT = 'SONG_TOGGLE_COLLECT'
// 切换 isPlaying
const SONG_TOGGLE_ISPLAYING = 'SONG_TOGGLE_ISPLAYING'


const SONG_PLAY_COL_ALL = 'SONG_PLAY_COL_ALL'
const SONG_GET_SINGLE_SEARCH_RESULT_SUCCESS = 'SONG_GET_SINGLE_SEARCH_RESULT_SUCCESS'
const SONG_GET_ALBUM_SEARCH_RESULT_SUCCESS = 'SONG_GET_ALBUM_SEARCH_RESULT_SUCCESS'
const SONG_GET_COMMENT_LIST_SUCCESS = 'SONG_GET_COMMENT_LIST_SUCCESS'
const SONG_ADD_TO_PLAYLIST_SUCCESS = 'SONG_ADD_TO_PLAYLIST_SUCCESS'
const SONG_SEND_COMMENT_SUCCESS = 'SONG_SEND_COMMENT_SUCCESS'


const SONG_REQUEST_INITIATE = 'SONG_REQUEST_INITIATE'
const SONG_MESSAGE = 'SONG_MESSAGE'


export const toggleIsPlaying = () => ({type: SONG_TOGGLE_ISPLAYING});
export const playColAll = (songID) => ({type: SONG_PLAY_COL_ALL})
export const removePlaAndColAll = () => ({type: SONG_REMOVE_PLA_COL_ALL})


// 获取播放列表、收藏列表，及其ID
export const getMyPlaAndCol = (userID) => {
  return dispatch => {
    dispatch(requestInitiate())

    // 获取用户歌单
    axios.get(`/user/playlist?uid=${userID}`)
      .then(res => {
        if (res.data.code === 200) {
          const playlistID = res.data.playlist[1].id;
          const collectionID = res.data.playlist[0].id;
          const playlist = [];
          const collection = [];
          let currentSong = {};
          // 成功后获取歌单详情
          axios.get(`/playlist/detail?id=${playlistID}`)
            .then(res => {
              if(res.data.code === 200) {
                const tracks = res.data.playlist.tracks;
                for (let i = 0; i < tracks.length; i++) {
                  const track = tracks[i]
                  playlist.push({
                    name: track.name,
                    id: track.id,
                    artist: track.ar[0].name,
                    albumName: track.al.name,
                    albumImgURL: track.al.picUrl
                  })
                }
                // 获取歌词
                playlist[0] &&
                axios.get(`/lyric?id=${playlist[0].id}`)
                .then(res => {
                  if(res.status ===200 && res.data.code === 200) {
                    const lrc = res.data.lrc;
                    const lyrics = lrc ? lrc.lyric : ''
                    currentSong = {lyrics, ...playlist[0]}

                    axios.get(`/playlist/detail?id=${collectionID}`)
                .then(res => {
                  if(res.data.code === 200) {
                    const tracks = res.data.playlist.tracks;
                    for (let i = 0; i < tracks.length; i++) {
                      const track = tracks[i]
                      collection.push({
                        name: track.name,
                        id: track.id,
                        artist: track.ar[0].name,
                        albumName: track.al.name,
                        albumImgURL: track.al.picUrl,
                        isCollected: true
                      })
                    }
                    dispatch(getMyPlaAndColSuccess({playlistID,collectionID, playlist, collection, currentSong}))

                  } else {}

                })
                  } else {}
                })
              } else {}

              
            })
          
        } else {}
      })
  }
}
// 获取歌词 => store[currentSong] （播放）
export const toCurrentSongPlay = (song) => {
  console.log(song);
  return dispatch => {
    dispatch(requestInitiate())
    axios.get(`/lyric?id=${song.id}`)
      .then(res => {
        if(res.status ===200 && res.data.code === 200) {
          const lrc = res.data.lrc;
          const lyrics = lrc ? lrc.lyric : ''
          dispatch(getLrcSuccess({lyrics, ...song}))
        } else {}
      })
  }
}
export const remove = (song) => {
  return (dispatch, getState) => {
    dispatch(requestInitiate())
    axios.get(`/playlist/tracks?op=del&pid=${getState().song.playlistID}&tracks=${song.id}`)
      .then(res => {
        if (res.status === 200 && res.data.code === 200) {
          console.log('remove success!');
          dispatch(removeSuccess(song))  
        } else {}
      })
  }
}
export const removePlaylistAll = () => {}
export const toggleCollect = (song, isisCollected) => {
  return dispatch => {
    dispatch(requestInitiate())
    axios.get(`/like?id=${song.id}&like=${!isisCollected}`)
      .then(res => {
        if (res.status === 200 && res.data.code === 200) {
          dispatch(toggleCollectSuccess(song, isisCollected))  
        } else {}
      })
  }
}

// collection、搜索结果中 添加到 playlist
export const addToPlaylist = (song, string) => {
  return (dispatch, getState) => {
    dispatch(requestInitiate())
    axios.get(`/playlist/tracks?op=add&pid=${getState().song.playlistID}&tracks=${song.id}`)
      .then(res => {
        if (res.status === 200 && res.data.code === 200) {

          if (!string) {
            dispatch(addToPlaylistSuccess(song))  
          } else {
            axios.get(`http://musicapi.leanapp.cn/song/detail?ids=${song.id}`)
              .then(res=> {
                if (res.status === 200 && res.data.code === 200) {
                  const albumImgURL = res.data.songs[0].al.picUrl;                  
                  dispatch(addToPlaylistSuccess({albumImgURL, ...song}))
                  dispatch(toCurrentSongPlay({albumImgURL, ...song})) 
                }
              })
          }
          
        } else {
          dispatch(message({msg: res.data.msg}))
        }
      })
    }
} 
// 获取 搜索的结果（单曲/专辑）
export const getSingleSearchResult = (keyword) => {
  return dispatch => { 
    dispatch(requestInitiate())
    axios.get(`/search?keywords=${keyword}&limit=50`)// &limit 默认30
      .then(res => {
        if(res.status === 200 && res.data.code === 200) {
          // 无结果时，服务器返回：
          // {
          //   result: {
          //   songCount: 0
          //   },
          //   code: 200
          // }
          const singles = res.data.result.songs || []
          const data = [];
          for(let i = 0; i < singles.length; i++) {
            const item = singles[i]
            data.push({
              id: item.id,
              name: item.name,
              artist: item.artists[0].name,
              albumName: item.album.name,
            })
          }        
          dispatch(getSingleSearchResultSuccess(data))
        } else {}
      })
  }
}
export const getAlbumSearchResult = (keyword) => {
  return dispatch => {
    dispatch(requestInitiate())
    axios.get(`/search?keywords=${keyword}&type=10`)
      .then(res => {
        if(res.status === 200 && res.data.code === 200) {
          // 无结果时，返回 { code: 200 }
          // result 为 undefined
          const albums = res.data.result
          ? res.data.result.albums
          : [];
          const data = [];
          for(let i = 0; i < albums.length; i++) {
            const item = albums[i]
            data.push({
              id: item.id,
              name: item.name,
              artistName: item.artists[0].name,
              coverURL: item.blurPicUrl,
              containedSong: item.containedSong,
              count: item.songCount
            })
          }
          dispatch(getAlbumSearchResultSuccess(data))
        } else {}
      })
  }
}
// 获取评论（默认20条）hotComment、comment两组
export const getCommentList = (songID) => {
  return dispatch => {
    dispatch(requestInitiate())
    axios.get(`/comment/music?id=${songID}&limit=30`)
      .then(res => {
        if(res.status === 200 && res.data.code === 200) {
          const commentData = res.data.comments || [];
          const hotCommentData = res.data.hotComments || [];
          const comments = [];
          const hotComments = [];
          for(let i = 0; i < commentData.length; i++) {
            const item = commentData[i]
            comments.push({
              userID: item.user.userId,
              userName: item.user.nickname,
              userAvatarURL: item.user.avatarUrl,
              commentID: item.commentId,
              content: item.content,
              liked: item.liked,
              likeCount: item.likedCount,
              time: item.time
            })
          }
          for(let i = 0; i < hotCommentData.length; i++) {
            const item = hotCommentData[i]
            hotComments.push({
              userID: item.user.userId,
              userName: item.user.nickname,
              userAvatarURL: item.user.avatarUrl,
              commentID: item.commentId,
              content: item.content,
              liked: item.liked,
              likeCount: item.likedCount,
              time: item.time
            })
          }          
          dispatch(getCommentListSuccess({hotComments, comments}))
        } else {}
      })
  }
}


export const sendComment = (text, id) => {
  return dispatch => {
    dispatch(requestInitiate())
    axios.get(`/comment?t=1&type=0&id=${id}&content=${text}`)
      .then(res => {
        if (res.status === 200 && res.data.code === 200) {
          dispatch(sendCommentSuccess(text))
        }
      })
  }
}



const getMyPlaAndColSuccess = (payload) => ({type: SONG_GET_PLA_AND_COL_SUCCESS, ...payload})
const getLrcSuccess = (payload) => ({type: SONG_GET_LRC_SUCCESS, currentSong: payload})
const addToPlaylistSuccess = (song) =>({song,  type: SONG_ADD_TO_PLAYLIST_SUCCESS})


const removeSuccess = (song) => ({song, type: SONG_REMOVE_SUCCESS})
const removePlaylistAllSuccess = () =>({type: SONG_REMOVE_PLALIST_ALL})
const toggleCollectSuccess = (song, isisCollected) =>({song, isisCollected, type: SONG_TOGGLE_COLLECT})
const getSingleSearchResultSuccess = (payload) => ({
  type: SONG_GET_SINGLE_SEARCH_RESULT_SUCCESS, singles: payload
})
const getAlbumSearchResultSuccess = (payload) => ({
  type: SONG_GET_ALBUM_SEARCH_RESULT_SUCCESS, albums: payload
})
const getCommentListSuccess = (payload) => ({
  type: SONG_GET_COMMENT_LIST_SUCCESS, comments: payload.comments, hotComments: payload.hotComments
})
const sendCommentSuccess = (text) => ({text, type: SONG_SEND_COMMENT_SUCCESS})
const message = (payload) => ({type: SONG_MESSAGE, msg: payload.msg})
const requestInitiate = () =>({type: SONG_REQUEST_INITIATE})

const playReducer = (state=initialState, action) => {
  console.log(action);
  let collection;
  let playlist;
  switch (action.type) {
    // 得到 playlist、collection
    // 对比计算歌曲的  isCollected、 inPlaylist 属性
    // 设置 currentSong (载入网站后直接播放playlist[0])
    case SONG_GET_PLA_AND_COL_SUCCESS:
      // collection 的 isCollected 都标为 true
      // 遍历 playlist，其中若也有 collection 中的歌曲：
      // 将 playlist[i].isCollected 标为 true
      // 将 collection[i].inPlaylist 标为 true
      playlist = action.playlist.map((item) => {
        for (let i = 0; i<action.collection.length; i++) {
          if (item.id === action.collection[i].id) {
            item.isCollected = true
            action.collection[i].inPlaylist = true
          } 
        }
        return item
      })
      return {
        ...state,
        playlist: playlist,
        collection: action.collection,
        playlistID: action.playlistID,
        collectionID: action.collectionID,
        currentSong: action.currentSong,
        isLoading: false
      }
    // 获得 lrc，并将 设置 song 为 currentSong
    // isPlaying => true
    case SONG_GET_LRC_SUCCESS:
      return {
        ...state,
        currentSong: action.currentSong,
        isPlaying: true,
        isLoading: false
      }
    case SONG_REMOVE_SUCCESS:
      playlist = state.playlist.filter(i => i.id !== action.song.id);
      console.log(action.song.isisCollected);
      collection = action.song.isisCollected
        ? state.collection.map(i=> {
          
          
          i.id===action.song.id && (i.inPlaylist = false)
          return i
        })
        : state.collection
      return {
        ...state,
        playlist: playlist,
        collection: collection,
        isLoading: false
      }
    case SONG_REMOVE_PLALIST_ALL:
      return {
        ...state,
        playList: [],
        isLoading: false
      }
    case SONG_TOGGLE_COLLECT:          
      // 更改collection
      let msg = '';
      let isisCollected = action.isisCollected

      // 来自搜索结果的 只管添加
      // 滤除 来自搜索结果的 并 已收藏的
      if (isisCollected === '') {
         isisCollected = state.collection.some(item=>item.id===action.song.id)
        if(isisCollected) {
          msg = '已收藏!'
          return;
        }
      }
      
      
      if (isisCollected) { // 喜欢 => 不喜欢
        // filter        
        collection = state.collection.filter((item) => {
          if (item.id === action.song.id &&　item.inPlaylist) {
            // inPlaylist 改为 false
             item.inPlaylist = false
          }
          return item.id !== action.song.id
        })
      } else { // add
        state.playlist.forEach(item => {
          if (item.id === action.song.id) {
            // playlist 有它，inPlaylist = true
            item.inPlaylist = true;
          }
        })
        collection = [action.song, ...state.collection]
      }
      return {
        ...state,
        playlist: state.playlist.map((item) => {
          if (item.id === action.song.id) {
            item.isCollected = !isisCollected;
          }
          return item;
        }),
        collection: collection,
        message: msg,
        isLoading: false
      }
    case SONG_TOGGLE_ISPLAYING:
      return {
        ...state,
        isPlaying: state.isPlaying ? false : true
      }

    case SONG_ADD_TO_PLAYLIST_SUCCESS:
      let list = []; // -----------------------------------------? ? ?
      let message = '';
      const song = action.song;
      console.log(song);
      
      // 检查被添加的歌曲是否在播放列表中
      if (state.playlist.some(item => item.id===song.id)) {
        list = state.playlist;
        message = '列表中已存在此歌曲。'
      } else {
        // 检查是否在收藏列表里
        state.collection.forEach(item=>item.id===song.id&&
                                    (song.isisCollected=true)&&(song.inPlaylist=true))
        list = [song, ...state.playlist]
      }
      return {
        ...state,
        playlist: list,
        message: message,
        isLoading: false
      }

    case SONG_GET_SINGLE_SEARCH_RESULT_SUCCESS:    
      return {
        ...state,
        searchResult: {singles: action.singles, albums: state.searchResult.albums},
        isLoading: false
      }
    case SONG_GET_ALBUM_SEARCH_RESULT_SUCCESS:
      return {
        ...state,
        searchResult: {albums: action.albums, singles: state.searchResult.singles},
        isLoading: false
      }
    case SONG_GET_COMMENT_LIST_SUCCESS:
      return {
        ...state,
        commentList: {hotComments: action.hotComments, comments: action.comments},
        isLoading: false
      }

    // case SONG_PLAYLIST_TO_CURRENT_SONG:
    //   return {
    //     ...state,
    //     currentSong: {
    //       songID: state.playlist[0].id,
    //       name: state.playlist[0].name,
    //       artist: state.playlist[0].artist,
    //       albumName: state.playlist[0].albumName,
    //       albumImgURL: state.playlist[0].albumImgURL,
    //     }
    //   }
  
    
    case SONG_REMOVE_PLA_COL_ALL:
      return {
        ...state,
        playlist: [],
        collection: [],
        currentSong: {}
      }
    
    
    case SONG_SEND_COMMENT_SUCCESS:
      // return {
      //   ...state,
      //   commentList: {
      //     comments: [action.]
      //   }
      // }
    case SONG_REQUEST_INITIATE:
      return {
        ...state,
        isLoading: true
      }
    case SONG_MESSAGE:
      return {
        ...state,
        message: action.msg
      }
    default:
     return state;
  }
}

export default playReducer;