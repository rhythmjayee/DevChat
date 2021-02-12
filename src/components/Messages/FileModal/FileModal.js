import React,{useState} from 'react';

import mime from 'mime-types';

import {Modal,Input,Button,Icon, ModalHeader, ModalContent, ModalActions} from 'semantic-ui-react';

const FileModal = ({modal,closeModal,uploadFile}) => {

    const [state, setstate] = useState({
        file:null,
        authorized:['image/jpeg','image/png']
    })

    const addFile=(e)=>{
        const file=e.target.files[0];
        // console.log(file);
        if(file){
            setstate({...state,file:file});
        }
    }

    const sendFile=()=>{
        const {file}=state;

        if(file!==null){
            if(isAuthorized(file.name)){
                const metadata={contentType:mime.lookup(file.name)};
                uploadFile(file,metadata);
                closeModal();
                clearFile();
            }
        }
    }

    const clearFile=()=>{
        setstate({...state,file:null});
    }


    const isAuthorized=(filename)=>{
        return state.authorized.includes(mime.lookup(filename));
    }

    return (
        <Modal basic open={modal} onClose={closeModal}>
        <ModalHeader>Select an Image File</ModalHeader>
        <ModalContent>
            <Input
                fluid
                 label='file'
                  name='file'
                  type='file'
                  onChange={addFile}
            />
        </ModalContent>
        <ModalActions>
        <Button
            color='green'
            inverted
            onClick={sendFile}
        >
            <Icon name='checkmark'/>Send
        </Button>
        <Button
            color='red'
            inverted
            onClick={closeModal}
        >
            <Icon name='remove'/>Cancel
        </Button>
        </ModalActions>
        
    
        </Modal>
    )
}

export default FileModal
