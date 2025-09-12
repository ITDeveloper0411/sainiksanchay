import { BASE_URL } from '../../config/Constant';

export const GET_PROFILE = 'GET_PROFILE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const KYC_UPDATE = 'KYC_UPDATE';
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
        data: result.member,
      });
    } else {
      throw new Error(result.msg);
    }
  };
};

// In your profile actions file (profile.js)
export const profileUpdate = profileData => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    try {
      const response = await fetch(`${BASE_URL}update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profileData.name,
          father: profileData.father,
          gender: profileData.gender,
          mobile: profileData.mobile,
          emailid: profileData.emailid,
          state: profileData.state_id,
          district: profileData.district_id,
          address: profileData.address,
          pincode: profileData.pincode,
          occupation: profileData.occupation,
          dob: profileData.dob,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(result.msg || 'Failed to update profile details');
        }
      }

      if (result.status) {
        return {
          success: true,
          message: result.msg || 'Profile updated successfully',
        };
      } else {
        throw new Error(result.msg || 'Failed to update profile details');
      }
    } catch (error) {
      if (error.message === 'Network request failed') {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  };
};

// In your profile actions file
export const profileImageUpdate = formData => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    try {
      const response = await fetch(`${BASE_URL}update-profile-img`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type header - let React Native set it with boundary
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || 'Upload failed');
      }

      if (result.status) {
        return {
          success: true,
          message: result.msg,
        };
      } else {
        throw new Error(result.msg || 'Upload failed');
      }
    } catch (error) {
      throw error;
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

export const nomineeDetailsUpdate = nomineeData => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;

    try {
      const response = await fetch(`${BASE_URL}update-nominee-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nomineeData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(result.msg || 'Failed to update nominee details');
        }
      }

      if (result.status) {
        return {
          success: true,
          message: result.msg || 'Nominee details updated successfully',
        };
      } else {
        throw new Error(result.msg || 'Failed to update nominee details');
      }
    } catch (error) {
      if (error.message === 'Network request failed') {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
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
