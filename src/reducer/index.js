import { combineReducers } from 'redux';
import user from './user';
import song from './song';

export default combineReducers({ user, song });
