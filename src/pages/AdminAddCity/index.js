import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminAddCity.module.scss';
import AddCityForm from '~/components/AddCityForm';
import StepDetailCity from '~/components/StepDetailCity';
import { createCityApi } from '~/utils/api';
import { notification } from 'antd';

const cx = classNames.bind(styles);

function AdminAddCity() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        images: [],
        weather: [
            { title: 'THG 12 - THG 2', minTemp: '', maxTemp: '', note: '' },
            { title: 'THG 3 - THG 5', minTemp: '', maxTemp: '', note: '' },
            { title: 'THG 6 - THG 8', minTemp: '', maxTemp: '', note: '' },
            { title: 'THG 9 - THG 11', minTemp: '', maxTemp: '', note: '' },
        ],
        info: [],
    });
    const [loading, setLoading] = useState(false);

    const handleSubmitStep1 = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setStep(2);
    };

    const handleSubmitStep2 = async (detailData) => {
        const fullData = {
            title: formData.title,
            description: formData.description,
            type: formData.type,
            images: detailData.images,
            weather: detailData.weather,
            info: detailData.info,
        };

        setLoading(true);
        try {
            const res = await createCityApi(fullData);
            console.log('Response from createCityApi:', res);

            if (res && res?.EC === 0) {
                notification.success({
                    message: 'Success',
                    description: 'Thêm thành phố thành công!',
                    duration: 2.5,
                });
                setFormData({
                    title: '',
                    description: '',
                    type: '',
                    images: [],
                    weather: [
                        { title: 'THG 12 - THG 2', minTemp: '', maxTemp: '', note: '' },
                        { title: 'THG 3 - THG 5', minTemp: '', maxTemp: '', note: '' },
                        { title: 'THG 6 - THG 8', minTemp: '', maxTemp: '', note: '' },
                        { title: 'THG 9 - THG 11', minTemp: '', maxTemp: '', note: '' },
                    ],
                    info: [],
                });
                setStep(1);
            } else {
                notification.error({
                    message: 'Error',
                    description: res?.EM || 'Thêm thất bại.',
                    duration: 2.5,
                });
            }
        } catch (err) {
            notification.error({
                message: 'Error',
                description: 'Có lỗi xảy ra, vui lòng thử lại!',
                duration: 2.5,
            });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <p className={cx('title')}>
                    {step === 1 ? 'Thêm Thành Phố mới' : 'Bổ sung hình ảnh & thông tin chi tiết'}
                </p>
                {step === 1 && <AddCityForm defaultData={formData} onNext={handleSubmitStep1} />}
                {step === 2 && (
                    <StepDetailCity
                        defaultData={formData}
                        onPrev={() => setStep(1)}
                        onSubmit={handleSubmitStep2}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
}

export default AdminAddCity;
