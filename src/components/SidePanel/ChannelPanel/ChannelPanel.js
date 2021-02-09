import React,{useState} from 'react'

import {Icon, Menu, MenuItem, MenuMenu} from 'semantic-ui-react';

 const ChannelPanel = () => {
     const [state, setstate] = useState({
         channels:[]
     });

     const {channels}=state;
    return (
        <MenuMenu style={{marginTop:'1em',paddingBottom:'2em'}}>
            <MenuItem>
                <span>
                    <Icon name='exchange'/>
                </span>
                {' '}CHANNELS({channels.length})  <Icon name='add'/>
            </MenuItem>
            {/* Channels */}
        </MenuMenu>
    )
}

export default ChannelPanel;