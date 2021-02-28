import React,{useState,useEffect} from 'react';
import firebase from '../../../firebase';

import {FormField, Icon, Input, Menu, MenuItem, MenuMenu,Form,Button, Modal, ModalActions, ModalContent, ModalHeader} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setChannel,setPrivateChannel} from '../../../actions/index'

 const ChannelPanel = (props) => {

    const [refs, setRefs] = useState({
        channelRef:firebase.database().ref('channels'),
    });

    const [modalInputs, setModalInputs] = useState({
         channelName:'',
         channelDetails:'',
         modal:false,
     });

     const [state, setstate] = useState({
        activeChannel:null,
         channels:[],
         firstLoad:true,
     });

    //  const [notificationState, setNotificationState] = useState({
    //      channel:null,
    //      messageRef:firebase.database().ref('messages'),
    //      notifications:[]
    //  });

       
        useEffect(() => {
            firstLoadChannels();
                return () => {
                   removeListeners();
                  }
        }, []);
        
        // useEffect(() => {
        //     setFirstChannel();
        // }, [state.channels]); 

        // useEffect(() => {
        //     setActiveChannel(state.channels[0]);
        // }, [state.activeChannel]);

        const {channels,firstLoad,activeChannel}=state;

        const firstLoadChannels= async ()=>{
            let loadedChannels=[];
              const res=await refs.channelRef.once('value');
              const channelsOp=Object.values(res.val());
              loadedChannels=[...channelsOp];
             setstate({...state,channels:loadedChannels,activeChannel:channelsOp[0],firstLoad:false});
             changeChannel(channelsOp[0]);

            // setFirstChannel();
        }

        const addListener= async ()=>{
           
                // addNotificationListners(snap.key);
           
        }
        const removeListeners=()=>{
            refs.channelRef.off();
        }

        const addChannel= async ()=>{
            const {channelName,channelDetails}=modalInputs;
            const {channelRef}=refs;
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
            try{
                await channelRef.child(key).update(newChannel)
                setModalInputs({...modalInputs,channelName:'',channelDetails:'',modal:!modalInputs.modal})  ;
            }
            catch(err){
                console.error(err.message);
            };
    
         }

         const changeChannel=(channel)=>{
            props.setChannel(channel);
            props.setPrivateChannel(false);
            // setNotificationState({...notificationState,channel:channel});
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
       
     
// Modal functions
     const handleChange=(e)=>{
        setModalInputs({...modalInputs,[e.target.name]:e.target.value});
     }
     const modalHandler=()=>{
        setModalInputs({...modalInputs,modal:!modalInputs.modal});
     }
     const isFormValid=({channelName,channelDetails})=> channelName && channelDetails;

    
     const handleSubmit=(e)=>{
        e.preventDefault();
        if(isFormValid(modalInputs)){
            addChannel();
        }
     }

    //display channels
     const displayChannels=()=>{
        return(
            !firstLoad && channels.map((ch,i)=>{
                return(
                    <MenuItem key={ch.id} active={ch.id===activeChannel.id} color='pink' onClick={()=>changeChannel(ch)}  name={ch.name} >
                        # {ch.name} 
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
            {firstLoad && <Button style={{backgroundColor:'#515050'}} className={'loading'}></Button>}
            {!firstLoad && displayChannels()}
        </MenuMenu>
        {/* Add channel modal */}
        <Modal basic open={modalInputs.modal} onClose={modalHandler}>
            <ModalHeader>Add a Channel</ModalHeader>
            <ModalContent>
                <Form onSubmit={handleSubmit}>
                    <FormField>
                        <Input fluid label='Name of channel' name='channelName' value={modalInputs.channelName} onChange={handleChange} />
                    </FormField>
                    <FormField>
                        <Input fluid label='About the channel' name='channelDetails' value={modalInputs.channelDetails} onChange={handleChange} />
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