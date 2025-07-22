import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

export const fetchUsers = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/userprofile/v1/getAllUserProfileByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addUsers = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/userprofile/v1/createUserProfile`,
      headers,
      data: data
    }).then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};

export const getUsersById = async (id, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/userprofile/v1/getUserProfileByUserId/{userId}?userId=${id}`,
    headers: headers
  });
};

export const updatedUsers = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/userprofile/v1/updateUserProfile`,
    headers: headers,
    data: updatedData
  })
    .then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const deleteUsers = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/userprofile/v1/deleteUserProfileByUserId/${id}`,
    headers
  })
    .then((res) => {
      if (res.data.responseCode === 200) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};


//candidates
export const fetchCandidates = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/candidate/v1/getAllCandidatesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addCandidate = async (headers, cdata) => {
  try {
    await axios({
      method: "POST",
      url: `${BaseUrl}/candidate/v1/createCandidate`,
      headers,
      data: cdata,
    }).then(function (res) {
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};

export const getCandidateById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/candidate/v1/getCandidateByMobileUserId/{mobileUserId}?mobileUserId=${id}`,
    headers: headers,
  });
};

export const updateCandidates = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: "PUT",
    url: `${BaseUrl}/candidate/v1/updateCandidate`,
    headers: headers,
    data: updatedData,
  })
    .then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const deleteCandidate = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/candidate/v1/deleteCandidateById/{mobileUserId}?mobileUserId/${id}`,
    headers
  })
    .then((res) => {
      if (res.data.responseCode === 200) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
