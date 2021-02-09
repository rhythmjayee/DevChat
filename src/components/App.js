import React from 'react'; 
import './App.css';

import {connect} from 'react-redux'

import {Grid, GridColumn} from 'semantic-ui-react';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel'

const App=({currentUser})=>{
  return(
   <Grid columns='equal' className='app' style={{background:'#eeee'}}>
      <ColorPanel/>
      <SidePanel currentUser={currentUser}/>

      <GridColumn style={{marginLeft:320}}>
        <Messages/>
      </GridColumn>

      <GridColumn width={4}>
        <MetaPanel/>
      </GridColumn>
   </Grid>
  )
}
const mapStatesFromProps= state =>{
  return{
      currentUser:state.user.currentUser
  }
}
export default connect(mapStatesFromProps)(App);
