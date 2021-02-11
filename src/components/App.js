import React from 'react'; 
import './App.css';

import {connect} from 'react-redux'

import {Grid, GridColumn} from 'semantic-ui-react';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel'

const App=({currentUser,currentChannel})=>{
  return(
   <Grid columns='equal' className='app' style={{background:'#eeee'}}>
      <ColorPanel/>
      <SidePanel 
      currentUser={currentUser}
        key={currentUser && currentUser.uid}
      />

      <GridColumn style={{marginLeft:320}}>
        <Messages 
        currentChannel={currentChannel}
        currentUser={currentUser}
        key={currentChannel && currentChannel.id}
        />
      </GridColumn>

      <GridColumn width={4}>
        <MetaPanel/>
      </GridColumn>
   </Grid>
  )
}// providing user state as prop to all children components from the store
const mapStatesFromProps= state =>{
  return{
      currentUser:state.user.currentUser,
      currentChannel:state.channel.currentChannel
  }
}
export default connect(mapStatesFromProps)(App);
