import axios from 'axios';
import { BaseUrl } from 'BaseUrl';

export const fetchRoles = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/role/v1/getAllRoleByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=10`,
    headers: headers
  });
};
export const fetchAllRoles = async (headers) => {
  return await axios({
    method: 'GET',
    url: `${BaseUrl}/role/v1/getAllRoles`,
    headers: headers
  });
};
