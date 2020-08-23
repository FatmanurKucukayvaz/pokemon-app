import { combineReducers } from "redux";
import pokemonReducer from './pokemonReducer';
import catchAndReleaseReducer from './catchAndReleaseReducer';

export default combineReducers({
    pokemonReducer: pokemonReducer,
    catchAndReleaseReducer: catchAndReleaseReducer
});
