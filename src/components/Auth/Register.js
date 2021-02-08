import React from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon, GridColumn, FormInput} from 'semantic-ui-react';
import {Link} from 'react-router-dom';


const Register=()=>{

    const handleChange=()=>{
        
    }
    return(
        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <GridColumn style={{maxWidth:450}}>
                <Header as='h2' icon color='pink' textAlign='center'>
                    <Icon name='code piece' color='pink'/>
                    Register for DevChat
                </Header>
                <Form size='large' style={{background:'#E15597'}}>
                <Segment stacked style={{background:'#E15597'}}>
                    <Form.Input fluid name='username' icon='user' iconPosition='left'
                    placeholder='Username'  type='text' />

                    <Form.Input fluid name='email' icon='mail' iconPosition='left'
                    placeholder='Email Address' type='email' />

                    <Form.Input fluid name='password' icon='lock' iconPosition='left'
                    placeholder='Password' type='password' />


                    <Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition='left'
                    placeholder='Password Confirmation'  type='password' />

                    <Button style={{background:'#282C35'}} fluid size='large'>
                        <p style={{color:'#E15597'}}>Submit</p>
                    </Button>
                </Segment>
                </Form>
                <Message>Already a user? <Link to='/login'>Login</Link></Message>
            </GridColumn>
        </Grid>
    )
}

export default Register;
