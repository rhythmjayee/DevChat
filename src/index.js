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


const store=createStore(rootReducer,composeWithDevTools());

const Root=(props)=>{

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                props.setUser(user);
                props.history.push("/");
                // console.log("useEffect");
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

const RootWithAuth=withRouter(connect(mapsStateFromProps,{setUser,clearUser})(Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth/>
        </Router>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
