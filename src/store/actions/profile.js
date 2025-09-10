import { BASE_URL } from '../../config/Constant';

export const GET_PROFILE = 'GET_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const UPDATE_PROFILE_IMAGE = 'UPDATE_PROFILE_IMAGE';
export const KYC_UPDATE = 'KYC_UPDATE';
export const BANK_DETAILS_UPDATE = 'BANK_DETAILS_UPDATE';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';

export const getProfile = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${BASE_URL}profile`, {
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
        type: GET_PROFILE,
        data: result.data,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};

export const profileUpdate = (name, email, stateId, districtId, address) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${BASE_URL}update_profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        state: stateId,
        city: districtId,
        address: address,
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
        type: UPDATE_PROFILE,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};

export const profileImageUpdate = image => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const fd = new FormData();

    if (image.uri && image.type) {
      fd.append('image', {
        type: image.type,
        name: image.fileName,
        uri: image.uri,
      });
    }

    const response = await fetch(`${BASE_URL}update_profile_image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: fd,
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
        type: UPDATE_PROFILE_IMAGE,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};

// Update the action creator (kycUpdate)
export const kycUpdate = (
  panImage,
  panNumber,
  aadhaarImage,
  photo,
  chequeImage,
  dafDocument,
  aadhaarNumber,
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const fd = new FormData();

    fd.append('pan_no', panNumber);
    fd.append('aadhar_no', aadhaarNumber);

    if (panImage.uri) {
      fd.append('pan_img', {
        type: panImage.type || 'image/jpeg',
        name: panImage.fileName || 'pan_image.jpg',
        uri: panImage.uri,
      });
    }
    if (aadhaarImage.uri) {
      fd.append('aadhar_img', {
        type: aadhaarImage.type || 'image/jpeg',
        name: aadhaarImage.fileName || 'aadhaar_image.jpg',
        uri: aadhaarImage.uri,
      });
    }
    if (photo.uri) {
      fd.append('photo', {
        type: photo.type || 'image/jpeg',
        name: photo.fileName || 'photo.jpg',
        uri: photo.uri,
      });
    }
    if (chequeImage.uri) {
      fd.append('cheque', {
        type: chequeImage.type || 'image/jpeg',
        name: chequeImage.fileName || 'cheque_image.jpg',
        uri: chequeImage.uri,
      });
    }
    if (dafDocument.uri) {
      fd.append('daf', {
        type: dafDocument.type === 'pdf' ? 'application/pdf' : 'image/jpeg',
        name:
          dafDocument.name ||
          (dafDocument.type === 'pdf' ? 'daf_document.pdf' : 'daf_image.jpg'),
        uri: dafDocument.uri,
      });
    }

    try {
      const response = await fetch(`${BASE_URL}update_kyc_details`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: fd,
      });

      if (!response.ok) {
        const result = await response.json();
        if (response.status === 401) {
          throw new Error('Internal Server Error');
        } else {
          throw new Error(result.msg || 'Failed to update KYC');
        }
      }

      const result = await response.json();

      if (result.status) {
        dispatch({
          type: KYC_UPDATE,
        });
        return result; // Return the result for handling in the component
      } else {
        throw new Error(result.msg || 'Failed to update KYC');
      }
    } catch (error) {
      throw error;
    }
  };
};

export const bankDetailsUpdate = (
  accountNumber,
  bankName,
  branchName,
  ifscCode,
) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${BASE_URL}update_bank_details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        account: accountNumber,
        bank: bankName,
        branch: branchName,
        ifsc: ifscCode,
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
        type: BANK_DETAILS_UPDATE,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};

export const changePassword = (currentPassword, newPassword) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    const response = await fetch(`${BASE_URL}change_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        old_password: currentPassword,
        new_password: newPassword,
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
        type: CHANGE_PASSWORD,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};
