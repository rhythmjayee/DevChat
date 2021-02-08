import React,{useState} from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon, GridColumn, FormInput} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

import firebase from '../../firebase';
const Login=()=>{

    const [state, setstate] = useState({
        email:'',
        password:'',
        errorsState:[],
        loading:false,
    });
    const {username,email,password,passwordConfirmation,errorsState,loading,success}=state;

    
    const isPasswordValid=({password,passwordConfirmation})=>{
        if(password.length<6 || passwordConfirmation<6){
            return false;
        }else if(password!==passwordConfirmation){
            return false;
        }else{
            return true;
        }
    }

    const displayErrors=()=>( errorsState.map((err,i)=><p key={i} style={{color:'#282C35'}}>{err.message}</p>))


    const handleChange=(e)=>{
        setstate({...state,[e.target.name]:e.target.value});
    };
    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(state.email,state.password);
        if(isFormValid()){
       
        }
    }

    const handleInputError=(inputName)=>{
        return errorsState.some(err=>err.message.toLowerCase().includes(inputName))?'error':''
    }

    return(

        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <GridColumn style={{maxWidth:450}}>
                <Header as='h1' icon color='violet' textAlign='center'>
                    <Icon name='code branch' color='violet'/>
                Login to DevChat
                </Header>
                {errorsState.length>0 && (
                    <Message error  style={{background:'#ffb2d6'}}>
                        <h3>
                            {displayErrors()}
                        </h3>
                    </Message>
                )}
                {success && (
                    <Message success  style={{background:'#89f9ab'}}>
                        <h3>
                            Account successfully created
                        </h3>
                    </Message>
                )}
                <Form size='large'  onSubmit={handleSubmit}>
                <Segment stacked style={{background:'#cac1ff'}}>

                    <Form.Input fluid name='email' icon='mail' iconPosition='left'
                    placeholder='Email Address'  onChange={handleChange} value={state.email} type='email' 
                    className={handleInputError('email')} />

                    <Form.Input fluid name='password' icon='lock' iconPosition='left'
                    placeholder='Password'  onChange={handleChange} value={state.password} type='password'
                    className={handleInputError('password')} />

                    <Button disabled={loading} className={loading?'loading':''} style={{background:'#6956C9'}} fluid size='large'>
                        <p style={{color:'#4B204B'}}>Submit</p>
                    </Button>
                </Segment>
                </Form>
                <Message  style={{background:'#cac1ff'}}><p style={{fontWeight:'bold'}}>Dont have an account? <Link to='/register'>Register</Link></p></Message>
            </GridColumn>
        </Grid>
    );
}

export default Login;
