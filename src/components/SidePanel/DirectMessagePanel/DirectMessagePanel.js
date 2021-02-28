import React,{useState,useEffect} from 'react';
import firebase from '../../../firebase';
import {Button,Icon, MenuMenu, MenuItem} from 'semantic-ui-react';

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

    const getStatus=()=>{
        const ref=state.presenceRef;
        let usrs=state.users;
        ref.on('value', (snap)=> {
            let objIndex = usrs.findIndex((obj => obj.uid === snap.key));
            usrs[objIndex].status = "online";
            setstate({...state,users:usrs,userLoading:false});
        });
       
    }

    const addListeners= async (currentUserId)=>{
        let loadedUsers=[];
        const userRes= await state.userRef.once('value');
        const statusRes= await state.presenceRef.once('value');
        const userOP=Object.entries(userRes.val());
        const userIds=[];
        // console.log(statusRes.val());
        let statusOP=[];
        if(statusRes.val())
         statusOP=Object.keys(statusRes.val());
        userOP.forEach(([key,usr])=>{
            if(currentUserId!==key){
                userIds.push(key);
                        let user=usr
                        user['uid']=key;
                        if(statusOP.indexOf(key)!==-1){
                            user['status']='online';
                        }
                        else
                        user['status']='offline';

                        loadedUsers.push(user);
                        setstate({
                            ...state,
                            users:loadedUsers,
                            userLoading:false
                        });  
                    }
        });
        // console.log(statusOP)
        // console.log(loadedUsers);
        let newUsers=[...loadedUsers];
        state.userRef.endAt().limitToLast(1).on('child_added',snap=>{
            if(userIds.indexOf(snap.key)===-1){
                let user=snap.val();
                console.log(user);
                user['uid']=snap.key;
                user['status']='offline';
                newUsers.push(user);
                setstate({
                    ...state,
                    users:newUsers,
                    userLoading:false
                });  
            }
        });
        

        state.connectedRef.on('value',snap=>{ //adding currentUser to presence db
            if(snap.val()===true){
                const ref=state.presenceRef.child(state.user.uid);
                ref.set(true); 
                ref.onDisconnect().remove(err=>{
                    if(err!==null){
                        console.error(err);
                    }
                })
            }
        });
    
        state.presenceRef.on('child_added',snap=>{
            if(state.user.uid!==snap.key){
                addStatusToUser(snap.key);
            }
        })
    
        state.presenceRef.on('child_removed',snap=>{
            if(state.user.uid!==snap.key){
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
           {userLoading && <Button style={{backgroundColor:'#515050'}} className={'loading'}></Button>}
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
