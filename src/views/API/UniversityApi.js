import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';



export const fetchUniversities = async (headers) => {
  return await axios({
    method: 'get',
    url: `${BaseUrl}/university/v1/getAllUniversityByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};



export const getUniveristy_ById = async (id, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/university/v1/getUniversityById/${id}`,
    headers: headers
  });
};



export const addUniversity = async (data, headers) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/university/v1/createUniversity`,
      headers,
      data: data
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'University added successfully!',
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



export const updatedUniversity = async (updatedData, headers) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${BaseUrl}/university/v1/updateUniversity`,
      headers: headers,
      data: updatedData
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'University updated successfully!',
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

export const deleteUniversity = async (id, headers) => {
  try {
    const confirm = await Swal.fire({
      title: 'Delete University',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    });

    if (confirm.isConfirmed) {
      const res = await axios({
        method: 'DELETE',
        url: `${BaseUrl}/university/v1/deleteUniversityById/${id}`,
        headers
      });

      if (res.data.responseCode === 200) {
        Swal.fire('Deleted!', 'University removed successfully.', 'success');
        return true;
      }
      throw new Error(res.data.errorMessage || 'Deletion failed');
    }
    return false;
  } catch (error) {
    let message = 'Deletion failed';
    
    if (error.response?.data?.errorMessage?.includes('foreign key constraint')) {
      message = `
        This university cannot be deleted because:
        <ul style="text-align: left; margin: 10px 0 0 20px;">
          <li>• It's associated with branch records</li>
          <li>• It may be linked to user accounts</li>
        </ul>
        <p style="margin-top: 15px;">Please remove these associations first.</p>
      `;
    }

    Swal.fire({
      icon: 'error',
      title: 'Cannot Delete',
      html: message,
      confirmButtonColor: '#03045E'
    });
    return false;
  }
};