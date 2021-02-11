import React from 'react';
import moment from 'moment';
import {Comment, CommentAuthor, CommentAvatar, CommentContent, CommentGroup, CommentMetadata, CommentText, Segment} from 'semantic-ui-react';

const isOwnMessage=(message,user)=>{
    return message.user.id===user.uid?'message__self':'';
}

const timeFromNow=(time)=>{
    return moment(time).fromNow();
}

const Message = ({message,user}) => {
    // console.log('------')
    return (
        <Comment>
        {/* {console.log(message,user)} */}
            <CommentAvatar src={message.user.avatar}/>
            <CommentContent className={isOwnMessage(message,user)}>
                <CommentAuthor as='a' >{message.user.name}</CommentAuthor>
                <CommentMetadata>{timeFromNow(message.timestamp)}</CommentMetadata>
                <CommentText>{message.content}</CommentText>
            </CommentContent>
        </Comment>
    )
}

export default Message;
