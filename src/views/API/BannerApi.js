import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';

export const fetchBanner = async (headers) => {
  return await axios({
    method: 'get',
    url: `${BaseUrl}/advertisement/v1/getAllAdvertisementByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10000`,
    headers: headers
  });
};

export const addBanner = async (data, headers) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${BaseUrl}/advertisement/v1/createAdvertisement`,
      headers,
      data
    });

    if (response.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Advertisement added successfully!',
      });
    } else if (response.data.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data.errorMessage || 'Something went wrong',
      });
    }

    return response;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An unexpected error occurred',
    });
  }
};

export const deleteBanner = async (id, headers) => {
  try {
    // Confirm deletion
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      const response = await axios({
        method: 'delete',
        url: `${BaseUrl}/advertisement/v1/deleteAdvertisementById/${id}`,
        headers
      });

      if (response.data.responseCode === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: response.data.message,
        });
      } else if (response.data.responseCode === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: response.data.errorMessage,
        });
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Unexpected Response',
          text: 'Unexpected response code received.',
        });
      }

      return response.data;
    } else {
      return null; // Cancelled
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error deleting banner: ${error.message}`,
    });
    return null;
  }
};

export const getAdvertiseById = async (id, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/advertisement/v1/getAdvertisementByAdvertisementId/{advertisementId}?advertisementId=${id}`,
    headers: headers
  });
};

export const updatedAdvertise = async (updatedData, headers) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${BaseUrl}/advertisement/v1/updateAdvertisement`,
      headers: headers,
      data: updatedData
    });

    if (response.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message || 'Advertisement updated successfully!',
      });
    } else if (response.data.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data.errorMessage || 'Update failed',
      });
    }

    return response;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An unexpected error occurred',
    });
  }
};
