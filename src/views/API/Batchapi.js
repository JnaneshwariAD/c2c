import axios from "axios";
import { BaseUrl } from "BaseUrl";
import Swal from 'sweetalert2';

export const fetchBatches = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/batch/v1/getAllBatchByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
}

export const fetchBatchById = async (batchId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/batch/v1/getBatchByBatchId/{batchId}?batchId=${batchId}`,
    headers: headers
  });
};


 export const fetchAllCourses = async (headers) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/course/v1/queryAllCourses`,
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




export const updatedBatch = async (updatedData, headers) => {
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/batch/v1/updateBatch`,
    headers: headers,
    data: updatedData
  })
    .then((res) => {
      console.log(res);
      if (res.data.responseCode === 201) {
        Swal.fire('Success', res.data.message, 'success');
      } else if (res.data.responseCode === 400) {
        Swal.fire('Error', res.data.errorMessage, 'error');
      }
    })
    .catch((error) => {
      console.log(error);
      Swal.fire('Error', error.message || 'Something went wrong', 'error');
    });
};

export const addBatch = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/batch/v1/createBatch`,
      headers,
      data: JSON.stringify(data)
    }).then((res) => {
      if (res.data.responseCode === 201) {
        Swal.fire('Success', res.data.message, 'success');
      } else if (res.data.responseCode === 400) {
        Swal.fire('Error', res.data.errorMessage, 'error');
      }
    });
  } catch (error) {
    Swal.fire('Error', error.message || 'Something went wrong', 'error');
  }
};

export const deleteBatch = async (id, headers) => {
  return await axios({
    method: 'DELETE',
    url: `${BaseUrl}/batch/v1/deleteBatchById/${id}`,
    headers
  })
    .then((res) => {
      if (res.data.responseCode === 200) {
        Swal.fire('Deleted', res.data.message, 'success');
      } else if (res.data.responseCode === 400) {
        Swal.fire('Error', res.data.errorMessage, 'error');
      }
    })
    .catch((err) => {
      console.log(err);
      Swal.fire('Error', err.response?.data?.errorMessage || 'Something went wrong', 'error');
    });
};
