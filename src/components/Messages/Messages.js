import React,{useState} from 'react';
import {Comment, CommentGroup, Segment} from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessagesForm from './MessagesForm/MessagesForm';

import firebase from '../../firebase';

const Messages = (props) => {
    const [state, setstate] = useState({
        messagesRef:firebase.database().ref('messages'),
        channel:props.currentChannel,
        user:props.currentUser
    })

    const {messagesRef,channel,user}= state;
    return (
        <>
            <MessagesHeader/>
            <Segment >
                <CommentGroup className='messages'>
                    {/* messages */}
                </CommentGroup>
            </Segment>
            <MessagesForm
                messagesRef={messagesRef}
                currentChannel={channel}
                currentUser={user}
            />
        </>
    )
}

export default Messages;