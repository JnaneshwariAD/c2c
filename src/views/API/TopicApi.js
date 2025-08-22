import axios from "axios";
import { BaseUrl } from "BaseUrl";
import Swal from "sweetalert2";

export const fetchTopics = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/topic/v1/getAllTopicByPagination/{pageNumber}/{pageSize}?pageNumber=0&pageSize=100`,
        headers: headers
    });
};

export const addTopic = async (data, headers) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${BaseUrl}/topic/v1/createTopic`,
            headers,
            data: data
        });

        if (res.data.responseCode === 201) {
            Swal.fire('Success', res.data.message, 'success');
        } else if (res.data.responseCode === 400) {
            Swal.fire('Error', res.data.errorMessage, 'error');
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Something went wrong', 'error');
    }
};

export const fetchTopicById = async (topicId, headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/topic/v1/getTopicById/{topicId}?topicId=${topicId}`,
        headers: headers
    });
};

export const fetchAllModules = async (headers) => {
    return await axios({
        method: 'GET',
        url: `${BaseUrl}/module/v1/queryAllModules`,
        headers: headers
    });
};

export const updatedTopic = async (updatedData, headers) => {
    console.log(updatedData);
    try {
        const res = await axios({
            method: 'PUT',
            url: `${BaseUrl}/topic/v1/updateTopic`,
            headers: headers,
            data: updatedData
        });

        console.log(res);
        if (res.data.responseCode === 201) {
            Swal.fire('Success', res.data.message, 'success');
        } else if (res.data.responseCode === 400) {
            Swal.fire('Error', res.data.errorMessage, 'error');
        }
    } catch (error) {
        console.log(error);
        Swal.fire('Error', error.message || 'Update failed', 'error');
    }
};

export const deleteTopic = async (id, headers) => {
    try {
        const res = await axios({
            method: 'DELETE',
            url: `${BaseUrl}/topic/v1/deleteTopicById/${id}`,
            headers
        });

        if (res.data.responseCode === 200) {
            Swal.fire('Deleted', res.data.message, 'success');
        } else if (res.data.responseCode === 400) {
            Swal.fire('Error', res.data.errorMessage, 'error');
        }
    } catch (err) {
        console.log(err);
        Swal.fire('Error', err.response?.data?.errorMessage || 'Delete failed', 'error');
    }
};
