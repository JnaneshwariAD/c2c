import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const addNews = async (data, headers) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/news/v1/createNews`,
      headers,
      data
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'News added successfully',
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

export const fetchNews = async (headers) => {
  return await axios({
    method: 'get',
    url: `${BaseUrl}/news/v1/getAllNewsByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const getNewsById = async (id, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/news/v1/getNewsById/{newsId}?newsId=${id}`,
    headers: headers
  });
};

export const updatedNews = async (updatedData, headers) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${BaseUrl}/news/v1/updateNews`,
      headers: headers,
      data: updatedData
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: res.data.message || 'News updated successfully',
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
      text: error.message || 'Failed to update news',
    });
  }
};

export const deleteNews = async (id, headers) => {
  try {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      const res = await axios({
        method: 'delete',
        url: `${BaseUrl}/news/v1/deleteNewsById/${id}`,
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
      text: `Error deleting news: ${err.message}`,
    });
    return null;
  }
};
