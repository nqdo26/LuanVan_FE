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

//City MANAGEMENT
const createCityApi = (cityData) => {
    const URL_API = '/v1/api/city';
    const formData = new FormData();

    formData.append('title', cityData.title);
    formData.append('description', cityData.description);
    if (cityData.type && cityData.type.length > 0) {
        formData.append('type', JSON.stringify(cityData.type));
    }

    cityData.images.forEach((file) => {
        formData.append('images', file.originFileObj || file);
    });

    formData.append('weather', JSON.stringify(cityData.weather));

    if (cityData.info?.length > 0) {
        formData.append('info', JSON.stringify(cityData.info));
    }

    return axios.post(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getCitiesApi = () => {
    const URL_API = '/v1/api/cities';
    return axios.get(URL_API);
};

const getCityByIdApi = (id) => {
    const URL_API = `/v1/api/cities/${id}`;
    return axios.get(URL_API);
};

const getCityBySlugApi = (slug) => {
    const URL_API = `/v1/api/city/${slug}`;
    return axios.get(URL_API);
};

const getCityByIdAndUpdateApi = (id, cityData = null) => {
    const URL_API = `/v1/api/cities/${id}/edit`;

    if (!cityData) {
        return axios.get(URL_API);
    }

    const formData = new FormData();
    formData.append('title', cityData.title);
    formData.append('description', cityData.description);

    if (cityData.type && cityData.type.length > 0) {
        formData.append('type', JSON.stringify(cityData.type));
    }

    if (cityData.images && cityData.images.length > 0) {
        cityData.images.forEach((file) => {
            if (file.originFileObj) {
                formData.append('images', file.originFileObj);
            }
        });
    }

    formData.append('weather', JSON.stringify(cityData.weather));

    if (cityData.info?.length > 0) {
        formData.append('info', JSON.stringify(cityData.info));
    }

    return axios.put(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const updateCityApi = (id, cityData) => {
    const URL_API = `/v1/api/cities/${id}`;
    const formData = new FormData();

    formData.append('title', cityData.title);
    formData.append('description', cityData.description);
    if (cityData.type && cityData.type.length > 0) {
        formData.append('type', JSON.stringify(cityData.type));
    }

    if (cityData.images && cityData.images.length > 0) {
        cityData.images.forEach((file) => {
            formData.append('images', file.originFileObj || file);
        });
    }

    formData.append('weather', JSON.stringify(cityData.weather));

    if (cityData.info?.length > 0) {
        formData.append('info', JSON.stringify(cityData.info));
    }

    return axios.put(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const deleteCityApi = (id) => {
    const URL_API = `/v1/api/cities/${id}`;
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
    createCityApi,
    getCitiesApi,
    getCityByIdApi,
    getCityBySlugApi,
    getCityByIdAndUpdateApi,
    updateCityApi,
    deleteCityApi,
};
