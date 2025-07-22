import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

export const fetchAcademyCategories = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccategory/v1/getAllAcademicCategoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addCategory = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/academiccategory/v1/createAcademicCategory`,
      headers,
      data: JSON.stringify(data)
    }).then(function (res) {
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};


export const updatedCategory = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/academiccategory/v1/updateAcademicCategory`,
    headers: headers,
    data: updatedData
  })
    .then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const fetchCategoryById = async (categoryId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccategory/v1/getAcademicCategoryByCategoryId/{categoryId}?categoryId=${categoryId}`,
    headers: headers
  });
};

//course
export const fetchAcademyCourses = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccourse/v1/getAllAcademicCoursesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addCourse = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/academiccourse/v1/createAcademicCourse`,
      headers,
      data: data
    }).then(function (res) {
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};


export const fetchCourseById = async (courseId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccourse/v1/getAcademicCourseByCourseId/{courseId}?courseId=${courseId}`,
    headers: headers
  });
};

export const updatedCourse = async (updatedData, headers) => {
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/academiccourse/v1/updateAcademicCourse`,
    headers: headers,
    data: updatedData
  })
    .then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const deleteCourse = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/academiccourse/v1/deleteAcademicCourseById/${id}`,
    headers
  })
    .then((res) => {
      if (res.data.responseCode === 200) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.errorMessage);
    });
};

//Modules 
export const fetchAcademyModules = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academicmodule/v1/getAllAcademicModulesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addModule = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/academicmodule/v1/createAcademicModule`,
      headers,
      data: JSON.stringify(data)
    }).then(function (res) {
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};
export const fetchModuleById = async (moduleId,headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academicmodule/v1/getAcademicModuleByModuleId/{moduleId}?moduleId=${moduleId}`,
    headers: headers
  });
};

export const updatedModule = async (updatedData, headers) => {
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/academicmodule/v1/updateAcademicModule`,
    headers: headers,
    data: updatedData
  })
    .then(function (res) {
      console.log(res.data);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const deleteModule = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/academicmodule/v1/deleteAcademicModuleById/${id}`,
    headers
  })
    .then((res) => {
      if (res.data.responseCode === 200) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.errorMessage);
    });
};


// Topics 
export const fetchAcademyTopics = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academictopic/v1/getAllAcademicTopicsByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addTopic = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/academictopic/v1/createAcademicTopic`,
      headers,
      data: data
    }).then(function (res) {
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    });
  } catch (error) {
    alert(error);
  }
};


export const fetchTopicById = async (topicId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academictopic/v1/getAcademicTopicByTopicId/{topicId}?topicId=${topicId}`,
    headers: headers
  });
};

export const updatedTopic = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/academictopic/v1/updateAcademicTopic`,
    headers: headers,
    data: updatedData
  })
    .then(function (res) {
      console.log(res);
      if (res.data.responseCode === 201) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const deleteTopic = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/academictopic/v1/deleteAcademicTopicById/${id}`,
    headers
  })
    .then((res) => {
      if (res.data.responseCode === 200) {
        alert(res.data.message);
      } else if (res.data.responseCode === 400) {
        alert(res.data.errorMessage);
      }
    })
    .catch((err) => {
      console.log(err);
      alert(err.response.data.errorMessage);
    });
};



export const fetchCourseByCategoryId = async (headers, categoryId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccourse/v1/getAcademicCoursesByCategoryId/{categoryId}?categoryId=${categoryId}`,
    headers: headers
  });
};

export const fetchCourseByCourseId = async (headers, courseId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academiccourse/v1/getAcademicCourseByCourseId/{courseId}?courseId=${courseId}`,
    headers: headers
  });
};

export const fetchModulesByCourseId = async (headers, courseId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academicmodule/v1/getAcademicModulesByCourseId/{courseId}?courseId=${courseId}`,
    headers: headers
  });
};
export const fetchTopicsBymoduleId = async (headers, moduleId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/academictopic/v1/getAcademicTopicsByModuleId/{moduleId}?moduleId=${moduleId}`,
    headers: headers
  });
};
