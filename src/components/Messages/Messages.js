import React,{useState,useEffect,useRef,useLayoutEffect} from 'react';
import {Comment, CommentGroup, Segment} from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessagesForm from './MessagesForm/MessagesForm';
import Message from './Message/Message'

import firebase from '../../firebase';

const Messages = (props) => {
    const [state, setstate] = useState({
        messagesRef:firebase.database().ref('messages'),
        privateMessageRef:firebase.database().ref('privateMessages'),
        usersRef:firebase.database().ref('users'),
        channel:props.currentChannel,
        user:props.currentUser,
        messages:[],
        messagesLoading:true,
        privateChannel:props.isPrivateChannel
    });
    const [channelStarred, setchannelStarred] = useState(false);

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
            addListener(channel.id,user.uid);
            
        }
        // return () => {
        //     cleanup
        // }
    }, []);


    const addListener= async (channelId,userId)=>{
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
        addUserStarsListners(channelId,userId);
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

    const addUserStarsListners= async (channelId,userId) =>{
            const res= await state.usersRef.child(userId)
            .child('starred')
            .once('value');
           
            if(res.val()!==null){
                const channelIds=Object.keys(res.val());
                // console.log(channelIds);
                const prevStarred =channelIds.includes(channelId);
                setchannelStarred(prevStarred);
            }

    }

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

    //starring of channels......................
    const handleStar=()=>{
        setchannelStarred(!channelStarred);
        starChannel(!channelStarred);
    }

//     const firstUpdate = useRef(true);
//     useLayoutEffect(() => {
//         if (firstUpdate.current) {
//             firstUpdate.current = false;
//             return;
//         }

//     console.log(firstUpdate,"componentDidUpdateFunction");
//   });

   

    const starChannel = async (toggle)=>{
        // console.log('star')
        try{
            if(toggle){
                await state.usersRef.child(`${state.user.uid}/starred`)
                .update({
                    [state.channel.id]:{
                        name:state.channel.name,
                        details:state.channel.details,
                        createdBy:{
                            name:state.channel.createdBy.name,
                            avatar:state.channel.createdBy.avatar
                        }
                    }
                })
             }else{
                 await state.usersRef.child(`${state.user.uid}/starred`)
                 .child(state.channel.id)
                 .remove()
             }
        }catch(err){
            console.error(err);
        }
        
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
                handleStar={handleStar}
                isChannelStarred={channelStarred}
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