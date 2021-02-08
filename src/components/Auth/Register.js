import React,{useState} from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon, GridColumn, FormInput} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

import firebase from '../../firebase';
const Register=()=>{

    const [state, setstate] = useState({
        username:'',
        email:'',
        password:'',
        passwordConfirmation:'',
        errorsState:[],
        loading:false
    });
    const {username,email,password,passwordConfirmation,errorsState,loading}=state;

    const isFormValid=()=>{
        setstate({...state,errorsState:[],loading:true});
        let errors=[];
        let error;
        if(isFormEmpty(state)){
            error={message:"Fill in all fields"};
            errors=[...errors,error];
            setstate({...state,errorsState:errors});
            return false;
        }else if(!isPasswordValid(state)){
            error={message:"Password is invalid"};
            errors=[...errors,error];
            setstate({...state,errorsState:errors});
            return false;
        }else{
            return true;
        }
    }
    const isFormEmpty=({username,email,password,passwordConfirmation})=>{
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }
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
        if(isFormValid()){
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
                    passwordConfirmation:'',
                    errorsState:[],
                    loading:false
                });
            })
            .catch(err=>{
                console.error(err);
                setstate({...state,errorsState:[...errorsState,err], loading:false});
            })
        }
    }

    const handleInputError=(inputName)=>{
        return errorsState.some(err=>err.message.toLowerCase().includes(inputName))?'error':''
    }

    return(

        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <GridColumn style={{maxWidth:450}}>
                <Header as='h2' icon color='pink' textAlign='center'>
                    <Icon name='code' color='pink'/>
                    Register for DevChat
                </Header>
                {errorsState.length>0 && (
                    <Message error  style={{background:'#ffb2d6'}}>
                        <h3>
                            {displayErrors()}
                        </h3>
                    </Message>
                )}
                <Form size='large'  onSubmit={handleSubmit}>
                <Segment stacked style={{background:'#E15597'}}>
                    <Form.Input fluid name='username' icon='user' iconPosition='left'
                    placeholder='Username' onChange={handleChange} value={state.username} type='text'
                    className={handleInputError('username')}/>

                    <Form.Input fluid name='email' icon='mail' iconPosition='left'
                    placeholder='Email Address'  onChange={handleChange} value={state.email} type='email' 
                    className={handleInputError('email')} />

                    <Form.Input fluid name='password' icon='lock' iconPosition='left'
                    placeholder='Password'  onChange={handleChange} value={state.password} type='password'
                    className={handleInputError('password')} />


                    <Form.Input fluid name='passwordConfirmation' icon='repeat' iconPosition='left'
                    placeholder='Password Confirmation'  onChange={handleChange} 
                    className={handleInputError('password')} value={state.passwordConfirmation} type='password' />

                    <Button disabled={loading} className={loading?'loading':''} style={{background:'#282C35'}} fluid size='large'>
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
