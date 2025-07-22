import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

export const fetchCategories = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/category/v1/getAllCategoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
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
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/category/v1/createCategory`,
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
    url: `${BaseUrl}/category/v1/updateCategory`,
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

export const deleteCategory = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/category/v1/deleteCategoryById/${id}`,
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

// subjects
export const fetchSubjects = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/subject/v1/getAllSubjectsByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};
export const fetchAllSubjects = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/subject/v1/getAllSubjects`,
    headers: headers
  });
};

export const addSubject = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/subject/v1/createSubject`,
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

export const fetchSubjectById = async (subjectId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/subject/v1/getSubjectBySubjectId/{subjectId}?subjectId=${subjectId}`,
    headers: headers
  });
};

export const updatedSubject = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/subject/v1/updateSubject`,
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

export const deleteSubject = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/subject/v1/deleteSubjectById/${id}`,
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

// Modules

export const fetchModules = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/module/v1/getAllModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const fetchAllModules = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/module/v1/getAllModuleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addModule = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/module/v1/createModule`,
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

export const fetchModuleById = async (subjectId, headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/module/v1/getModuleByModuleId/{moduleId}?moduleId=${subjectId}`,
    headers: headers
  });
};

export const updatedModule = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/module/v1/updateModule`,
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

export const deleteModule = async (id, headers) => {
  return await axios({
    method: 'delete',
    url: `${BaseUrl}/module/v1/deleteModuleById/${id}`,
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

export const fetchTopics = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/topic/v1/getAllTopicByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const addTopic = async (data, headers) => {
  try {
    return await axios({
      method: 'POST',
      url: `${BaseUrl}/topic/v1/createTopic`,
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
    url: `${BaseUrl}/topic/v1/getTopicById/{topicId}?topicId=${topicId}`,
    headers: headers
  });
};

export const updatedTopic = async (updatedData, headers) => {
  console.log(updatedData);
  return await axios({
    method: 'PUT',
    url: `${BaseUrl}/topic/v1/updateTopic`,
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
    url: `${BaseUrl}/topic/v1/deleteTopicById/${id}`,
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
