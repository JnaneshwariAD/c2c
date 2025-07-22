import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from '../../BaseUrl';

// POST PROMO DATA
export const postPromoData = async (pdata, headers) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/promo/v1/createPromo`,
      headers: headers,
      data: JSON.stringify(pdata)
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'Promo added successfully',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: res.data.message || 'Failed to add promo',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An unexpected error occurred',
    });
  }
};

// GET PROMO DATA
export const fetchPromo = async (headers) => {
  try {
    const response = await axios.get(
      `${BaseUrl}/promo/v1/getAllPromoByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
      { headers }
    );
    return response.data;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to fetch promo data',
    });
    throw error;
  }
};

// GET PROMO BY ID
export const getPromoById = async (headers, id) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BaseUrl}/promo/v1/getPromoByPromoId/{promoId}?promoId=${id}`,
      headers: headers
    });
    return response;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to fetch promo details',
    });
    throw error;
  }
};

// UPDATE PROMO
export const updatedPromo = async (updateddata, headers) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${BaseUrl}/promo/v1/updatePromo`,
      headers,
      data: updateddata
    });

    if (response.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: response.data.message || 'Promo updated successfully',
      });
    } else if (response.data.responseCode === 400) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: response.data.errorMessage,
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Unexpected',
        text: 'Unexpected response code',
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to update promo',
    });
  }
};

// DELETE PROMO DATA
export const deletePromo = async (headers, id) => {
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
        method: 'DELETE',
        url: `${BaseUrl}/promo/v1/deletePromoById/${id}`,
        headers: headers
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
      text: `Error deleting promo: ${err.message}`,
    });
    return null;
  }
};
