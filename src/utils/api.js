import axios from './axios.custiomize';

//USER

const getAccountApi = () => {
    const URL_API = '/v1/api/account';
    return axios.get(URL_API);
};

const createUserApi = (fullName, email, password) => {
    const URL_API = '/v1/api/register';
    const data = { fullName, email, password };
    return axios.post(URL_API, data);
};

const loginApi = (email, password) => {
    const URL_API = 'v1/api/login';
    const data = { email, password };
    return axios.post(URL_API, data);
};

const getUsersApi = () => {
    const URL_API = '/v1/api/users';
    return axios.get(URL_API);
};

const deleteUserApi = (id) => {
    const URL_API = `/v1/api/users/${id}`;
    return axios.delete(URL_API);
};

const updateUserAdminApi = (userId, isAdmin) => {
    const URL_API = `/v1/api/users/${userId}/admin`;
    return axios.patch(URL_API, { isAdmin });
};

//TAG MANAGEMENT
const createTagApi = (title) => {
    const URL_API = '/v1/api/tag';
    return axios.post(URL_API, { title });
};

const getTagsApi = () => {
    const URL_API = '/v1/api/tags';
    return axios.get(URL_API);
};

const updateTagApi = (id, title) => {
    const URL_API = `/v1/api/tags/${id}`;
    return axios.put(URL_API, { title });
};

const deleteTagApi = (id) => {
    const URL_API = `/v1/api/tags/${id}`;
    return axios.delete(URL_API);
};

//CITY TYPE MANAGEMENT
const createCityTypeApi = (title) => {
    const URL_API = '/v1/api/cityType';
    const data = { title };
    return axios.post(URL_API, data);
};

const getCityTypesApi = () => {
    const URL_API = '/v1/api/cityTypes';
    return axios.get(URL_API);
};

const updateCityTypeApi = (id, title) => {
    const URL_API = `/v1/api/cityTypes/${id}`;
    const data = { title };
    return axios.put(URL_API, data);
};

const deleteCityTypeApi = (id) => {
    const URL_API = `/v1/api/cityTypes/${id}`;
    return axios.delete(URL_API);
};

export {
    createUserApi,
    getAccountApi,
    getUsersApi,
    deleteUserApi,
    loginApi,
    updateUserAdminApi,
    createTagApi,
    getTagsApi,
    updateTagApi,
    deleteTagApi,
    createCityTypeApi,
    getCityTypesApi,
    updateCityTypeApi,
    deleteCityTypeApi,
};
