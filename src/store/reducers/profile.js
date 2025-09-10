import {
  GET_PROFILE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_IMAGE,
  KYC_UPDATE,
  BANK_DETAILS_UPDATE,
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

    case UPDATE_PROFILE_IMAGE: {
      return {
        ...state,
      };
    }

    case KYC_UPDATE: {
      return {
        ...state,
      };
    }

    case BANK_DETAILS_UPDATE: {
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
