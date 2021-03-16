import React from 'react'; 
import './App.css';

import {connect} from 'react-redux'

import {Grid, GridColumn} from 'semantic-ui-react';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel'

const App=({currentUser,currentChannel,isPrivateChannel})=>{
  return(
   <Grid columns='equal' className='app' style={{background:'#eeee'}}>
      <ColorPanel currentUser={currentUser}/>
      <SidePanel 
      currentUser={currentUser}
      isPrivateChannel={isPrivateChannel}
        key={currentUser && currentUser.uid}
      />

      <GridColumn style={{marginLeft:320}}>
        <Messages 
        currentChannel={currentChannel}
        currentUser={currentUser}
        key={currentChannel && currentChannel.id}
        isPrivateChannel={isPrivateChannel}
        />
      </GridColumn>

      <GridColumn width={4}>
        {!isPrivateChannel && <MetaPanel
          currentChannel={currentChannel}
        currentUser={currentUser}
        />}
      </GridColumn>
   </Grid>
  )
}// providing user state as prop to all children components from the store
const mapStatesFromProps= state =>{
  return{
      currentUser:state.user.currentUser,
      currentChannel:state.channel.currentChannel,
      isPrivateChannel:state.channel.isPrivateChannel
  }
}
export default connect(mapStatesFromProps)(App);
