import {
  GET_PROFILE,
  UPDATE_PROFILE,
  KYC_UPDATE,
  CHANGE_PASSWORD,
} from '../actions/profile';

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

    case UPDATE_PROFILE: {
      return {
        ...state,
      };
    }

    case KYC_UPDATE: {
      return {
        ...state,
      };
    }

    case CHANGE_PASSWORD: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};
