import React from 'react';

import {Header,Segment,Input,Icon, HeaderSubheader} from 'semantic-ui-react';


const MessagesHeader = () => {
    return (
       <Segment clearing>
            {/* channel Title */}
           <Header fluid='true' as='h2' floated='left' style={{marginBottom:0}} >
           <span>
            Channel
            <Icon name={'star outline'} color='black'/>
           </span>
           <HeaderSubheader> 2 Users</HeaderSubheader>
           </Header>
            {/* channel search input */}
           <Header floated='right'>
               <Input size='mini' icon='search' name='searchTerm' placeholder='Search Messages'  />
           </Header>
       </Segment>
    )
}

export default MessagesHeader;
