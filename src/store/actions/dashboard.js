import { BASE_URL } from '../../config/Constant';

export const GET_DASHBOARD = 'GET_DASHBOARD';

export const getDashboard = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${BASE_URL}dashboard-data`, {
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
        type: GET_DASHBOARD,
        data: {
          referral: result.total_referral,
          amount: result.total_amount,
        },
      });
    } else {
      throw new Error(result.msg);
    }
  };
};
