import React,{useState,useEffect} from 'react';
import firebase from '../../../firebase';
import {Menu,Icon, MenuMenu, MenuItem} from 'semantic-ui-react';

import {connect} from 'react-redux';
import {setChannel,setPrivateChannel} from '../../../actions/index'

const DirectMessagePanel = (props) => {
    const [state, setstate] = useState({
        activeChannel:'',
        user:props.currentUser,
        users:[],
        userLoading:true,
        userRef:firebase.database().ref('users'),
        connectedRef:firebase.database().ref('.info/connected'),
        presenceRef:firebase.database().ref('presence')
    });

    const {users,userLoading} =state;
    useEffect(() => {
        if(state.user){
            addListeners(state.user.uid);
        }
        return () => {
            removeListeners();
           }
    }, [userLoading]);

    const removeListeners=()=>{
        state.userRef.off();
        state.connectedRef.off();
        state.presenceRef.off();
    }

    const addListeners=(currentUserId)=>{
        let loadedUsers=[];
        state.userRef.on('child_added',snap=>{
            if(currentUserId!==snap.key){
                let user=snap.val();
                // console.log(user);
                user['uid']=snap.key;
                user['status']='offline';
                loadedUsers.push(user);
                // console.log(loadedUsers);
                setstate({
                    ...state,
                    users:loadedUsers,
                    userLoading:false
                });  
            }
            
        });

        state.connectedRef.on('value',snap=>{
            if(snap.val()===true){
                const ref=state.presenceRef.child(currentUserId);
                ref.set(true);
                ref.onDisconnect().remove(err=>{
                    if(err!==null){
                        console.error(err);
                    }
                })
            }
        });

        state.presenceRef.on('child_added',snap=>{
            if(currentUserId!==snap.key){
                addStatusToUser(snap.key);
            }
        })

        state.presenceRef.on('child_removed',snap=>{
            if(currentUserId!==snap.key){
                addStatusToUser(snap.key,false);
            }
        })
    }

    const addStatusToUser=(userId,connected=true)=>{
        const updatedUser=state.users.reduce((acc,user)=>{
            if(user.uid === userId){
                user['status']=`${connected? 'online': 'offline' }`
            }
            return acc.concat(user);
        },[]);
        setstate({...state,users:updatedUser});
    }

    const isUserOnline=(user)=>{
        return user.status === 'online';
    }

    const changeChannel =(user)=>{
        const channelId=getChannelId(user.uid);
        const channelData={
            id:channelId,
            name:user.name
        };
        props.setChannel(channelData);
        props.setPrivateChannel(true);
        setActiveChannel(user.uid);
    }

    const setActiveChannel=(userId)=>{
        setstate({...state,activeChannel:userId});
    }

    const getChannelId=(userId)=>{
        const currentUserId=state.user.uid;
        return userId<currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
    }


    return (
    <MenuMenu className='menu' >
        <MenuItem>
            <span>
                <Icon name='mail'/> DIRECT MESSAGES
            </span>{' '}
            ({users.length})
        </MenuItem>
           {/* User to Send Direct Messages */}
            {state.users.map(user=>{
                return <MenuItem
                key={user.uid}
                onClick={()=>changeChannel(user)}
                style={{opacity:1,fontStyle:'italic'}}
                active={props.isPrivateChannel && user.uid===state.activeChannel}
                color='violet'
                >
                <Icon
                    name='circle'
                    color={isUserOnline(user) ?'green' :'red'}
                />
                @ {user.name}
                </MenuItem>
            })}
       </MenuMenu>
    )
}

export default connect(null,{setChannel,setPrivateChannel})(DirectMessagePanel);
