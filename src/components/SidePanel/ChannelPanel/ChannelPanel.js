import React,{useState,useEffect} from 'react';
import firebase from '../../../firebase';

import {FormField, Icon, Input, Menu, MenuItem, MenuMenu,Form,Button, Modal, ModalActions, ModalContent, ModalHeader} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setChannel,setPrivateChannel} from '../../../actions/index'

 const ChannelPanel = (props) => {

    const [refs, setRefs] = useState({
        channelRef:firebase.database().ref('channels'),
        messageRef:firebase.database().ref('messages'),
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
     const [activeCh, setactiveCh] = useState(null);

     const [notificationState, setNotificationState] = useState({
         channel:null,
         notifications:[]
     });

       
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
            //   console.log(res.val());
              const channelsOp=Object.values(res.val());
              loadedChannels=[...channelsOp];
              setstate({...state,channels:channelsOp,activeChannel:channelsOp[0],firstLoad:false});
              changeChannel(channelsOp[0]);
              let entries=Object.entries(res.val());
              addListener(entries);
            //   addNotificationListners(entries);

            // setFirstChannel();
        }
        const changeChannel=(channel)=>{
            setactiveCh(channel);
            setNotificationState({...notificationState,channel:channel});
            clearNotification();
            props.setChannel(channel);
            props.setPrivateChannel(false);
           
         }

         const clearNotification =()=>{
            //  console.log(notificationState);
             let index=notificationState.notifications.findIndex(notification=> notification.id===activeCh.id);

             if(index!==-1){
                 let updatedNotifications =[...notificationState.notifications];
                 updatedNotifications[index].total=notificationState.notifications[index].lastKnownTotal;
                 updatedNotifications[index].count=0;
                 setNotificationState({...notificationState,notifications:updatedNotifications});
             }
         }


         //display channels
     const displayChannels=()=>{
        return(
            !firstLoad && activeCh && channels.map((ch,i)=>{
                return(
                    <MenuItem key={ch.id} active={ !props.isPrivateChannel && ch.id===activeCh.id} color='pink' onClick={()=>changeChannel(ch)}  name={ch.name} >
                        # {ch.name} 
                    </MenuItem>
                )
            })
        )
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
                },
            }
            try{
                await channelRef.child(key).update(newChannel);
                await channelRef.child(key).child(`users/${props.currentUser.uid}`)
                .update({name:props.currentUser.displayName,avatar:props.currentUser.photoURL});
                setModalInputs({...modalInputs,channelName:'',channelDetails:'',modal:!modalInputs.modal})  ;
            }
            catch(err){
                console.error(err.message);
            };
    
         }

          
         
//-------------------------------------------------------------------

        const handleNotifications=(channelId,currentChannelId,notifications,snap)=>{
            let lastTotal=0;
            let index=notifications.findIndex(notification=> notification.id===channelId);    
            if(index !==-1){
                if(channelId !== currentChannelId){
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

        const addNotificationListners=(channelId)=>{
            // console.log(loadedChannels)
            // loadedChannels.forEach((ch)=>{
                refs.messageRef.child(channelId).on('child_added',snap=>{
                    // console.log(notificationState,activeCh,state);
                    if(notificationState.channel){
                        // console.log(Object.values(snap.val()));
                        handleNotifications(channelId,notificationState.channel,notificationState.notifications,snap);
                    }
                })
        }
        const addListener= (loadedChannels)=>{
            let ch=loadedChannels;
            // console.log(ch);
            let keys=[];
            let chanls=[];
            loadedChannels.forEach((en)=>{
                keys.push(en[0]);
                chanls.push(en[1]);
            });
              refs.channelRef.on('child_added', function(snapshot) {
                if(keys.indexOf(snapshot.val().id) ===-1 ){
                    let newChannel=snapshot.val();
                    chanls.push(newChannel);
                    setstate({...state,channels:chanls,activeChannel:chanls[0],firstLoad:false});
                }    
               
                addNotificationListners(snapshot.key);         
             });
             
           
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
            {!firstLoad && channels.length>0 && displayChannels()}
            {!firstLoad && channels.length==0 && "No Channels Found!!"}
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

export default connect(null,{setChannel,setPrivateChannel})(ChannelPanel);