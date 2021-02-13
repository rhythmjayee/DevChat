import React from 'react';

import {Header,Segment,Input,Icon, HeaderSubheader} from 'semantic-ui-react';


const MessagesHeader = (props) => {
    const {channelName,uniqueUsers,handleSearchChange,searchLoading}=props;
    return (
       <Segment clearing>
            {/* channel Title */}
           <Header fluid='true' as='h2' floated='left' style={{marginBottom:0}} >
           <span>
            {channelName}
            <Icon name={'star outline'} color='black'/>
           </span>
           <HeaderSubheader>{uniqueUsers}</HeaderSubheader>
           </Header>
            {/* channel search input */}
           <Header floated='right'>
               <Input size='mini' icon='search' name='searchTerm' placeholder='Search Messages'  onChange={handleSearchChange} loading={searchLoading}/>
           </Header>
       </Segment>
    )
}

export default MessagesHeader;
