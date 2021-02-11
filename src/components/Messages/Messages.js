import React from 'react';
import {Comment, CommentGroup, Segment} from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
import MessagesForm from './MessagesForm/MessagesForm';

const Messages = () => {
    return (
        <>
            <MessagesHeader/>
            <Segment >
                <CommentGroup className='messages'>
                    {/* messages */}
                </CommentGroup>
            </Segment>
            <MessagesForm/>
        </>
    )
}

export default Messages;