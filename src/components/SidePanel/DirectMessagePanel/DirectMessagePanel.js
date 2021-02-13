import React,{useState,useEffect} from 'react';
import {Menu,Icon, MenuMenu, MenuItem} from 'semantic-ui-react';

const DirectMessagePanel = () => {
    const [state, setstate] = useState({
        users:[]
    });


    const {users}=state;
    return (
       <MenuMenu className='menu' >
           <MenuItem>
               <span>
                   <Icon name='mail'/> DIRECT MESSAGES
               </span>{' '}
               ({users.length})
           </MenuItem>
           {/* User to Send Direct Messages */}
       </MenuMenu>
    )
}

export default DirectMessagePanel
