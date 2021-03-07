import React from 'react'

import {Menu} from 'semantic-ui-react'
import UserPanel from './UserPanel/UserPanel';
import ChannelPanel from './ChannelPanel/ChannelPanel'
import DirectMessagePanel from './DirectMessagePanel/DirectMessagePanel'
import Starred from './Starred/Starred';

const SidePanel = ({currentUser,isPrivateChannel}) => {
    return (
        <Menu size='large' inverted fixed='left' vertical style={{background:'#2F2F2F', fontSize:'1.2em',overflowY:"scroll"}}>
            <UserPanel currentUser={currentUser}/>
            <Starred  currentUser={currentUser}/>
            <ChannelPanel currentUser={currentUser}  isPrivateChannel={isPrivateChannel}/>
            <DirectMessagePanel currentUser={currentUser} isPrivateChannel={isPrivateChannel}/>
        </Menu>

    )
}

export default SidePanel;