import React,{useEffect} from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css'


import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './firebase';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import {BrowserRouter as Router,Switch,Route,withRouter} from 'react-router-dom';
import rootReducer from './reducers';


const store=createStore(rootReducer,composeWithDevTools());

const Root=(props)=>{

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user=>{
            if(user){
                props.history.push("/");
                // console.log("useEffect");
            }
        });
    }, []);

    return <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
        </Switch>
}

const RootWithAuth=withRouter(Root);

ReactDOM.render(<Provider store={store}><Router><RootWithAuth/></Router></Provider>, document.getElementById('root'));
registerServiceWorker();
