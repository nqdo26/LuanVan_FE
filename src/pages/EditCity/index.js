import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notification, Spin } from 'antd';
import classNames from 'classnames/bind';
import styles from './EditCity.module.scss';
import CityEditForm from '~/components/CityEditForm';
import { getCityByIdAndUpdateApi } from '~/utils/api';

const cx = classNames.bind(styles);

function EditCity() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cityData, setCityData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchCityData();
    }, [id]);

    const fetchCityData = async () => {
        try {
            setLoading(true);

            const response = await getCityByIdAndUpdateApi(id);

            if (response && response.EC === 0) {
                const city = response.data;

                const formData = {
                    title: city.name,
                    description: city.description,
                    type: city.type?.map((t) => t._id) || [],
                    images:
                        city.images?.map((img, index) => ({
                            uid: index,
                            name: `image-${index}`,
                            status: 'done',
                            url: img,
                        })) || [],
                    weather: city.weather || [],
                    info: city.info || [],
                };

                setCityData(formData);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải thông tin thành phố',
                });
                navigate('/admin/citys-management');
            }
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi tải thông tin thành phố',
            });
            navigate('/admin/citys-management');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            setSubmitting(true);

            const response = await getCityByIdAndUpdateApi(id, formData);

            if (response && response.EC === 0) {
                notification.success({
                    message: 'Thành công',
                    description: 'Cập nhật thành phố thành công!',
                });
                navigate('/admin/citys-management');
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: response?.data?.EM || 'Cập nhật thành phố thất bại',
                });
            }
        } catch (error) {
            console.error('Error updating city:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi cập nhật thành phố',
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <h1 className={cx('title')}>Chỉnh sửa thông tin thành phố</h1>
                {cityData && <CityEditForm defaultData={cityData} onSubmit={handleSubmit} loading={submitting} />}
            </div>
        </div>
    );
}

export default EditCity;
