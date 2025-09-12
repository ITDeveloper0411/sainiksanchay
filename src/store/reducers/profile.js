import { GET_PROFILE } from '../actions/profile';

const initialState = {
  profile: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PROFILE: {
      return {
        ...state,
        profile: action.data,
      };
    }

    default:
      return state;
  }
};
