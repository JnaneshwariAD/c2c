import axios from 'axios';
import Swal from 'sweetalert2';
import { BaseUrl } from 'BaseUrl';




export const fetchCategories = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/category/v1/getAllCategoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=100`,
    headers: headers
  });
};



export const fetchAllCategories = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/category/v1/queryAllCategory`,
    headers: headers
  });
};



export const fetchCategoryById = async (categoryId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/category/v1/getCategoryByCategoryId/{categoryId}?categoryId=${categoryId}`,
    headers: headers
  });
};



export const addCategory = async (data, headers) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/category/v1/createCategory`,
      headers,
      data: JSON.stringify(data)
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'Category added successfully!',
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



export const updatedCategory = async (updatedData, headers) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${BaseUrl}/category/v1/updateCategory`,
      headers: headers,
      data: updatedData
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message || 'Category updated successfully!',
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



export const deleteCategory = async (id, headers) => {
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
        url: `${BaseUrl}/category/v1/deleteCategoryById/${id}`,
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
      text: `Error deleting category: ${error.message}`,
    });
    return null;
  }
};
