import React,{useState,useEffect} from 'react'
import {Sidebar,Menu,Divider,Button,Modal,Icon,Label,Segment} from 'semantic-ui-react';
import { SliderPicker } from 'react-color';

import firebase from '../../firebase'

const ColorPanel = (props) => {

    const [modal, setModal] = useState(false);

    const [stateColors, setColors] = useState({
        primary:'#fff',
        secondary:'#fff'
    });

    const [refs,setRefs] =useState({
        userRef:firebase.database().ref('users')
    });

    const [userColors,setUserColors] =useState([]);

    useEffect(() => {
        if(props.currentUser){
            addListners(props.currentUser.uid);
        }
    }, []);

    const addListners =(userId) =>{
        let colors = [] ;
        refs.userRef.child(`${userId}/colors`).on('child_added',snap=>{
            colors.unshift(snap.val());
            setUserColors(colors);
        })
    }

    const toggleModal = () =>{
        setModal(prevState=>(!prevState));
    }

    const handleChangeCompleteP = (color) => {
        setColors(prev=>({...prev,primary:color.hex}))
    };
    const handleChangeCompleteS = (color) => {
    setColors(prev=>({...prev,secondary:color.hex}))
    };

    const handleSaveColors = () =>{
        if(stateColors.primary && stateColors.secondary){
            SaveColors(stateColors.primary,stateColors.secondary);
        }
    }
    const SaveColors = async (primary,secondary) =>{
        try{
            await refs.userRef.child(`${props.currentUser.uid}/colors`).push().update({
                primary,
                secondary
            });
            console.log('colors added');
            toggleModal();
        }catch(err){
            console.log(err);
        }
        
    }

    const displayColors = (colors) =>{
        console.log(colors);
        colors.length > 0 && colors.map((color,i)=>(
             <React.Fragment key={i}>
                    <Divider/>
                    <div className='color__container'>
                        <div className='color__square' style={{background:color.primary }}>
                            <div className='color__overlay' style={{background:color.secondary }}></div>
                        </div>
                    </div>
            </React.Fragment>
        ))
    }

        const {primary,secondary} = stateColors;
    return (
        <Sidebar as={Menu} icon='labeled' inverted vertical visible width='very thin'>
            <Divider/>
            <Button icon='add' size='small' color='pink' onClick={toggleModal}></Button>
            {/* {display colors} */}
            {displayColors(userColors)}
            {/* {Color Picker} */}
            <Modal basic open={modal} onClose={toggleModal}>
                <Modal.Header>Choose App Colors</Modal.Header>
                <Modal.Content>
                <Segment inverted>
                    <Label content='Primary Color' />
                    <SliderPicker color={primary} onChange={ handleChangeCompleteP }/>
                </Segment>
                <Segment inverted>
                    <Label content='Secondary Color' />
                    <SliderPicker color={secondary} onChange={ handleChangeCompleteS }/>
                </Segment>    
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' inverted>
                        <Icon name='checkmark' onClick={handleSaveColors}/> Save Colors
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