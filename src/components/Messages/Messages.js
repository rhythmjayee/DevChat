import React from 'react';
import {Comment, CommentGroup, Segment} from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader/MessagesHeader';
const Messages = () => {
    return (
        <>
            <MessagesHeader/>
            <Segment>
                <CommentGroup>
                    {/* messages */}
                </CommentGroup>
            </Segment>
            {/* <MessageForm/> */}
        </>
    )
}

export default Messages;