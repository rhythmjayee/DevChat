import React from 'react'

import {Grid, GridColumn, GridRow, Header, HeaderContent, Icon,Dropdown} from 'semantic-ui-react';
import firebase from '../../../firebase'

const UserPanel=()=> {


    const dropDownOptions=()=>[
        {  
            key:'user',
            text: <span> Signed in as <strong>User</strong> </span>,
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

const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(res=>{
        console.log('signOut!!');
    })
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
            <Header style={{padding:'0.25rem'}} as='h4' inverted>
                <Dropdown tigger={
                    <span>User</span>
                } options={dropDownOptions()}/>
            </Header>
        </GridColumn>
       </Grid>
    )
}

export default UserPanel;
