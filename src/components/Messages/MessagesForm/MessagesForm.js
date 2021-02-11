import React from 'react'

import {Header,Segment,Input,Icon, ButtonGroup,Button} from 'semantic-ui-react';

const MessagesForm = () => {
    return (
        <Segment className='message__form'>
            <Input fluid name='message' style={{marginBottom:'0.7em'}}
             label={<Button icon={'add'}/>} 
             labelPosition='left'
              placeholder='write your message' />
              <ButtonGroup>
                  <Button 
                      color='orange' content='Add reply' labelPosition='left' icon='edit'
                  />
                  <Button
                      color='teal' content='upload Media' labelPosition='right' icon='cloud upload'
                  />
              </ButtonGroup>
        </Segment>
    )
}

export default MessagesForm;
