import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import { Component } from 'react';
import {List, ListItem} from 'material-ui/List';

import Clear from 'material-ui/svg-icons/content/clear';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { getCommentList } from '../../reducer/song'
import { sendComment } from '../../reducer/song'

// 根据毫秒数据 获取 日期
const getDate = (time) => {
  const date = new Date(time)
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}`
}

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {commentText: ''}
    this.container = document.createElement('div');
    document.body.appendChild(this.container)
    this.container.className = 'collection-container portal-shade'
    this.handleSendComment = this.handleSendComment.bind(this)
  }

  componentWillUnmount() {document.body.removeChild(this.container)}

  componentDidMount() {this.props.getCommentList(this.props.currentId)}

  handleSendComment() {this.props.sendComment(this.state.text, this.props.currentId)}

  render() {
    const hotCommentList = this.props.hotCommentList;
    const commentList = this.props.commentList;
    return ReactDOM.createPortal (
      <div className="comment-list">


      <div style={{width:600, margin:'0 auto',paddingTop: 20}}>
        <List>
          <Subheader style={{overflow:'hidden'}}>
            <span>评论</span>
            <IconButton
              style={{padding:0,float: 'right'}}>
              <Clear onClick={()=>this.props.onClose()} />
            </IconButton>
          </Subheader>
          <Divider></Divider>


          <div style={{overflow:'auto', height:470}}>
            <div className="hot-comment-item-wrapper">
              {hotCommentList.length > 0 && hotCommentList.map(item => {
                const subtitle = getDate(item.time)
                return <Card key={item.commentID} style={{paddingBottom: 30}}>
                    <CardHeader
                      title={item.userName}
                      subtitle={subtitle}
                      avatar={item.userAvatarURL}
                      style={{padding: 10}}
                    />
                    <CardText style={{padding: '0 10px 0 50px'}}>
                      {item.content}
                    </CardText>
                  </Card>
                })
              }
            </div>
            <div className='comment-item-wrapper'>
              {commentList.length === 0
              ? '评论是空的！！'
              : commentList.map(item => {
                const subtitle = getDate(item.time)
                return <Card key={item.commentID} style={{paddingBottom: 30}}>
                    <CardHeader
                      title={item.userName}
                      subtitle={subtitle}
                      avatar={item.userAvatarURL}
                      style={{padding: 10}}
                    />
                    <CardText style={{padding: '0 10px 0 50px'}}>
                      {item.content}
                    </CardText>
                  </Card>
                })}
            </div>
          </div>
        </List>


        <div>
        <TextField
          hintText="说点什么吧！"
          multiLine={true}
          rows={2}
          rowsMax={4}
        /><FlatButton
          onClick={this.handleSendComment}
          onChange={(e)=> this.setState({commentText: e.target.value})}
          value={this.state.commentText}
        >发送评论</FlatButton>
        </div>


        </div>
      </div>,
      this.container
    )
  }
}

const mapStateToProps = (state) => ({
  hotCommentList: state.song.commentList.hotComments,
  commentList: state.song.commentList.comments,
  currentId: state.song.currentSong.id
})
const mapDispatchToProps = (dispatch) => ({
  getCommentList: (songID) => dispatch(getCommentList(songID)),
  sendComment: (text) => dispatch(sendComment(text))
})
export default connect(mapStateToProps, mapDispatchToProps)(CommentList);
