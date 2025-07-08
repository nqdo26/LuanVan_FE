import axios from './axios.custiomize';
const createDestinationApi = (destinationData) => {
    const URL_API = '/v1/api/destination';
    const formData = new FormData();

    formData.append('title', destinationData.title);
    formData.append('description', destinationData.description);
    if (destinationData.type) {
        formData.append('type', destinationData.type);
    }
    if (destinationData.tags && destinationData.tags.length > 0) {
        destinationData.tags.forEach((id) => formData.append('tags', id));
    }
    if (destinationData.city) {
        formData.append('city', destinationData.city);
    }
    if (destinationData.address) {
        formData.append('address', destinationData.address);
    }
    if (destinationData.images && destinationData.images.length > 0) {
        destinationData.images.forEach((file) => {
            formData.append('images', file.originFileObj || file);
        });
    }
    // Append detail fields (array fields as JSON string, new* as string)
    if (destinationData.highlight) {
        formData.append('highlight', JSON.stringify(destinationData.highlight));
    }
    if (destinationData.services) {
        formData.append('services', JSON.stringify(destinationData.services));
    }
    if (destinationData.cultureType) {
        formData.append('cultureType', JSON.stringify(destinationData.cultureType));
    }
    if (destinationData.activities) {
        formData.append('activities', JSON.stringify(destinationData.activities));
    }
    if (destinationData.fee) {
        formData.append('fee', JSON.stringify(destinationData.fee));
    }
    if (destinationData.usefulInfo) {
        formData.append('usefulInfo', JSON.stringify(destinationData.usefulInfo));
    }
    if (destinationData.newHighlight) {
        formData.append('newHighlight', destinationData.newHighlight);
    }
    if (destinationData.newServices) {
        formData.append('newServices', destinationData.newServices);
    }
    if (destinationData.newUsefulInfo) {
        formData.append('newUsefulInfo', destinationData.newUsefulInfo);
    }
    if (destinationData.newCultureType) {
        formData.append('newCultureType', destinationData.newCultureType);
    }
    if (destinationData.newActivities) {
        formData.append('newActivities', destinationData.newActivities);
    }
    if (destinationData.newFee) {
        formData.append('newFee', destinationData.newFee);
    }
    // Thêm album từng loại (space, fnb, extra)
    if (destinationData.album) {
        if (destinationData.album.space && destinationData.album.space.length > 0) {
            destinationData.album.space.forEach((file) => {
                formData.append('album_space', file.originFileObj || file);
            });
        }
        if (destinationData.album.fnb && destinationData.album.fnb.length > 0) {
            destinationData.album.fnb.forEach((file) => {
                formData.append('album_fnb', file.originFileObj || file);
            });
        }
        if (destinationData.album.extra && destinationData.album.extra.length > 0) {
            destinationData.album.extra.forEach((file) => {
                formData.append('album_extra', file.originFileObj || file);
            });
        }
    }
    if (destinationData.weather) {
        formData.append('weather', JSON.stringify(destinationData.weather));
    }
    if (destinationData.info && destinationData.info.length > 0) {
        formData.append('info', JSON.stringify(destinationData.info));
    }
    if (destinationData.contactInfo) {
        formData.append('contactInfo', JSON.stringify(destinationData.contactInfo));
    }
    return axios.post(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getDestinationsApi = () => {
    const URL_API = '/v1/api/destinations';
    return axios.get(URL_API);
};

const getDestinationByIdApi = (id) => {
    const URL_API = `/v1/api/destinations/${id}`;
    return axios.get(URL_API);
};

const getDestinationBySlugApi = (slug) => {
    const URL_API = `/v1/api/destination/${slug}`;
    return axios.get(URL_API);
};

const updateDestinationApi = (id, destinationData) => {
    const URL_API = `/v1/api/destinations/${id}`;
    const formData = new FormData();
    formData.append('title', destinationData.title);
    formData.append('description', destinationData.description);
    if (destinationData.type) {
        formData.append('type', destinationData.type);
    }
    if (destinationData.tags && destinationData.tags.length > 0) {
        formData.append('tags', JSON.stringify(destinationData.tags));
    }
    if (destinationData.city) {
        formData.append('city', destinationData.city);
    }
    if (destinationData.address) {
        formData.append('address', destinationData.address);
    }
    if (destinationData.images && destinationData.images.length > 0) {
        destinationData.images.forEach((file) => {
            formData.append('images', file.originFileObj || file);
        });
    }
    if (destinationData.weather) {
        formData.append('weather', JSON.stringify(destinationData.weather));
    }
    if (destinationData.info && destinationData.info.length > 0) {
        formData.append('info', JSON.stringify(destinationData.info));
    }
    if (destinationData.contactInfo) {
        formData.append('contactInfo', JSON.stringify(destinationData.contactInfo));
    }
    return axios.put(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const deleteDestinationApi = (id) => {
    const URL_API = `/v1/api/destinations/${id}`;
    return axios.delete(URL_API);
};

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

//DESTINATION TYPE MANAGEMENT
const createDestinationTypeApi = (title) => {
    const URL_API = '/v1/api/destinationType';
    const data = { title };
    return axios.post(URL_API, data);
};

const getDestinationTypesApi = () => {
    const URL_API = '/v1/api/destinationTypes';
    return axios.get(URL_API);
};

const updateDestinationTypeApi = (id, title) => {
    const URL_API = `/v1/api/destinationTypes/${id}`;
    const data = { title };
    return axios.put(URL_API, data);
};

const deleteDestinationTypeApi = (id) => {
    const URL_API = `/v1/api/destinationTypes/${id}`;
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
    createDestinationTypeApi,
    getDestinationTypesApi,
    updateDestinationTypeApi,
    deleteDestinationTypeApi,
    createCityApi,
    getCitiesApi,
    getCityByIdApi,
    getCityBySlugApi,
    getCityByIdAndUpdateApi,
    updateCityApi,
    deleteCityApi,
    createDestinationApi,
    getDestinationsApi,
    getDestinationByIdApi,
    getDestinationBySlugApi,
    updateDestinationApi,
    deleteDestinationApi,
};
