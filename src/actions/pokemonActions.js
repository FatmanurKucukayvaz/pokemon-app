import API from '../services/api';

export const getPokemons = (limit, offset) => {
    return async dispatch => {
        return new Promise((resolve, reject) =>{   
            console.log(limit, offset) 
            API.getData(`pokemon?limit=${limit}&offset=${offset}`).then(res=>{
                dispatch({ type: 'GET_POKEMON', data: res.data });
                resolve(res.data);
            }).catch(err=>{
                reject();
            });
        });
    }
};

export const getPokemon = (pokeId) => {
    return async dispatch => {
        return new Promise((resolve, reject) =>{    
            API.getData(`pokemon/${pokeId}`).then(res=>{
                resolve(res.data);
            }).catch(err=>{
                reject();
            });
        });
    }
};

export const cathOrReleasePokemon = (pokeArray) => {
    return async dispatch => {
        return new Promise((resolve, reject) =>{   
             dispatch({ type: 'CATH_OR_RELEASE_POKEMON', data: pokeArray });
             resolve(pokeArray);
        });
    }
}