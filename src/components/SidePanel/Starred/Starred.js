import React,{useState} from 'react';
import {connect} from 'react-redux';
import {MenuMenu,Icon,Button,MenuItem} from 'semantic-ui-react';
import {setChannel,setPrivateChannel} from '../../../actions/index'

const Starred = () => {

    const [state, setState] = useState({
        starredChannels:[],
    });
    const [activeCh,setactiveCh]= useState('');

    const displayChannels=(starredChannels)=>{
        return(
             starredChannels.length>0 && starredChannels.map((ch,i)=>{
                return(
                    <MenuItem key={ch.id} active={ !props.isPrivateChannel && ch.id===activeCh.id} color='pink' onClick={()=>changeChannel(ch)}  name={ch.name} >
                        # {ch.name} 
                    </MenuItem>
                )
            })
        )
     }
     const changeChannel=(channel)=>{
        setactiveCh(channel);
        props.setChannel(channel);
        props.setPrivateChannel(false);
       
     }

     const {starredChannels} = state;
    return (
        <MenuMenu style={{marginTop:'1em',paddingBottom:'2em'}}>
        <MenuItem>
            <span>
                <Icon name='star'/> STARRED
            </span>
            {' '}({starredChannels.length})
        </MenuItem>
        {/* Channels */}
        {/* {firstLoad && <Button style={{backgroundColor:'#515050'}} className={'loading'}></Button>}
        {!firstLoad && channels.length>0 && displayChannels()}
        {!firstLoad && channels.length==0 && "No Channels Found!!"} */}
    </MenuMenu>
    )
}

export default connect(null,{setChannel,setPrivateChannel})(Starred);
