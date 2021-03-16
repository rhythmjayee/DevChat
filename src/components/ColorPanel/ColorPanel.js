import React,{useState} from 'react'
import {Sidebar,Menu,Divider,Button,Modal,Icon,Label,Segment} from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

const ColorPanel = () => {

    const [modal, setModal] = useState(false);

    const [colors, setColors] = useState({
        primary:'#fff',
        secondary:'#fff'
    })

    const toggleModal = () =>{
        setModal(prevState=>(!prevState));
    }

    const handleChangeComplete = (color) => {
        console.log(color);
        // setstate();
      };
        const {primary,secondary} = colors;
    return (
        <Sidebar as={Menu} icon='labeled' inverted vertical visible width='very thin'>
            <Divider/>
            <Button icon='add' size='small' color='pink' onClick={toggleModal}></Button>
            {/* {Color Picker} */}
            <Modal basic open={modal} onClose={toggleModal}>
                <Modal.Header>Choose App Colors</Modal.Header>
                <Modal.Content>
                <Segment>
                    <Label content='Primary Color' />
                    <SliderPicker color={primary} onChangeComplete={ handleChangeComplete }/>
                </Segment>
                <Segment>
                    <Label content='Secondary Color' />
                    <SliderPicker color={secondary} onChangeComplete={ handleChangeComplete }/>
                </Segment>    
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' inverted>
                        <Icon name='checkmark'/> Save Colors
                    </Button>
                    <Button color='red' inverted onClick={toggleModal}>
                        <Icon name='remove'/> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        </Sidebar>
    )
}

export default ColorPanel;