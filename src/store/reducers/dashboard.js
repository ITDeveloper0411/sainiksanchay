import { GET_DASHBOARD } from '../actions/dashboard';

const initialState = {
  totalReferral: 0,
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_DASHBOARD: {
      return {
        ...state,
        totalReferral: action.data?.referral,
        totalAmount: action.data?.amount,
      };
    }

    default:
      return state;
  }
};
