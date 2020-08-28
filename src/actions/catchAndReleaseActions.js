export const cathOrReleasePokemon = (pokeArray) => {
    return async dispatch => {
        return new Promise((resolve, reject) =>{   
             dispatch({ type: 'CATH_OR_RELEASE_POKEMON', data: pokeArray });
             resolve(pokeArray);
        });
    }
}