import React,{useState} from 'react'

import {Grid, GridColumn, GridRow, Header, HeaderContent, Icon,Dropdown,Image} from 'semantic-ui-react';
import firebase from '../../../firebase'
import {connect} from 'react-redux'
import {clearChannel} from '../../../actions/index'


const UserPanel=(props)=> {

    const [presenceRef, setpresenceRef] = useState(firebase.database().ref('presence'));

    const dropDownOptions=()=>[
        {  
            key:'user',
            text: <span> Signed in as <strong>{props.currentUser.displayName}</strong> </span>,
            disabled: true
        },
        {
            key:'avatar',
            text: <span> Change Avatar</span>,
        },
        {
            key:'signOut',
            text:<span onClick={handleSignOut}>Sign Out</span>
        }
]

const handleSignOut= async ()=>{
    try{
        props.clearChannel();
        await presenceRef.child(props.currentUser.uid).remove();
        await firebase.auth().signOut();
        console.log('signOut!!');
    }
    catch(err){
        console.error(err.message);
    };
}


    return (
       <Grid style={{background:'#444444'}}>
        <GridColumn>
            <GridRow style={{padding:'1.2rem',margin:0}}>
                {/* App Header */}
                <Header inverted floated='left' as='h2'>
                <Icon color='pink' name='code'/>
                    <HeaderContent>
                        DevChat
                    </HeaderContent>
                </Header>
            </GridRow>

            {/* User DropDown */}
            <Header style={{padding:'0.25rem',color:'white', backgroundColor:'#6956C9'}} as='h4' inverted>
            <span style={{color:'white'}}>
            <Image src={props.currentUser.photoURL} avatar style={{margin:'.5rem'}}/>
            <Dropdown trigger={<span>{props.currentUser.displayName}</span>}  options={dropDownOptions()}/>
            </span>
                
            </Header>
        </GridColumn>
       </Grid>
    )
}

export default connect(null,{clearChannel})(UserPanel);
