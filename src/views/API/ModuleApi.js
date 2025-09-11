// import axios from "axios";
// import Swal from "sweetalert2";
// import { BaseUrl } from "BaseUrl";

// // Fetch paginated modules
// export const fetchModules = async (headers) => {
//   return await axios({
//     method: 'GET',
//     url: `${BaseUrl}/module/v1/getAllModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=100`,
//     headers: headers
//   });
// };

// // Fetch all modules
// export const fetchAllModules = async (headers) => {
//   return await axios({
//     method: 'GET',
//     url: `${BaseUrl}/module/v1/queryAllModules`,
//     headers: headers
//   });
// };


//  export const fetchAllCourses = async (headers) => {
//     return await axios({
//       method: 'GET',
//       url: `${BaseUrl}/course/v1/queryAllCourses`,
//       headers: headers
//     }); 
//   };


// // Add new module
//  export const addModule = async (data, headers) => {
//   try {
//     const res = await axios({
//       method: 'POST',
//       url: `${BaseUrl}/module/v1/createModule`,
//       headers: {
//         ...headers,
//         'Content-Type': 'application/json'
//       },
//       data: JSON.stringify(data)
//     });

//     if (res.data.responseCode === 201) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Success',
//         text: res.data.message,
//         confirmButtonColor: '#03045E'
//       });
//       return res.data; // Return the response data
//     } else {
//       throw new Error(res.data.errorMessage || 'Failed to add module');
//     }
//   } catch (error) {
//     console.error('Error in addModule:', error);
//     Swal.fire({
//       icon: 'error',
//       title: 'Error',
//       text: error.response?.data?.errorMessage || error.message || 'An error occurred',
//       confirmButtonColor: '#03045E'
//     });
//     throw error; // Re-throw the error to be caught in postData
//   }
// };

// // Fetch module by ID
// export const fetchModuleById = async (moduleId, headers) => {
//   return await axios({
//     method: 'GET',
//     url: `${BaseUrl}/module/v1/getModuleByModuleId/{moduleId}?moduleId=${moduleId}`,
//     headers: headers
//   });
// };

// // Update module ------------------------------
// // export const updatedModule = async (updatedData, headers) => {
// //   try {
// //     const res = await axios({
// //       method: 'PUT',
// //       url: `${BaseUrl}/module/v1/updateModule`,
// //       headers: headers,
// //       data: updatedData
// //     });

// //     return res;                                       

// //     if (res.data.responseCode === 201) {
// //       Swal.fire("Updated", res.data.message, "success");
// //     } else if (res.data.responseCode === 400) {
// //       Swal.fire("Error", res.data.errorMessage, "error");
// //     }

// //   } catch (error) {
// //     Swal.fire("Error", error.message || "An error occurred", "error");
// //   }
// // };

// // export const updatedModule = async (updatedData, headers) => {
// //   try {
// //     const res = await axios.put(`${BaseUrl}/module/v1/updateModule`, updatedData, {
// //       headers
// //     });
// //     console.log('API Response:', res.data);

// //     // Optional: handle feedback here, or in the calling function
// //     if (res.data.responseCode === 201) {
// //       console.log("Update Success:", res.data.message);
// //     } else if (res.data.responseCode === 400) {
// //       console.warn("Update Error:", res.data.errorMessage);
// //     }

// //     return res; // Return the result to the calling function

// //   } catch (error) {
// //     console.error("Update failed:", error.response?.data || error.message);
// //     throw error; // Important: rethrow so calling function can handle it
// //   }
// // }; ------------------

// export const updatedModule = async (updatedData, headers) => {
//   try {
//     const res = await axios.put(`${BaseUrl}/module/v1/updateModule`, updatedData, {
//       headers
//     });
//     console.log('API Response:', res.data);

//     // Optional: handle feedback here, or in the calling function
//     if (res.data.responseCode === 201) {
//       console.log("Update Success:", res.data.message);
//     } else if (res.data.responseCode === 400) {
//       console.warn("Update Error:", res.data.errorMessage);
//     }

//     return res; // Return the result to the calling function

//   } catch (error) {
//     console.error("Update failed:", error.response?.data || error.message);
//     throw error; // Important: rethrow so calling function can handle it
//   }
// };

// // Delete module
// export const deleteModule = async (id, headers) => {
//   try {
//     const res = await axios({
//       method: 'DELETE',
//       url: `${BaseUrl}/module/v1/deleteModuleById/${id}`,
//       headers
//     });

//     if (res.data.responseCode === 200) {
//       Swal.fire("Deleted", res.data.message, "success");
//     } else if (res.data.responseCode === 400) {
//       Swal.fire("Error", res.data.errorMessage, "error");
//     }

//   } catch (err) {
//     Swal.fire("Error", err.response?.data?.errorMessage || err.message, "error");
//   }
// };




import axios from "axios";
import Swal from "sweetalert2";
import { BaseUrl } from "BaseUrl";

// Fetch paginated modules
export const fetchModules = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/module/v1/getAllModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=100`,
    headers: headers
  });
};  

// Fetch all modules
export const fetchAllModules = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/module/v1/queryAllModules`,
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

// Add new module
export const addModule = async (data, headers) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    const payload = {
      moduleName: data.moduleName,
      description: data.description,
      fileName: data.fileName,
      filePath: data.filePath,
      subjectDtoList: data.subjectDtoList,
      createdBy: {
        userId: user.userId,
        userName: user.userName,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber || ""
      }
    };

    const res = await axios({
      method: 'POST',
      url: `${BaseUrl}/module/v1/createModule`,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(payload)
    });

    if (res.data.responseCode === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: res.data.message,
        confirmButtonColor: '#03045E'
      });
      return res.data;
    } else {
      throw new Error(res.data.errorMessage || 'Failed to add module');
    }
  } catch (error) {
    console.error('Error in addModule:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.errorMessage || error.message || 'An error occurred',
      confirmButtonColor: '#03045E'
    });
    throw error;
  }
};

// Fetch module by ID
export const fetchModuleById = async (moduleId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/module/v1/getModuleByModuleId/{moduleId}?moduleId=${moduleId}`,
    headers: headers
  });
};

// Update module
export const updatedModule = async (moduleId, updatedData, headers) => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    const payload = {
      moduleId: moduleId,
      moduleName: updatedData.moduleName,
      description: updatedData.description,
      fileName: updatedData.fileName,
      filePath: updatedData.filePath,
      subjectDtoList: updatedData.subjectDtoList,
      updatedBy: {
        userId: user.userId,
        userName: user.userName,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber || ""
      }
    };

    const res = await axios.put(`${BaseUrl}/module/v1/updateModule`, payload, {
      headers
    });
    
    console.log('API Response:', res.data);

    if (res.data.responseCode === 201) {
      console.log("Update Success:", res.data.message);
    } else if (res.data.responseCode === 400) {
      console.warn("Update Error:", res.data.errorMessage);
    }

    return res;

  } catch (error) {
    console.error("Update failed:", error.response?.data || error.message);
    throw error;
  }
};

// Delete module
export const deleteModule = async (id, headers) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `${BaseUrl}/module/v1/deleteModuleById/${id}`,
      headers
    });

    if (res.data.responseCode === 200) {
      Swal.fire("Deleted", res.data.message, "success");
    } else if (res.data.responseCode === 400) {
      Swal.fire("Error", res.data.errorMessage, "error");
    }

  } catch (err) {
    Swal.fire("Error", err.response?.data?.errorMessage || err.message, "error");
  }
};