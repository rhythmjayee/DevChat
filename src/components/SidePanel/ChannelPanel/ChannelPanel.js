import React,{useState,useEffect} from 'react';
import firebase from '../../../firebase';

import {FormField, Icon, Input, Menu, MenuItem, MenuMenu,Form,Button, Modal, ModalActions, ModalContent, ModalHeader} from 'semantic-ui-react';
import {connect} from 'react-redux';
import {setChannel} from '../../../actions/index'

 const ChannelPanel = (props) => {
     const [state, setstate] = useState({
         channels:[],
         channelName:'',
         channelDetails:'',
         modal:false,
         channelRef:firebase.database().ref('channels'),
         firstLoad:true
     });

       
        useEffect(() => {
                addListener();
        }, []);
        
        useEffect(() => {
            setFirstChannel();
        }, [state.channels]);

        const addListener=()=>{
            let loadedChannels=[];
            state.channelRef.on('child_added',snap=>{ 
                loadedChannels.push(snap.val());
                console.log(loadedChannels);
                setstate({...state,channelName:'',channelDetails:'',channels:loadedChannels});
            });
            return state;
           
        }

        const setFirstChannel=()=>{
            if(state.firstLoad && state.channels.length>0){
                props.setChannel(state.channels[0]);
            }
            setstate({...state,firstLoad:false});
        }

     const {channels,modal}=state;

     const handleChange=(e)=>{
        setstate({...state,[e.target.name]:e.target.value});
     }
     const modalHandler=()=>{
        setstate({...state,modal:!modal});
     }
     const isFormValid=({channelName,channelDetails})=> channelName && channelDetails;

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
            addListener();
            modalHandler();           
        })
        .catch(err=>{
            console.error(err.message);
        });

     }
     const handleSubmit=(e)=>{
        e.preventDefault();
        if(isFormValid(state)){
            addChannel(state);
        }
     }

     const displayChannels=(channels)=>{
        return(
            channels.length>0 && channels.map((ch)=>{
                return(
                    <MenuItem key={ch.id} onClick={()=>changeChannel(ch)} name={ch.name} style={{opacity:0.7}}>
                        # {ch.name}
                    </MenuItem>
                )
            })
        )
     }

     const changeChannel=(channel)=>{
        props.setChannel(channel);
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
            {displayChannels(channels)}
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

export default connect(null,{setChannel})(ChannelPanel);