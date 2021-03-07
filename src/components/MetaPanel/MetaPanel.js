import React,{useState,useEffect} from 'react';
import {MenuMenu,MenuItem,Grid,GridRow,Icon,GridColumn,Header,HeaderContent,Image} from 'semantic-ui-react'


const MetaPanel = (props) => {
    const [state, setstate] = useState({
        currentChannel:null,
        isLoading:true
    });

    useEffect(() => {
        if(props.currentChannel)
        render();
    }, [props]);

    const render =() =>{
        setstate(prev=>({...prev,currentChannel:props.currentChannel,isLoading:false}));
    }

    const displayChannels=()=>{
        let res=Object.entries(state.currentChannel.users);
        console.log(res)
        return(
            !state.isLoading && res.map((ch,i)=>{
                return(
                    <MenuItem key={ch[0]} color='pink'  name={ch[0]} >
                    <span  style={{color:'#E61A8D' }}>
                    <Image src={ch[1].avatar} avatar style={{margin:'.5rem',color:'pink' }} />  # {ch[1].name} 
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
            {!state.isLoading && props.currentChannel && <Header style={{padding:'0.25rem',color:'white',}} as='h4' inverted> 
            <span style={{color:'white', backgroundColor:'#6956C9',padding:'15px'}}><Icon color='white' name='male'/>
            <Image src={props.currentChannel.createdBy.avatar} avatar style={{margin:'.5rem'}}/>{'  '}{props.currentChannel.createdBy.name}{' '}{"( Admin )."}
            </span>
            <HeaderContent style={{marginTop:'20px'}}>
             <span >Channel Description: {props.currentChannel.details}</span>
             </HeaderContent> 
            </Header>}
            <MenuMenu style={{marginTop:'1em',paddingBottom:'2em'}}>
            <MenuItem>
                <span style={{color:'#6956C9'}}>
                    <Icon name='users' />
                </span>
                {" "} <span style={{color:'white'}}>{"USERS."}</span>
            </MenuItem>
            {!state.isLoading && displayChannels()}
        </MenuMenu>
        </GridColumn>
       </Grid>
    )
}

export default MetaPanel;