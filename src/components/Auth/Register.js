import React,{useState} from 'react';
import {Grid,Form,Segment,Button,Header,Message,Icon, GridColumn, FormInput} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import md5 from 'md5';

import firebase from '../../firebase';
const Register=()=>{

    const [state, setstate] = useState({
        username:'',
        email:'',
        password:'',
        passwordConfirmation:'',
        errorsState:[],
        loading:false,
        success:false,
        userRef:firebase.database().ref('users')
    });// handling local state for register component
    
    const {username,email,password,passwordConfirmation,errorsState,loading,success}=state;

    const isFormValid=()=>{
        setstate({...state,errorsState:[],loading:true});// clearing all errors initally and set loading to true
        let errors=[];
        let error;
        if(isFormEmpty(state)){
            error={message:"Fill all details"};// if erorrs -> setting errors to local state
            errors.push(error);
            setstate({...state,errorsState:errors});
            return false;
        }else if(!isPasswordValid(state)){
            error={message:"Password is invalid"};
            errors.push(error);
            setstate({...state,errorsState:errors});
            return false;
        }else{
            return true;
        }
    }// fun. for checking validity of form

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


    const handleChange=(e)=>{
        e.persist();
        setstate(prevState=>({...prevState,[e.target.name]:e.target.value}));
};

    const handleSubmit= async (e) =>{
        try{
            e.preventDefault();
            if(isFormValid()){//creating user
                const createdUser= await firebase.auth().createUserWithEmailAndPassword(email,password);
                await createdUser.user.updateProfile({
                        displayName:username,
                        photoURL:`http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=robohash&r=x`
                    })//md5-> create hash
                    setstate({
                        username:'',
                        email:'',
                        password:'',
                        passwordConfirmation:'',
                        errorsState:[],
                        loading:false,
                        success:true
                        });
                await saveUser(createdUser);
                console.log("user Saved");
               
            }
        }
        catch(err){
                    console.error(err);
                    setstate({...state,errorsState:[...errorsState,err], loading:false});
                }
                
            }

    const saveUser=(createdUser)=>{
        return state.userRef.child(createdUser.user.uid).set({
            name:createdUser.user.displayName,
            avatar:createdUser.user.photoURL
        });
    }

    const handleInputError=(inputName)=>{
        return errorsState.some(err=>err.message.toLowerCase().includes(inputName))?'error':''
    }// adding erorr class to input field

    const displayErrors=()=>( errorsState.map((err,i)=><p key={i} style={{color:'#ff0033'}}>{err.message}</p>));// displaying errors

    return(

        <Grid textAlign='center' verticalAlign='middle' className='app'>
            <GridColumn style={{maxWidth:450}}>
                <Header as='h1' icon color='pink' textAlign='center'>
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
                {success && (
                    <Message success  style={{background:'#89f9ab'}}>
                        <h3>
                            Account successfully created
                        </h3>
                    </Message>
                )}
                <Form size='large'  onSubmit={handleSubmit}>
                <Segment stacked style={{background:'#ffb5d7'}}>
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
                <Message  style={{background:'#ffb5d7'}}><p style={{fontWeight:'bold'}}>Already a user? <Link to='/login'>Login</Link></p></Message>
            </GridColumn>
        </Grid>
    );
}

export default Register;
