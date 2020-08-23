let initialState = {
  pokemons: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_POKEMON":
      return { ...state, pokemons: action.data };
    default:
      return state;
  }
};
