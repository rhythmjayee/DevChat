import React,{useState,useEffect} from 'react';
import firebase from '../../../firebase';
import {Header,Segment,Input,Icon, ButtonGroup,Button} from 'semantic-ui-react';

import { v4 as uuidv4 } from 'uuid';

import FileModal from '../FileModal/FileModal'
import Progressbar from '../ProgessBar/Progressbar'

const MessagesForm = (props) => {

    const [state, setstate] = useState({
        message:'',
        channel:props.currentChannel,
        user:props.currentUser,
        errors:[],
        loading:false,
        modal:false,
    });

    const [uploadFileState, uploadSetstate] = useState({
        uploadState:'',
        uploadTask:null,
        storageRef:firebase.storage().ref(),
        percentUploaded:0
    });

    

    const toggleModal=()=>{
        setstate({...state,modal:!state.modal});
    }

    const InputHandler=(e)=>{
        setstate({...state,[e.target.name]:e.target.value});
    }

    const createMessage=(fileUrl=null)=>{
        // console.log('4');
        const message={
            timestamp:firebase.database.ServerValue.TIMESTAMP,
            user:{
                id:state.user.uid,
                name:state.user.displayName,
                avatar:state.user.photoURL
            },
        };

        if(fileUrl!==null){
            message['image']=fileUrl;
        }else{
            message['content']=state.message;
        }
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
    const {uploadTask,uploadState,percentUploaded}=uploadFileState;

    const uploadFile=(file,metadata)=>{
        // console.log(file,metadata);
        
        const filePath=`chat/public/${uuidv4()}.jpg`;
        console.log(uploadTask,uploadState);
        uploadSetstate({
            ...uploadFileState,
            uploadState:'uploading',
            uploadTask:uploadFileState.storageRef.child(filePath).put(file,metadata)
        });
        console.log(uploadTask,uploadState);

    }
   
    useEffect(() => {
        // console.log('1');
        // console.log(uploadTask,uploadState); 
        uploadState==='uploading' && uploadTask.on('state_changed',snap=>{
            const percentageUpload=Math.round((snap.bytesTransferred/snap.totalBytes)*100);
            console.log(percentageUpload);
            uploadSetstate({...uploadFileState,percentUploaded:percentageUpload})
        },
        err=>{
            console.error(err);
            uploadSetstate({
                ...uploadFileState,
                uploadState:'error',
                uploadTask:null,
                percentUploaded:0
            });

            setstate({
                ...state,
                errors:state.errors.concat(err),
            });
        }
        ,()=>{
            // console.log('2');
            const pathToUpload=state.channel.id;
            const ref=props.messagesRef;
            uploadFileState.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl=>{
                sendFileMessage(downloadUrl,ref,pathToUpload);
            })
            .catch(err=>{
                console.error(err);
                uploadSetstate({
                    ...uploadFileState,
                    uploadState:'error',
                uploadTask:null,
                percentUploaded:0
                });
    
                setstate({
                    ...state,
                    errors:state.errors.concat(err),
                });
            })
        }
        )
    }, [uploadState]);

    const sendFileMessage=(fileUrl,ref,pathToUpload)=>{
        // console.log('3');
        ref.child(pathToUpload)
        .push()
        .set(createMessage(fileUrl))
        .then(()=>{
            uploadSetstate({
                ...uploadFileState,
                uploadState:'done',
            });
        })
        .catch(err=>{
            console.error(err);
            setstate({
                ...state,
                errors:state.errors.concat(err)
            })
        })
    }


    const {errors,loading,modal}=state;
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
                      onClick={toggleModal}
                  />
                 
              </ButtonGroup>
              <FileModal
                    modal={modal}
                    closeModal={toggleModal}
                    uploadFile={uploadFile}
                  />
                  <Progressbar
                      uploadState={uploadState}
                      percentUploaded={percentUploaded}
                  />
        </Segment>
    )
}

export default MessagesForm;
