
import axios from "axios";
import { BaseUrl } from "BaseUrl";
import Swal from "sweetalert2";

// Fetch candidates
// export const fetchCandidates = async (headers) => {
//   return await axios({
//     method: 'GET',
//     url: `${BaseUrl}/candidate/v1/getAllCandidatesByPagination?pageNumber=0&pageSize=10`,
//     headers: headers
//   });
// };
export const fetchCandidates = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/candidate/v1/getAllCandidatesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=100`,
    headers: headers
    
  });
};

// Add candidate
// export const addCandidate = async (cdata, headers) => {
//   return await axios({
//     method: "POST",
//     url: `${BaseUrl}/candidate/v1/createCandidate`,
//     headers,
//     data: cdata,
//   });
// };

export const addCandidate = async (data, headers) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/candidate/v1/createCandidate`,
      headers,
      data: JSON.stringify(data)
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'Candidate added successfully!',
      });
    } else if (res.data.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.data.errorMessage || 'Something went wrong',
      });
    }

    return res;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An unexpected error occurred',
    });
  }
};

// Get candidate by ID
export const getCandidateById = async (id, headers) => {
  return await axios({
    method: "GET",
    url: `${BaseUrl}/candidate/v1/getCandidateByMobileUserId?mobileUserId=${id}`,
    headers: headers,
  });
};

// // Update candidate
// export const updateCandidates = async (updatedData, headers) => {
//   return await axios({
//     method: "PUT",
//     url: `${BaseUrl}/candidate/v1/updateCandidate`,
//     headers: headers,
//     data: updatedData,
//   });
// };
 export const updateCandidates = async (updatedData, headers) => {
  try {
    const res = await axios.put(
      `${BaseUrl}/candidate/v1/updateCandidate`, // ✅ no /id in URL
      updatedData, // include mobileUserId in body
      { headers }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating candidate:", error);
    throw error;
  }
};



// Delete candidate
// export const deleteCandidate = async (id, headers) => {
//   return await axios({
//     method: 'DELETE',
//     url: `${BaseUrl}/candidate/v1/deleteCandidateById?mobileUserId=${id}`,
//     headers
//   });
// };

// Delete candidate
// export const deleteCandidate = async (id, headers) => {
//   try {
//     const res = await axios.delete(
//       `${BaseUrl}/candidate/v1/deleteCandidateById`,
//       {
//         params: { mobileUserId: id },
//         headers
//       }
//     );
//     return res;
//   } catch (error) {
//     console.error('Error deleting candidate:', error);
//     throw error;
//   }
// };

// export const deleteCandidate = async (id, headers) => {
//   try {
//     const res = await axios.delete(
//       `${BaseUrl}/candidate/v1/deleteCandidateById`,
//       {
//         params: { mobileUserId: id },
//         headers,
//       }
//     );
//     return res.data; // or return res to check status
//   } catch (error) {
//     console.error('Error deleting candidate:', error);
//     throw error;
//   }
// };

export const deleteCandidate = async (mobileUserId, headers) => {
  try {
    const res = await axios.delete(
      `https://wsproducts.cloudjiffy.net/wsc2clmsadmin/candidate/v1/deleteCandidateById/${mobileUserId}`,
      {
        params: { mobileUserId },
        headers
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};
 
