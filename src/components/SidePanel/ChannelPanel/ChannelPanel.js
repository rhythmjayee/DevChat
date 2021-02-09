import React,{useState} from 'react'

import {FormField, Icon, Input, Menu, MenuItem, MenuMenu,Form,Button, Modal, ModalActions, ModalContent, ModalHeader} from 'semantic-ui-react';

 const ChannelPanel = () => {
     const [state, setstate] = useState({
         channels:[],
         channelname:'',
         channelDetails:'',
         modal:false
     });

     const {channels,modal}=state;

    //  const closeModal=()=>{
    //     setstate({...state,modal:false});
    //  }
     const handleChange=(e)=>{
        setstate({...state,[e.taregt.name]:e.target.value});
     }
     const modalHandler=()=>{
        setstate({...state,modal:!modal});
     }
    return (
        <>
        <MenuMenu style={{marginTop:'1em',paddingBottom:'2em'}}>
            <MenuItem>
                <span>
                    <Icon name='exchange'/>
                </span>
                {' '}CHANNELS({channels.length})  <Icon name='add' onClick={modalHandler}/>
            </MenuItem>
            {/* Channels */}
        </MenuMenu>
        {/* Add channel modal */}
        <Modal basic open={modal} onClose={modalHandler}>
            <ModalHeader>Add a Channel</ModalHeader>
            <ModalContent>
                <Form>
                    <FormField>
                        <Input fluid label='Name of channel' name='channel' onChange={handleChange} />
                    </FormField>
                    <FormField>
                        <Input fluid label='About the channel' name='channelDetails' onChange={handleChange} />
                    </FormField>
                </Form>
            </ModalContent>
            <ModalActions>
                <Button color='green' inverted>
                    <Icon name='checkmark'/> Add
                </Button>
                <Button color='red' inverted>
                    <Icon name='remove' onClick={modalHandler}/> cancel
                </Button>
            </ModalActions>
        </Modal>
        </>
    )
}

export default ChannelPanel;