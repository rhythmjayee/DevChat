import React from 'react'

import {Menu} from 'semantic-ui-react'
import UserPanel from './UserPanel/UserPanel';
import ChannelPanel from './ChannelPanel/ChannelPanel'
import DirectMessagePanel from './DirectMessagePanel/DirectMessagePanel'

const SidePanel = ({currentUser}) => {
    return (
        <Menu size='large' inverted fixed='left' vertical style={{background:'#2F2F2F', fontSize:'1.2em'}}>
            <UserPanel currentUser={currentUser}/>
            <ChannelPanel currentUser={currentUser}/>
            <DirectMessagePanel/>
        </Menu>

    )
}

export default SidePanel;