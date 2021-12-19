

主界面
Headbar
  Login、SearchResult、Collection
state (isLoginButton、isSearchButton、
isLoginModal、isSearchModal、isCollectionModal、searchResultData)
发起
getUserID() => cookies => store
login(userName)  logout() => 后端 => {userName} => store
playlistCollectionRemoveAll() => store（登出后）
getSearchResult(text) = 后端 => []

Login
state (isLoginInput)

SearchResult
state (tab)
发起 
play(歌曲ID) = 后端getElsrc(ID) => store
getElyrc(歌曲ID) => store
collect(歌曲ID) => 后端 && store
addToPlaylist(歌曲ID) => 后端 && store

Collection
state (collectionList)
getMyCollectoin(userName) => 后端 => [collection] -> store
playAll(remove()、play()、getElsrc())
addToPlaylist(歌曲ID) => 后端 && store
remove(歌曲ID) => 后端 && store

Playlist
state (playlist)
发起
getMyPlaylist(userName) => 后端 => [playlist] -> store
play(歌曲ID) = 后端getElsrc(ID) => store
collect(歌曲ID) => 后端 && store
remove(歌曲ID) => 后端 && store
<!-- removeAll() => 后端 && store -->


Playmain
  CommentList
state {currentSongData:{ID、名称、歌手、类型、imgUrl、歌词}、
isCommentListModal、commentList: [{user:{name, avatar, commentText}}}
发起
getCommentList(歌曲ID) => []
addComment(text) => state => 后端
ID
CommentList
state {inputCommentText}


Contollerbar
state {currentSong, playlist, playModel}
发起
play(歌曲ID) => store


数据SOTRE
store: {
  用户: {
    用户名
    用户ID
  },
  歌曲: {
    当前歌曲: {
      是否正在播放
      歌曲信息: {
        ID、名称、歌手、类型、imgUrl、歌词
      }
    }
    播放列表: [{
      ID、名称、歌手、类型、imgUrl
    }],
    收藏的音乐
  },
  error: ''
}

1645212553

获取用户各歌单数量
http://musicapi.leanapp.cn/user/subcount
{
programCount: 0,
djRadioCount: 0,
mvCount: 0,
artistCount: 1,
newProgramCount: 0,
createDjRadioCount: 0,
createdPlaylistCount: 1,
subPlaylistCount: 1,
code: 200
}

  http://musicapi.leanapp.cn/login?email=13702056736@163.com&password=a19970715
  /logout
可以获取用户歌单
http://musicapi.leanapp.cn/user/playlist?uid=1645212553

获取歌单详情
http://musicapi.leanapp.cn/playlist/detail?id=2476269959

mp3 URL
http://music.163.com/song/media/outer/url?id=347351.mp3

歌曲详情
http://musicapi.leanapp.cn/song/detail?ids=347230

搜索单曲（type=10专辑）
http://musicapi.leanapp.cn/search?keywords=海阔天空&type=10

将歌曲add或del，tracks: 歌曲 id,可多个,用逗号隔开
http://musicapi.leanapp.cn/playlist/tracks?op=del&pid=2476269959&tracks=326719

获取歌词
http://musicapi.leanapp.cn/lyric?id=33894312

获取评论 默认20条
http://musicapi.leanapp.cn/comment/music?id=186016&limit=1

为评论增加/取消点赞 id 歌曲id； cid 评论id
http://musicapi.leanapp.cn/comment/like?id=29178366&cid=12840183&t=1&type=0


http://musicapi.leanapp.cn/comment?t=1&type=0&id=326719&content=test
http://musicapi.leanapp.cn/comment?t=0&type=1&id=5436712&commentId=1535550516319

/playlist/update/?id=24381616&name=新歌单&desc=描述&tags=学习

/like?id=347230
"proxy": {
    "/api/RoomApi": {
      "target": "http://open.douyucdn.cn",
      "changeOrigin":true
    }
  }