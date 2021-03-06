import React from 'react';

import {Header,Segment,Input,Icon, HeaderSubheader} from 'semantic-ui-react';


const MessagesHeader = (props) => {
    const {channelName,uniqueUsers='0 Users',handleSearchChange,searchLoading,isPrivateChannel,handleStar,isChannelStarred}=props;
    return (
       <Segment clearing>
            {/* channel Title */}
           <Header fluid='true' as='h2' floated='left' style={{marginBottom:0}} >
           <span>
            {channelName}
            {!isPrivateChannel && 
            <Icon 
            onClick={handleStar}
            name={isChannelStarred?'star':'star outline'}
            color={isChannelStarred?'yellow':'black'}/>
            }
           </span>
           <HeaderSubheader>{!isPrivateChannel &&  uniqueUsers}</HeaderSubheader>
           </Header>
            {/* channel search input */}
           <Header floated='right'>
               <Input size='mini' icon='search' name='searchTerm' placeholder='Search Messages'  onChange={handleSearchChange} loading={searchLoading}/>
           </Header>
       </Segment>
    )
}

export default MessagesHeader;
