import { GET_REFERRAL_INCOME, GET_REFERRAL_LIST } from '../actions/referral';

const initialState = {
  referralList: [],
  totalMember: 0,
  totalPendingMember: 0,
  totalActiveMember: 0,
  totalRejectedMember: 0,
  referralIncome: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_REFERRAL_LIST: {
      return {
        ...state,
        referralList: action.data?.list,
        totalMember: action.data?.totalMember,
        totalPendingMember: action.data?.totalPendingMember,
        totalActiveMember: action.data?.totalActiveMember,
        totalRejectedMember: action.data?.totalRejectedMember,
      };
    }

    case GET_REFERRAL_INCOME: {
      return {
        ...state,
        referralIncome: action.data,
      };
    }

    default:
      return state;
  }
};
