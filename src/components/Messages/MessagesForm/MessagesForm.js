import React,{useState} from 'react';
import firebase from '../../../firebase';
import {Header,Segment,Input,Icon, ButtonGroup,Button} from 'semantic-ui-react';

const MessagesForm = (props) => {

    const [state, setstate] = useState({
        message:'',
        channel:props.currentChannel,
        user:props.currentUser,
        errors:[],
        loading:false
    });

    const InputHandler=(e)=>{
        setstate({...state,[e.target.name]:e.target.value});
    }

    const createMessage=()=>{
        const message={
            timestamp:firebase.database.ServerValue.TIMESTAMP,
            user:{
                id:state.user.uid,
                name:state.user.displayName,
                avatar:state.user.photoURL
            },
            content:state.message
        };
        return message;
    }

    const sendMessage=()=>{
        const {messagesRef}=props;
        const {message,loading,channel}=state;

        if(message){
            setstate({...state,loading:true});
            messagesRef.child(channel.id)
            .push()
            .set(createMessage())
            .then(()=>{
                setstate({...state,loading:false,message:'',errors:[]});
            })
            .catch(err=>{
                console.error(err);
                setstate({...state,loading:false, errors:state.errors.concat(err)});
            })
        }else{
            setstate({...state,errors:state.errors.concat({message:'Add a message'})});
        }
    }

    const {errors,loading}=state;
    return (
        <Segment className='message__form'>
            <Input fluid name='message' style={{marginBottom:'0.7em'}}
                label={<Button icon={'add'}/>} 
                labelPosition='left'
                placeholder='write your message' 
                onChange={InputHandler}
                className={errors.some(error=>error.message.includes('message'))?'error':''}
                value={state.message}
              />
              <ButtonGroup>
                  <Button 
                      color='orange' content='Add reply' labelPosition='left' icon='edit'
                      onClick={sendMessage}
                      disabled={loading}
                  />
                  <Button
                      color='teal' content='upload Media' labelPosition='right' icon='cloud upload'
                  />
              </ButtonGroup>
        </Segment>
    )
}

export default MessagesForm;
