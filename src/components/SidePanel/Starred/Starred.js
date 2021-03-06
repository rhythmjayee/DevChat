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
        firstLoad:false
    });
    const [refs, setRefs] = useState({
        userRef:firebase.database().ref('users')
    });
    const [activeCh,setactiveCh]= useState('');

    useEffect(() => {
        if(state.user)
        firstRender(state.user.uid);
       
    }, [])

    useEffect(() => {
        if(state.user && state.firstLoad)
        addListner(state.user.uid);

    }, [state.firstLoad]);

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
        setState({...state,starredChannels:channels,starredChannelKeys:channelKeys,firstLoad:true});
        // addListner(userId)
    }

    const addListner =(userId)=>{
        // let ch=[];
        // let newChannels=[];    
        refs.userRef.child(userId).child('starred').endAt().limitToLast(1).on('child_added',snap=>{
            console.log(state.starredChannels,state.starredChannelKeys); 
            const starredChannel ={id:snap.key,...snap.val()};
            if(state.starredChannelKeys.indexOf(starredChannel.id)===-1){
                setState(
                    {...state,
                    starredChannels:[...state.starredChannels,starredChannel],
                    starredChannelKeys:[...state.starredChannelKeys,snap.key],
                    firstLoad:true}
                    );
                    console.log('added')
                    // console.log(state.starredChannels,state.starredChannelKeys); 
                // newChannels.push(starredChannel);
                // ch.push(snap.key);
            }
           
        })

        refs.userRef.child(userId).child('starred').on('child_removed',snap=>{
            console.log(state.starredChannels,state.starredChannelKeys)
            const channelToRemoved ={id:snap.key,...snap.val()};
            const filteredChannels=state.starredChannels.filter(channel=>{
                return channel.id !==channelToRemoved.id
            })
            const filteredChannelKeys=state.starredChannelKeys.filter(id=>{
                console.log(id);
                return id!==channelToRemoved.id
            })
            console.log(filteredChannels,filteredChannelKeys)
            setState({...state,starredChannels:filteredChannels,starredChannelKeys:filteredChannelKeys,firstLoad:true});
        })
    }

    const displayChannels=(starredChannels)=>{
        console.log(starredChannels);
        return(
             state.firstLoad && starredChannels.length>0 && starredChannels.map((ch,i)=>{
                return(
                    <MenuItem key={ch.id} active={ ch.id===activeCh.id}  onClick={()=>changeChannel(ch)}  name={ch.name} >
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

     const {firstLoad,starredChannels} = state;
    return (
        <MenuMenu style={{marginTop:'1em',paddingBottom:'2em'}}>
        <MenuItem>
            <span>
                <Icon name='star'/> STARRED
            </span>
            {' '}({starredChannels.length})
        </MenuItem>
        {/* Channels */}
        {firstLoad && starredChannels.length>0 && displayChannels(starredChannels)}        
    </MenuMenu>
    )
}

export default connect(null,{setChannel,setPrivateChannel})(Starred);
