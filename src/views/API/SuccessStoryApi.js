import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from '../../BaseUrl';

// ✅ Fetch all success stories
export const fetchSuccess = async (headers) => {
  return await axios({
    method: 'get',
    url: `${BaseUrl}/success/v1/getAllSuccessStoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

// ✅ Get story by ID
export const getSuccessById = async (id, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/success/v1/getSuccessStoryById/{successstoryId}?successstoryId=${id}`,
    headers: headers
  });
};

// ✅ Update success story
export const updatedSuccess = async (updatedData, headers) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${BaseUrl}/success/v1/updateSuccessStory`,
      headers: headers,
      data: updatedData
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: res.data.message || 'Success story updated successfully',
      });
    } else if (res.data.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.data.errorMessage,
      });
    }

    return res;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to update success story',
    });
  }
};

// ✅ Delete success story
export const deleteSuccess = async (id, headers) => {
  try {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      const res = await axios({
        method: 'delete',
        url: `${BaseUrl}/success/v1/deleteSuccessStoryById/${id}`,
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
          title: 'Error!',
          text: res.data.errorMessage,
        });
      }

      return res.data;
    }

    return null;
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error deleting success story: ${err.message}`,
    });
    return null;
  }
};

// ✅ Add success story
export const addSuccess = async (data, headers) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/success/v1/createSuccessStory`,
      headers,
      data: data
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'Success story added successfully',
      });
    } else if (res.data.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.data.errorMessage,
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

// ✅ Count success stories
export const fetchSuccessCount = async (accessToken) => {
  const bannerUrl = `${BaseUrl}/success/v1/getAllSuccessStoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`;
  try {
    const response = await axios.get(bannerUrl, {
          headers: headers
    });

    return response.data.content;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error fetching success story count',
    });
    throw error;
  }
};
