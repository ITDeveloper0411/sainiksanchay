import { BASE_URL } from '../../config/Constant';

export const GET_REFERRAL_LIST = 'GET_REFERRAL_LIST';
export const GET_REFERRAL_INCOME = 'GET_REFERRAL_INCOME';

export const getReferralList = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${BASE_URL}referral-list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const result = await response.json();
      if (response.status === 401) {
        throw new Error('Internal Server Error');
      } else {
        throw new Error(result.msg);
      }
    }

    const result = await response.json();

    if (result.status) {
      dispatch({
        type: GET_REFERRAL_LIST,
        data: {
          list: result.referrals,
          totalMember: result.total_mem,
          totalPendingMember: result.total_pending_mem,
          totalActiveMember: result.total_active_mem,
          totalRejectedMember: result.total_rejected_mem,
        },
      });
    } else {
      throw new Error(result.msg);
    }
  };
};

export const getReferralIncome = (month, year) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${BASE_URL}referral-income-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        month,
        year,
      }),
    });

    if (!response.ok) {
      const result = await response.json();
      if (response.status === 401) {
        throw new Error('Internal Server Error');
      } else {
        throw new Error(result.msg);
      }
    }

    const result = await response.json();

    if (result.status) {
      dispatch({
        type: GET_REFERRAL_INCOME,
        data: result.income,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};
