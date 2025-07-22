import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';



export const fetchCollege = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/college/v1/getAllCollegesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};



export const fetchAllUniversities = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/university/v1/getAllUniversitys`,
    headers: headers
  });
};



export const fetchAllColleges = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/college/v1/getAllColleges`,
    headers: headers
  });
};



export const addCollege = async (data, headers) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/college/v1/createCollege`,
      headers,
      data: data
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'College added successfully!',
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


export const fetchCollegeById = async (collegeId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/college/v1/getCollegeByCollegeId/${collegeId}`,
    headers: headers
  });
};



export const updatedCollege = async (updatedData, headers) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${BaseUrl}/college/v1/updateCollege`,
      headers: headers,
      data: updatedData
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'College updated successfully!',
      });
    } else if (res.data.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.data.errorMessage || 'Update failed',
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



export const deleteCollege = async (id, headers) => {
  try {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      const res = await axios({
        method: 'DELETE',
        url: `${BaseUrl}/college/v1/deleteCollegeById/${id}`,
        headers
      });

      if (res.data.responseCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: res.data.message,
        });
      } else if (res.data.responseCode === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: res.data.errorMessage,
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Unexpected Response',
          text: 'Unexpected response code received.',
        });
      }

      return res.data;
    } else {
      return null;
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error deleting college: ${error.message}`,
    });
    return null;
  }
};
