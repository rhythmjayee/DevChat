import React,{useEffect} from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css'


import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './firebase';
import {createStore} from 'redux';
import {Provider,connect} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import {BrowserRouter as Router,Switch,Route,withRouter} from 'react-router-dom';
import rootReducer from './reducers';
import {setUser,clearUser} from './actions/index'
import Spinner from './Spinner';


const store=createStore(rootReducer,composeWithDevTools());// making of store and connecting redux-devtools

const Root=(props)=>{//root component

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user=>{ // checking already logged In user from firebase localstorage
            if(user){
                //triggering actions
                props.setUser(user);
                props.history.push("/"); // ---history.push?
            }else{
                props.history.push('/login');
                props.clearUser();
            }
        });
    }, []);

    return props.isLoading?<Spinner/>: (<Switch> 
            <Route exact path="/" component={App}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
        </Switch>) 
}

const mapsStateFromProps= state =>{
    return{
        isLoading:state.user.isLoading
    }
}

const RootWithAuth=withRouter(connect(mapsStateFromProps,{setUser,clearUser})(Root)); // withRouter->providing extra props to component..like history etc.
//connect redux to component and mapsStateFromProps-> provide store state to compoment && redux-actions through props
ReactDOM.render(
    <Provider store={store}> 
        <Router>
            <RootWithAuth/>
        </Router>
    </Provider>
    , document.getElementById('root')); //provinding store to all components
registerServiceWorker();
