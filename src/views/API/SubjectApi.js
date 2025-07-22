import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

// Fetch subjects with pagination
export const fetchSubjects = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/subject/v1/getAllSubjectsByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers
  });
};

// Fetch all subjects (non-paginated if available)
export const fetchAllSubjects = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/subject/v1/getAllSubjects`,
    headers
  });
};

// Add a new subject
// export const addSubject = async (data, headers) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: `${BaseUrl}/subject/v1/createSubject`,
//       headers,
//       data: JSON.stringify(data)
//     });

//     if (res.data.responseCode === 201) {
//       Swal.fire("Success", res.data.message, "success");
//     } else if (res.data.responseCode === 400) {
//       Swal.fire("Error", res.data.errorMessage, "error");
//     }

//     return res;
//   } catch (error) {
//     Swal.fire("Error", error.message || "An error occurred", "error");
//     throw error;
//   }
// };

// Updated addsubject 
export const addSubject = async (data, headers) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/subject/v1/createSubject`,
      headers,
      data: JSON.stringify(data)
    });

    console.log("Add Subject Response:", res.data); // <-- ADD THIS

    if (res.data.responseCode === 201) {
      Swal.fire("Success", res.data.message, "success");
    } else if (res.data.responseCode === 400) {
      Swal.fire("Error", res.data.errorMessage, "error");
    }

    return res;
  } catch (error) {
    console.error("Add Subject Error:", error?.response?.data || error.message); // <-- ADD THIS
    Swal.fire("Error", error.message || "An error occurred", "error");
    throw error;
  }
};


// Get subject by ID
export const fetchSubjectById = async (subjectId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/subject/v1/getSubjectBySubjectId/{subjectId}?subjectId=${subjectId}`,
    headers
  });
};

// Update subject
export const updateSubject = async (data, headers) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${BaseUrl}/subject/v1/updateSubject`,
      headers,
      data
    });

    if (res.data.responseCode === 201) {
      Swal.fire("Updated", res.data.message, "success");
    } else if (res.data.responseCode === 400) {
      Swal.fire("Error", res.data.errorMessage, "error");
    }

    return res;
  } catch (error) {
    Swal.fire("Error", error.message || "An error occurred", "error");
    throw error;
  }
};

// Delete subject by ID
export const deleteSubject = async (id, headers) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/subject/v1/deleteSubjectById/${id}`,
      headers
    });

    if (res.data.responseCode === 200) {
      Swal.fire("Deleted", res.data.message, "success");
    } else if (res.data.responseCode === 400) {
      Swal.fire("Error", res.data.errorMessage, "error");
    }

    return res;
  } catch (err) {
    Swal.fire("Error", err.response?.data?.errorMessage || err.message, "error");
    throw err;
  }
};
