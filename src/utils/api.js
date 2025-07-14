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
    if (destinationData.openHour) {
        formData.append('openHour', JSON.stringify(destinationData.openHour));
    }
    if (destinationData.createdBy) {
        formData.append('createdBy', destinationData.createdBy);
    }
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

const getDestinationsApi = (params = {}) => {
    const URL_API = '/v1/api/destinations';
    return axios.get(URL_API, { params });
};

const searchDestinationsApi = (query, params = {}) => {
    const URL_API = '/v1/api/destinations/search';
    return axios.get(URL_API, {
        params: {
            q: query,
            ...params,
        },
    });
};

const getDestinationByIdApi = (id) => {
    const URL_API = `/v1/api/destinations/${id}`;
    return axios.get(URL_API);
};

const getDestinationBySlugApi = (slug) => {
    const URL_API = `/v1/api/destination/${slug}`;
    return axios.get(URL_API);
};

const getDestinationToEditApi = (id) => {
    const URL_API = `/v1/api/destinations/${id}/edit`;
    return axios.get(URL_API);
};

const updateDestinationToEditApi = (id, destinationData) => {
    const URL_API = `/v1/api/destinations/${id}/edit`;
    const formData = new FormData();

    formData.append('title', destinationData.title || '');
    formData.append('type', destinationData.type || '');
    formData.append('address', destinationData.address || '');
    formData.append('city', destinationData.city || '');
    formData.append('createdBy', destinationData.createdBy || '');

    destinationData.tags?.forEach((tagId) => {
        formData.append('tags', tagId);
    });

    formData.append('contactInfo', JSON.stringify(destinationData.contactInfo || {}));
    formData.append('openHour', JSON.stringify(destinationData.openHour || {}));
    formData.append('details', JSON.stringify(destinationData.details || {}));

    if (destinationData.album) {
        const processAlbumField = (fieldName, files) => {
            const existingImages = [];
            const newFiles = [];

            if (files && files.length > 0) {
                files.forEach((file) => {
                    if (typeof file === 'string') {
                        existingImages.push(file);
                    } else {
                        newFiles.push(file);
                    }
                });
            }

            if (existingImages.length > 0) {
                formData.append(`existing_${fieldName}`, JSON.stringify(existingImages));
            }

            newFiles.forEach((file) => {
                formData.append(fieldName, file.originFileObj || file);
            });
        };

        processAlbumField('album_space', destinationData.album.space);
        processAlbumField('album_fnb', destinationData.album.fnb);
        processAlbumField('album_extra', destinationData.album.extra);

        if (destinationData.album.highlight) {
            processAlbumField('images', destinationData.album.highlight);
        }
    }

    return axios.put(URL_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

const deleteDestinationApi = (id) => {
    const URL_API = `/v1/api/destinations/${id}`;
    return axios.delete(URL_API);
};

const getAccountApi = () => {
    const URL_API = '/v1/api/account';
    return axios.get(URL_API);
};

const getUserByIdApi = (id) => {
    const URL_API = `/v1/api/users/${id}`;
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

const getPopularDestinationsApi = () => {
    return axios.get('/v1/api/destinations/popular');
};

const deleteDestinationTypeApi = (id) => {
    const URL_API = `/v1/api/destinationTypes/${id}`;
    return axios.delete(URL_API);
};

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

    // Xử lý ảnh - phân loại ảnh cũ (URL string) và ảnh mới (File object)
    if (cityData.images && cityData.images.length > 0) {
        const existingImages = [];
        const newFiles = [];

        cityData.images.forEach((image) => {
            if (image.url && !image.originFileObj) {
                // Ảnh cũ (có URL, không có originFileObj)
                existingImages.push(image.url);
            } else if (image.originFileObj) {
                // Ảnh mới (có originFileObj)
                newFiles.push(image);
            }
        });

        // Gửi danh sách ảnh cũ còn lại
        if (existingImages.length > 0) {
            formData.append('existing_images', JSON.stringify(existingImages));
        }

        // Gửi ảnh mới
        newFiles.forEach((file) => {
            formData.append('images', file.originFileObj);
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

    // Xử lý ảnh - phân loại ảnh cũ (URL string) và ảnh mới (File object)
    if (cityData.images && cityData.images.length > 0) {
        const existingImages = [];
        const newFiles = [];

        cityData.images.forEach((image) => {
            if (typeof image === 'string') {
                // Ảnh cũ (URL)
                existingImages.push(image);
            } else {
                // Ảnh mới (File object)
                newFiles.push(image);
            }
        });

        // Gửi danh sách ảnh cũ còn lại
        if (existingImages.length > 0) {
            formData.append('existing_images', JSON.stringify(existingImages));
        }

        // Gửi ảnh mới
        newFiles.forEach((file) => {
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

const getCityDeletionInfoApi = (id) => {
    const URL_API = `/v1/api/cities/${id}/deletion-info`;
    return axios.get(URL_API);
};

const getCitiesWithDestinationCountApi = () => {
    const URL_API = '/v1/api/cities-with-count';
    return axios.get(URL_API);
};

// Tour APIs
const createTourApi = (tourData) => {
    const URL_API = '/v1/api/tours';
    return axios.post(URL_API, tourData);
};

const getToursApi = (params = {}) => {
    const URL_API = '/v1/api/tours';
    return axios.get(URL_API, { params });
};

const getPublicToursApi = (params = {}) => {
    const URL_API = '/v1/api/tours/public';
    return axios.get(URL_API, { params });
};

const getTourByIdApi = (id) => {
    const URL_API = `/v1/api/tours/${id}`;
    return axios.get(URL_API);
};

const getTourBySlugApi = (slug) => {
    const URL_API = `/v1/api/tours/slug/${slug}`;
    return axios.get(URL_API);
};

const updateTourApi = (id, tourData) => {
    const URL_API = `/v1/api/tours/${id}`;
    return axios.put(URL_API, tourData);
};

const deleteTourApi = (id) => {
    const URL_API = `/v1/api/tours/${id}`;
    return axios.delete(URL_API);
};

// Tour itinerary management APIs
const addDestinationToTourApi = (tourId, destinationData) => {
    const URL_API = `/v1/api/tours/${tourId}/destinations`;
    return axios.post(URL_API, destinationData);
};

const addNoteToTourApi = (tourId, noteData) => {
    const URL_API = `/v1/api/tours/${tourId}/notes`;
    return axios.post(URL_API, noteData);
};

const updateDestinationInTourApi = (tourId, updateData) => {
    const URL_API = `/v1/api/tours/${tourId}/destinations`;
    return axios.put(URL_API, updateData);
};

const removeDestinationFromTourApi = (tourId, removeData) => {
    const URL_API = `/v1/api/tours/${tourId}/destinations`;
    return axios.delete(URL_API, { data: removeData });
};

const removeNoteFromTourApi = (tourId, removeData) => {
    const URL_API = `/v1/api/tours/${tourId}/notes`;
    return axios.delete(URL_API, { data: removeData });
};

const getDestinationsByTagsApi = (tagIds, cityId = null, limit = 20) => {
    const URL_API = '/v1/api/destinations/by-tags';
    const params = new URLSearchParams();

    // Convert tagIds to JSON string if it's an array
    if (Array.isArray(tagIds)) {
        params.append('tags', JSON.stringify(tagIds));
    } else {
        params.append('tags', tagIds);
    }

    if (cityId) {
        params.append('cityId', cityId);
    }

    params.append('limit', limit.toString());

    return axios.get(`${URL_API}?${params.toString()}`);
};

const getDestinationsByCityApi = (citySlug, params = {}) => {
    const URL_API = `/v1/api/destinations/city/${citySlug}`;
    return axios.get(URL_API, { params });
};

const incrementCityViewsApi = (id) => {
    const URL_API = `/v1/api/cities/${id}/views`;
    return axios.patch(URL_API);
};

const incrementDestinationViewsApi = (id) => {
    const URL_API = `/v1/api/destinations/${id}/views`;
    return axios.patch(URL_API);
};

const getUserToursApi = (page = 1, limit = 10) => {
    const URL_API = `/v1/api/tours/user?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

// Favorites APIs
const addToFavoritesApi = (destinationId) => {
    const URL_API = '/v1/api/favorites';
    return axios.post(URL_API, { destinationId });
};

const removeFromFavoritesApi = (destinationId) => {
    const URL_API = `/v1/api/favorites/${destinationId}`;
    return axios.delete(URL_API);
};

const getUserFavoritesApi = () => {
    const URL_API = '/v1/api/favorites';
    return axios.get(URL_API);
};

// Comments APIs
const createCommentApi = (commentData) => {
    const URL_API = '/v1/api/comments';
    const formData = new FormData();

    formData.append('destinationId', commentData.destinationId);
    formData.append('title', commentData.title);
    formData.append('content', commentData.content);
    formData.append('detail', JSON.stringify(commentData.detail));

    if (commentData.visitDate) {
        formData.append('visitDate', commentData.visitDate);
    }

    if (commentData.images && commentData.images.length > 0) {
        commentData.images.forEach((file) => {
            formData.append('images', file.originFileObj || file);
        });
    }

    return axios.post(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getCommentsByDestinationApi = (destinationId, page = 1, limit = 10) => {
    const URL_API = `/v1/api/comments/destination/${destinationId}?page=${page}&limit=${limit}`;
    return axios.get(URL_API);
};

const deleteCommentApi = (commentId) => {
    const URL_API = `/v1/api/comments/${commentId}`;
    return axios.delete(URL_API);
};

const getCommentByIdApi = (commentId) => {
    const URL_API = `/v1/api/comments/${commentId}`;
    return axios.get(URL_API);
};

const filterDestinationsApi = (params = {}) => {
    const URL_API = '/v1/api/destinations/filter';
    return axios.get(URL_API, { params });
};

export {
    createUserApi,
    getAccountApi,
    getUserByIdApi,
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
    searchDestinationsApi,
    getDestinationByIdApi,
    getDestinationBySlugApi,
    deleteDestinationApi,
    getDestinationToEditApi,
    updateDestinationToEditApi,
    getDestinationsByCityApi,
    incrementDestinationViewsApi,
    getCityDeletionInfoApi,
    incrementCityViewsApi,
    getCitiesWithDestinationCountApi,
    getPopularDestinationsApi,
    getDestinationsByTagsApi,
    filterDestinationsApi,
    // Tour APIs
    createTourApi,
    getToursApi,
    getPublicToursApi,
    getTourByIdApi,
    getTourBySlugApi,
    updateTourApi,
    deleteTourApi,
    // Tour itinerary management APIs
    addDestinationToTourApi,
    addNoteToTourApi,
    updateDestinationInTourApi,
    removeDestinationFromTourApi,
    removeNoteFromTourApi,
    getUserToursApi,
    // Favorites APIs
    addToFavoritesApi,
    removeFromFavoritesApi,
    getUserFavoritesApi,
    // Comments APIs
    createCommentApi,
    getCommentsByDestinationApi,
    deleteCommentApi,
    getCommentByIdApi,
};
