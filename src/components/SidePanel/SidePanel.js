import React from 'react'

import {Menu} from 'semantic-ui-react'
import UserPanel from './UserPanel/UserPanel'

const SidePanel = () => {
    return (
        <Menu size='large' inverted fixed='left' vertical style={{background:'#2F2F2F', fontSize:'1.2rem'}}>
            <UserPanel/>
        </Menu>

    )
}

export default SidePanel;