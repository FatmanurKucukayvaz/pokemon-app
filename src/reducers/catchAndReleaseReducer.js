let initialState = {
    catchedPokemons: [],
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "CATH_OR_RELEASE_POKEMON":
        return { ...state, catchedPokemons: action.data };      
      default:
        return state;
    }
  };
  