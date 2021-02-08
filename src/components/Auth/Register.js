import React,{useState} from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon, GridColumn, FormInput} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

import firebase from '../../firebase';
const Register=()=>{

    const [state, setstate] = useState({
        username:'',
        email:'',
        password:'',
        passwordConfirmation:''
    });
    const {username,email,password,passwordConfirmation}=state;

    const handleChange=(e)=>{
        setstate({...state,[e.target.name]:e.target.value});
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(state.email,state.password);
        firebase
        .auth()
        .createUserWithEmailAndPassword(email,password)
        .then(createdUser=>{
            console.log(createdUser);
            setstate({
                username:'',
                email:'',
                password:'',
                passwordConfirmation:''
            });
        })
        .catch(err=>{
            console.error(err);
        })
    }
    // console.log(state);
   

    return(

        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <GridColumn style={{maxWidth:450}}>
                <Header as='h2' icon color='pink' textAlign='center'>
                    <Icon name='code' color='pink'/>
                    Register for DevChat
                </Header>
                <Form size='large' style={{background:'#E15597'}} onSubmit={handleSubmit}>
                <Segment stacked style={{background:'#E15597'}}>
                    <Form.Input fluid name='username' icon='user' iconPosition='left'
                    placeholder='Username' onChange={handleChange} value={state.username} type='text' />

                    <Form.Input fluid name='email' icon='mail' iconPosition='left'
                    placeholder='Email Address'  onChange={handleChange} value={state.email} type='email' />

                    <Form.Input fluid name='password' icon='lock' iconPosition='left'
                    placeholder='Password'  onChange={handleChange} value={state.password} type='password' />


                    <Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition='left'
                    placeholder='Password Confirmation'  onChange={handleChange} value={state.passwordConfirmation} type='password' />

                    <Button style={{background:'#282C35'}} fluid size='large'>
                        <p style={{color:'#E15597'}}>Submit</p>
                    </Button>
                </Segment>
                </Form>
                <Message  style={{background:'#E15597'}}><p style={{fontWeight:'bold'}}>Already a user? <Link to='/login'>Login</Link></p></Message>
            </GridColumn>
        </Grid>
    );
}

export default Register;
