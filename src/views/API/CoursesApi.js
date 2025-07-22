import axios from "axios";
import { BaseUrl } from "BaseUrl";
import Swal from 'sweetalert2';


// Fetch paginated courses
export const fetchCourses = async (headers) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/course/v1/getAllCourseByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
      headers: headers
    }); 
  };

  // Fetch all courses
  export const fetchAllCourses = async (headers) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/course/v1/queryAllCourses`,
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


    export const fetchAllCategories = async (headers) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/category/v1/queryAllCategory`,
      headers: headers
    });
  };


     export const fetchAllBranches = async (headers) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/branch/v1/queryAllBranchs`,
      headers: headers
    });
  };

  // Add new course
  export const addCourse = async (data, headers) => {
    try {
      const res = await axios({
        method: 'POST',
        url: `${BaseUrl}/category/v1/createCourse`,
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
  
// export const addCourse = async (data, headers) => {
//     return await axios({
//       method: 'POST',
//       url: `${BaseUrl}/course/v1/createCourse`,
//       data,
//       headers: headers
//     }); 
//   };

// export const addCourse = async (data, headers) => {
//   try {
//     const response = await axios.post(
//       `${BaseUrl}/course/v1/createCourse`,
//       data,
//       { headers: { ...headers, 'Content-Type': 'application/json' } }
//     );

//     if (response.data.responseCode === 201) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: response.data.message,
//         confirmButtonColor: '#03045E'
//       });
//       return response.data;
//     } else {
//       throw new Error(response.data.errorMessage || 'Failed to add course');
//     }

//   } catch (error) {
//     console.error('Error in addCourse:', {
//       error: error.message,
//       response: error.response?.data,
//       config: error.config
//     });

//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: error.response?.data?.message || 
//            'Failed to create course. Please check all required fields.',
//       confirmButtonColor: '#03045E'
//     });
//     throw error;
//   }
// };

 

// export const addCourse = async (data, headers) => {
//   try {
//     const response = await 
//     axios.post(`${BaseUrl}/course/v1/createCourse`,
//        data, { headers }); // FIXED
//     console.log(response.data)
    
//     return response.data;
//   } catch (error) {
//     console.error('API Error Details:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       headers: error.response?.headers
//     });
//     throw error;
//   }
// };



  export const fetchCourseById = async (courseId, headers) => {
    return await axios({
      method: 'GET',
      url: `${BaseUrl}/course/v1/getCourseByCourseId/{courseId}?courseId=${courseId}`,
      headers: headers
    });
  };
  
 

  export const updatedCourse = async (updatedData, headers) => {
  try {
    const res = await axios({
      method: 'PUT',
      url: `${BaseUrl}/course/v1/updateCourse`,
      headers: headers,
      data: updatedData
    });
    return res;
  } catch (error) {
    console.error('Update course error:', error);
    throw error;
  }
};

export const deleteCourse = async (id, headers) => {
  return await axios({
    method: 'DELETE',
    url: `${BaseUrl}/course/v1/deleteCourseById/${id}`,
    headers
  });
};

