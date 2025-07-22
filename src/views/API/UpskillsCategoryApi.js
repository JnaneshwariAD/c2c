import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

export const fetchUpSkillsCategories = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/upskillcategory/v1/getAllUpskillCategoryByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};
export const fetchUpSkillsCourses = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/upskillcourse/v1/getAllUpskillCoursesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};
export const fetchUpSkillsModules = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/upskillmodule/v1/getAllUpskillModulesByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};
export const fetchUpSkillsTopics = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/upskilltopic/v1/getAllUpskillTopicsByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};

export const fetchCategoryById = async (headers, categoryId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/upskillcategory/v1/getUpskillCategoryByCategoryId/{categoryId}?categoryId=${categoryId}`,
    headers: headers
  });
};

export const fetchCourseByCourseId = async (headers, courseId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/upskillcourse/v1/getUpskillCourseByCourseId/{courseId}?courseId=${courseId}`,
    headers: headers
  });
};
export const fetchModulesByCourseId = async (headers, courseId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/upskillmodule/v1/getUpskillModulesByCourseId/{courseId}?courseId=${courseId}`,
    headers: headers
  });
};
export const fetchTopicsBymoduleId = async (headers, moduleId) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/upskilltopic/v1/getUpskillTopicsByModuleId/{moduleId}?moduleId=${moduleId}`,
    headers: headers
  });
};
