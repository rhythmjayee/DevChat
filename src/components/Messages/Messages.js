import React,{useState,useEffect} from 'react';
import {Comment, CommentGroup, Segment} from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessagesForm from './MessagesForm/MessagesForm';
import Message from './Message/Message'

import firebase from '../../firebase';

const Messages = (props) => {
    const [state, setstate] = useState({
        messagesRef:firebase.database().ref('messages'),
        privateMessageRef:firebase.database().ref('privateMessages'),
        channel:props.currentChannel,
        user:props.currentUser,
        messages:[],
        messagesLoading:true,
        privateChannel:props.isPrivateChannel
    });

    const [userCount, setUserCountstate] = useState({
        count:'0 Users'
    });

    const [seachTerm,setSearchTerm]=useState({
        input:'',
        searchLoading:false,
        searchResults:[]
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


    const addListener= async (channelId)=>{
        let loadedMessages=[];
        const ref=getMessagesRef();
        const res=await ref.child(channelId).once('value');
         let messagesOp=[];
         let messagesIds=[];
         if(res.val()){
            messagesOp=Object.values(res.val());
            Object.entries(res.val()).forEach(id=>{
                messagesIds.push(id[0]);
            });
         }
         setstate({
            ...state,
            messages:messagesOp,
            messagesLoading:false
        }); 
        countUniqueUsers(messagesOp); 
        // console.log(messagesOp);
        addMessageListeners(channelId,messagesOp,messagesIds);
    }

    const addMessageListeners=(channelId,messagesOp,messagesIds)=>{
        let loadedMesages=[...messagesOp];
        // console.log(messagesIds);
        const ref=getMessagesRef();

        ref.child(channelId).endAt().limitToLast(1).on('child_added', snap=> {
            if(messagesIds.indexOf(snap.key)===-1){
                loadedMesages.push(snap.val());
                setstate({
                    ...state,
                    messages:loadedMesages,
                    messagesLoading:false
                });  
                countUniqueUsers(loadedMesages);
            }
            
        })
    };

    const getMessagesRef=()=>{
        const {messagesRef,privateMessageRef,privateChannel}=state
        return privateChannel?privateMessageRef:messagesRef;
    }

    const countUniqueUsers=(messages)=>{
        const uniqueUsers=messages.reduce((acc,message)=>{
            if(!acc.includes(message.user.id)){
                acc.push(message.user.id);
            }
            return acc;
        },[]);

        const plural=uniqueUsers.length>1 || uniqueUsers.length.length==0;
        const numUniqueUsers=`${uniqueUsers.length} ${plural?'Users':"User"}`;
        setUserCountstate({...userCount,count:numUniqueUsers});
    }

    const handleSearchChange=(e)=>{
        setSearchTerm({...seachTerm,input:e.target.value,searchLoading:true});
    }
        const {input}=seachTerm;
    useEffect(() => {
        handleSearchMessages()
    }, [input]);

    const handleSearchMessages =()=>{
        const channelMessages=[...state.messages];
        const regex=new RegExp(seachTerm.input,'gi');
        const searchResults=channelMessages.reduce((acc,message)=>{
            if(message.content && message.content.match(regex) || message.user.name.match(regex)){
                acc.push(message);
            }
            return acc;
        },[]);
        setSearchTerm({...seachTerm,searchResults:searchResults,searchLoading:false});

        
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

    const searchMessages=(!seachTerm.searchLoading && seachTerm.searchResults.length>0 && seachTerm.searchResults.map(message=>{
        return (
        <Message 
        key={message.timestamp}
            message={message}
            user={state.user}
        />
    )
    })
)

    const displayChannelName=(channel)=>{
        return channel? `${state.privateChannel ? '@ ' :'# '}${channel.name}` :"";
    }


    const {messagesRef,channel,user,messages,privateChannel}= state;
    const{count} =userCount;
   
    return (
        <>
            <MessagesHeader
                channelName={displayChannelName(channel)}
                uniqueUsers={count}
                handleSearchChange={handleSearchChange}
                searchLoading={seachTerm.searchLoading}
                isPrivateChannel={privateChannel}
            />
            <Segment >
                <CommentGroup className='messages'>
                    {/* messages */}
                    {!state.messagesLoading && state.messages.length===0 && "No Messages!!!  Start Conversation............"}
                        {(state.messagesLoading || seachTerm.searchLoading)?'Loading....':(seachTerm.input?searchMessages:displayMessages) }
                </CommentGroup>
            </Segment>
            <MessagesForm
                messagesRef={messagesRef}
                currentChannel={channel}
                currentUser={user}
                isPrivateChannel={privateChannel}
                getMessagesRef={getMessagesRef}
            />
        </>
    )
}

export default Messages;