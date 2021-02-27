import {combineReducers} from 'redux';
import * as actionTypes from '../actions/types';

//Here global state changes through actions

const initialUserState={
    currentUser:null,
    isLoading:true
}


const user_reducer=(state = initialUserState ,action)=>{
    switch(action.type){
        case actionTypes.SET_USER:
            return{
                ...state,
                currentUser:action.payload.currentUser,
                isLoading:false
            }
            case actionTypes.CLEAR_USER:
            return{
                ...state,
                currentUser:null,
                isLoading:false
            }
        default:
            return state;
    }
}// global state for handling user

const initalChannelState={
    currentChannel:null,
    isPrivateChannel:false
}

const channel_reducer=(state = initalChannelState ,action)=>{
    switch(action.type){
        case actionTypes.SET_CURRENT_CHANNEL:
            return{
                ...state,
                currentChannel:action.payload.currentChannel,
            }
            case actionTypes.SET_PRIVATE_CHANNEL:
            return{
                ...state,
                isPrivateChannel:action.payload.isPrivateChannel,
            }
            case actionTypes.CLEAR_CHANNEL:
                return{
                    ...state,
                    currentChannel:null,
                    isPrivateChannel:false
                }
            
        default:
            return state;
    }
}// global state for handling channel

const rootReducer= combineReducers({
    user:user_reducer,
    channel:channel_reducer
});// combining all  reducers for single global state

export default rootReducer;
