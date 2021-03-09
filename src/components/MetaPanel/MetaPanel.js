import React,{useState,useEffect} from 'react';
import {MenuMenu,MenuItem,Grid,GridRow,Icon,GridColumn,Header,HeaderContent,Image} from 'semantic-ui-react'
import firebase from '../../firebase';

const MetaPanel = (props) => {
    const [state, setstate] = useState({
        currentChannel:null,
        channelRef:firebase.database().ref('channels')
    });
    const [channelUsers,setChannelUsers] =useState({
        isLoading:true,
        users:[]
    });

    useEffect(() => {
        if(props.currentChannel)
        render(props.currentChannel);
    }, [props]);

    const render =(channel) =>{
        setstate(prev=>({...prev,currentChannel:channel,isLoading:false}));
        state.channelRef.child(channel.id).child('users').on('child_added',snap=>{
            let user={id:snap.key,...snap.val()};
            // console.log(user);
            setChannelUsers(prev=>({...prev,users:[...prev.users,user],isLoading:false}));
        })
    }

    const displayChannels=()=>{
        // let res=Object.entries(state.currentChannel.users);
        // console.log(res)
        return(
            !channelUsers.isLoading && channelUsers.users.map((ch,i)=>{
                return(
                    <MenuItem key={ch.id} color='pink'  name={ch.id} >
                    <span  style={{color:'#E61A8D' }}>
                    <Image src={ch.avatar} avatar style={{margin:'.5rem',color:'pink' }} />  # {ch.name} 
                    </span>
                    </MenuItem>
                )
            })
        )
     }
    return (
        <Grid style={{background:'#444444',height:'90vh'}}>
        <GridColumn>
            <GridRow style={{padding:'1.2rem',margin:0}}>
                {/* App Header */}
                <Header inverted floated='left' as='h4'>
                <Icon color='pink' name='rss'/>
                    <HeaderContent>
                        Channel Info.
                    </HeaderContent>
                </Header>
            </GridRow>
            {!channelUsers.isLoading && props.currentChannel && <Header style={{padding:'0.25rem',color:'white',}} as='h4' inverted> 
            <span style={{color:'white', backgroundColor:'#6956C9',padding:'15px'}}><Icon name='male'/>
            <Image src={props.currentChannel.createdBy.avatar} avatar style={{margin:'.5rem'}}/>{'  '}{props.currentChannel.createdBy.name}{' '}{"( Admin )."}
            </span>
            <HeaderContent style={{marginTop:'20px'}}>
             <span >Channel Description: {props.currentChannel.details}</span>
             </HeaderContent> 
            </Header>}
            <MenuMenu style={{marginTop:'1em',paddingBottom:'2em',overflowY:"scroll"}}>
            <MenuItem>
                <span style={{color:'#6956C9'}}>
                    <Icon name='users' />
                </span>
                {" "} <span style={{color:'white'}}>{"USERS."}</span>
            </MenuItem>
            {!channelUsers.isLoading && displayChannels()}
        </MenuMenu>
        </GridColumn>
       </Grid>
    )
}

export default MetaPanel;