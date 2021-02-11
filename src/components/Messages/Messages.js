import React,{useState,useEffect} from 'react';
import {Comment, CommentGroup, Segment} from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessagesForm from './MessagesForm/MessagesForm';
import Message from './Message/Message'

import firebase from '../../firebase';

const Messages = (props) => {
    const [state, setstate] = useState({
        messagesRef:firebase.database().ref('messages'),
        channel:props.currentChannel,
        user:props.currentUser,
        messages:[],
        messagesLoading:true
    });

    useEffect(() => {
        const {channel,user}=state;
        if(channel && user){
            addListener(channel.id);
        }
        // return () => {
        //     cleanup
        // }
    }, []);

    // useEffect(() => {
    //     displayMessages()
    // }, [state.messages])

    const addListener=(channelId)=>{
        addMessageListeners(channelId);
    }

    const addMessageListeners=(channelId)=>{
        let loadedMesages=[];
        state.messagesRef.child(channelId).on('child_added',snap=>{
            loadedMesages.push(snap.val());
            // console.log(loadedMesages);
            setstate({
                ...state,
                messages:loadedMesages,
                messagesLoading:false
            });  
            // displayMessages();
        })
    }

    const displayMessages=(!state.messagesLoading && state.messages.length>0 && state.messages.map(message=>{
            return (
            <Message 
            key={message.timestamp}
                message={message}
                user={state.user}
            />
        )
        })
    )

    const {messagesRef,channel,user,messages}= state;
    return (
        <>
            <MessagesHeader/>
            <Segment >
                <CommentGroup className='messages'>
                    {/* messages */}
                    {/* {console.log(messages)} */}
                        {state.messagesLoading?'Loading....':displayMessages }
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