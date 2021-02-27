import React,{useState,useEffect} from 'react';
import firebase from '../../../firebase';

import {FormField, Icon, Input, Menu, MenuItem, MenuMenu,Form,Button, Modal, ModalActions, ModalContent, ModalHeader} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setChannel,setPrivateChannel} from '../../../actions/index'

 const ChannelPanel = (props) => {
     const [state, setstate] = useState({
        // activeChannel:'',
         channels:[],
        //  channelName:'',
        //  channelDetails:'',
         modal:false,
         channelRef:firebase.database().ref('channels'),
        //  firstLoad:true,
     });

    //  const [notificationState, setNotificationState] = useState({
    //      channel:null,
    //      messageRef:firebase.database().ref('messages'),
    //      notifications:[]
    //  });

       
        useEffect(() => {
                addListener();
                return () => {
                   removeListeners();
                  }
        }, []);
        
        useEffect(() => {
            setFirstChannel();
        }, [state.channels]); 

        // useEffect(() => {
        //     setActiveChannel(state.channels[0]);
        // }, [state.activeChannel]);

        const {channels,modal}=state;

        const addListener=()=>{
            let loadedChannels=[];
            //listen channel ref
             state.channelRef.on('child_added',snap=>{ 
                loadedChannels.push(snap.val());
                // console.log(snap.val());
                setstate({...state,channels:loadedChannels});
                // addNotificationListners(snap.key);
            });
        }
//-------------------------------------------------------------------
        const addNotificationListners=(channelId)=>{
            notificationState.messageRef.child(channelId).on('child_added',snap=>{
                // console.log(notificationState.channel);
                // if(notificationState.channel){
                    console.log(snap.val());
                    handleNotifications(channelId,notificationState.notifications,snap);
                // }
            })
        }

        const handleNotifications=(channelId,notifications,snap)=>{
            let lastTotal=0;
            let index=notifications.findIndex(notification=> notification.id===channelId);    
            if(index !==-1){
                if(channelId !== notificationState.channel.id){
                    lastTotal=notifications[index].total;

                    if(snap.numChildren()-lastTotal>0){
                        notifications[index].count=snap.numChildren()-lastTotal;
                    }
                }
                notifications[index].lastKnownTotal=snap.numChildren();
            }else{
                notifications.push({
                   id:channelId,
                   total:snap.numChildren(),
                   lastKnownTotal: snap.numChildren(),
                   count:0
                })
            }
            setNotificationState({...notificationState,notifications:notifications});

        }
//------------------------------------------------------------------------------------------
        const removeListeners=()=>{
            state.channelRef.off();
        }

        const addChannel=()=>{
            const {channelRef,channelName,channelDetails}=state;
            const {uid,displayName,photoURL}=props.currentUser;
            const key=channelRef.push().key;
            const newChannel={
                id:key,
                name:channelName,
                details:channelDetails,
                createdBy:{
                    id:uid,
                    name:displayName,
                    avatar:photoURL
                }
            }
    
            channelRef.child(key)
            .update(newChannel)
            .then(()=>{
                // addListener();
                // modalHandler();  
                setstate({...state,channelName:'',channelDetails:'',modal:!modal})         
            })
            .catch(err=>{
                console.error(err.message);
            });
    
         }

        const setFirstChannel=()=>{
            if(state.channels.length>0){
                // setActiveChannel(state.channels[0]);
                // props.setChannel(state.channels[0]);
                // setstate({...state,channel:state.channels[0]});
                changeChannel(state.channels[0]);
               
            }
            // console.log('----')
            // setstate({...state,firstLoad:false});
        }

         const changeChannel=(channel)=>{
            props.setChannel(channel);
            props.setPrivateChannel(false);
            // console.log(channel);
            // setNotificationState({...notificationState,channel:channel});
            // setActiveChannel(channel);
         }  
         
        //  const setActiveChannel=(channel)=>{
            // console.log(channel.id);
        //     setstate(prevState=>({...prevState,activeChannel:channel.id}));
        //  }
     

     const handleChange=(e)=>{
        setstate({...state,[e.target.name]:e.target.value});
     }
     const modalHandler=()=>{
        setstate({...state,modal:!modal});
     }
     const isFormValid=({channelName,channelDetails})=> channelName && channelDetails;

    
     const handleSubmit=(e)=>{
        e.preventDefault();
        if(isFormValid(state)){
            addChannel(state);
        }
     }

    
     const displayChannels=(channels)=>{
        return(
            channels.length>0 && channels.map((ch,i)=>{
                return(
                    <MenuItem key={ch.id} active={ch.id===props.currentChannel.id} color='pink' onClick={()=>changeChannel(ch)}  name={ch.name} >
                        # {ch.name} 
                        {/* {console.log(ch.id,props.currentChannel.id)} */}
                    </MenuItem>
                )
            })
        )
     }

    return (
        <>
        <MenuMenu style={{marginTop:'1em',paddingBottom:'2em'}}>
            <MenuItem>
                <span>
                    <Icon name='exchange'/>
                </span>
                {' '}CHANNELS{' '}({channels.length})  <Icon name='add' onClick={modalHandler}/>
            </MenuItem>
            {/* Channels */}
            {props.currentChannel && state.channels.length>0?displayChannels(channels):<Button style={{backgroundColor:'#515050'}} className={'loading'}></Button>}
        </MenuMenu>
        {/* Add channel modal */}
        <Modal basic open={modal} onClose={modalHandler}>
            <ModalHeader>Add a Channel</ModalHeader>
            <ModalContent>
                <Form onSubmit={handleSubmit}>
                    <FormField>
                        <Input fluid label='Name of channel' name='channelName' value={state.channelName} onChange={handleChange} />
                    </FormField>
                    <FormField>
                        <Input fluid label='About the channel' name='channelDetails'value={state.channelDetails} onChange={handleChange} />
                    </FormField>
                </Form>
            </ModalContent>
            <ModalActions>
                <Button color='green' inverted  onClick={handleSubmit}>
                    <Icon name='checkmark'/> Add
                </Button>
                <Button color='red' inverted onClick={modalHandler}>
                    <Icon name='remove' /> cancel
                </Button>
            </ModalActions>
        </Modal>
        </>
    )
}
const mapsStateFromProps= state =>{
    return{
        currentChannel:state.channel.currentChannel
    }
}
export default connect(mapsStateFromProps,{setChannel,setPrivateChannel})(ChannelPanel);