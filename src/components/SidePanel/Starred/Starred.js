import React,{useState,useEffect} from 'react';
import {connect} from 'react-redux';
import firebase from '../../../firebase';
import {MenuMenu,Icon,Button,MenuItem} from 'semantic-ui-react';
import {setChannel,setPrivateChannel} from '../../../actions/index'

const Starred = (props) => {

    const [state, setState] = useState({
        user:props.currentUser,
        starredChannels:[],
        starredChannelKeys:[],
        isLoading:true
    });
    const [refs, setRefs] = useState({
        userRef:firebase.database().ref('users')
    });
    const [activeCh,setactiveCh]= useState('');

    useEffect(() => {
        if(state.user)
        addListner(state.user.uid);       
    }, [])
//--------------------------------------------
    const firstRender= async (userId)=>{

        const res= await refs.userRef.child(userId).child('starred').once('value');
        let entries=[];
        // console.log(res);
        if(res.val()) entries=Object.entries(res.val());
        let channels=[];
        let channelKeys=[];
        entries.forEach(en=>{
            channels.push({id:en[0],...en[1]});
            channelKeys.push(en[0]);
        })
        
        // console.log(channels,channelKeys);
        setState({...state,starredChannels:channels,starredChannelKeys:channelKeys,isLoading:false});
        // addListner(userId)
    }
//--------------------------------------------------
    const addListner =(userId)=>{
        let res=[];
        refs.userRef.child(userId).child('starred').on('value',snap=>{
            
            if(snap.val())
            res=Object.entries(snap.val());
            // console.log(res,snap.numChildren());
            let updatedChannels=[];
            snap.numChildren() && res.forEach(ch=>{
                // console.log(updatedChannels,ch[0],ch[1]);
                updatedChannels=[...updatedChannels,{id:ch[0],...ch[1]}];
            })
           
            setState(prev=>({...prev,starredChannels:updatedChannels,isLoading:false}));
        })
    }

    const displayChannels=()=>{
        // console.log(state.starredChannels);
        return(
            !state.isLoading && state.starredChannels.length>0 && state.starredChannels.map((ch,i)=>{
                return(
                    <MenuItem key={ ch.id} active={ ch.id===activeCh.id}  onClick={()=>changeChannel(ch)}  name={ch.name} >
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

     const {isLoading,starredChannels} = state;
    return (
        <MenuMenu style={{marginTop:'1em',paddingBottom:'2em'}}>
        <MenuItem>
            <span>
                <Icon name='star'/> STARRED
            </span>
            {' '}({starredChannels.length})
        </MenuItem>
        {/* Channels */}
        {!isLoading && starredChannels.length>0 && displayChannels()}        
    </MenuMenu>
    )
}

export default connect(null,{setChannel,setPrivateChannel})(Starred);
