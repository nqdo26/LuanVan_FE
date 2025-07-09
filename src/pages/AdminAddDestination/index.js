import React, { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminAddDestination.module.scss';

import StepBasicInfo from '~/components/StepBasicInfo';
import { getTagsApi } from '~/utils/api';
import StepDetailRestaurant from '~/components/StepDetailRestaurant';
import StepDetailTourist from '~/components/StepDetailTourist';
import { createDestinationApi } from '~/utils/api';
import { notification } from 'antd';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);

const initForm = {
    title: '',
    aiDescription: '',
    type: 'restaurant',
    tags: [],
    address: '',
    city: 'hcm',
    phone: '',
    website: '',
    facebook: '',
    instagram: '',
};

const initDetail = {
    description: '',
    highlight: [],
    services: [],
    cultureType: [],
    activities: [],
    fee: [],
    usefulInfo: [],
    openHour: {
        mon: { open: '', close: '' },
        tue: { open: '', close: '' },
        wed: { open: '', close: '' },
        thu: { open: '', close: '' },
        fri: { open: '', close: '' },
        sat: { open: '', close: '' },
        sun: { open: '', close: '' },
        allday: false,
    },
    album: {
        space: [],
        fnb: [],
        extra: [],
    },
    createdBy: '',
};

function AdminAddDestination() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(initForm);
    const [detail, setDetail] = useState(initDetail);
    const [loading, setLoading] = useState(false);
    const [tagsList, setTagsList] = useState([]);

    const { auth, setAuth } = useContext(AuthContext);

    React.useEffect(() => {
        getTagsApi().then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                setTagsList(res.data);
            }
        });
    }, []);

    const handleSubmitStep1 = (data) => {
        setForm(data);
        setStep(2);
    };

    const handleSubmitStep2 = async (data) => {
        setLoading(true);
        try {
            const submitData = {
                ...form,
                ...data,
                createdBy: auth?.user?.email || '',
                openHour: data.openHour || form.openHour || undefined,
                contactInfo: {
                    phone: form.phone,
                    website: form.website,
                    facebook: form.facebook,
                    instagram: form.instagram,
                },
            };
            if (Array.isArray(form.tags) && form.tags.length > 0) {
                if (typeof form.tags[0] === 'object') {
                    submitData.tags = form.tags.map((t) => t._id);
                } else {
                    submitData.tags = form.tags
                        .map((title) => tagsList.find((t) => t.title === title)?._id)
                        .filter(Boolean);
                }
            }
            if (data.album) {
                submitData.album = {
                    space: data.album.space || [],
                    fnb: data.album.fnb || [],
                    extra: data.album.extra || [],
                };
            }
            delete submitData.newHighlight;
            delete submitData.newServices;
            delete submitData.newUsefulInfo;
            delete submitData.newActivities;
            delete submitData.newCultureType;
            delete submitData.newFee;
            const res = await createDestinationApi(submitData);
            if (res && res.data && res.EC === 0) {
                notification.success({
                    message: 'Thành công',
                    description: 'Thêm địa điểm thành công!',
                    duration: 2.5,
                });
                setForm(initForm);
                setDetail(initDetail);
                setStep(1);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: res?.data?.EM || 'Thêm địa điểm thất bại.',
                    duration: 2.5,
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra, vui lòng thử lại!',
                duration: 2.5,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <p className={cx('title')}>{step === 1 ? 'Thêm địa điểm mới' : 'Bổ sung thông tin địa điểm'}</p>
                {step === 1 && <StepBasicInfo defaultData={form} onNext={handleSubmitStep1} />}
                {step === 2 &&
                    (form.type === 'tourist' ? (
                        <StepDetailTourist
                            defaultData={detail}
                            onPrev={() => setStep(1)}
                            onSubmit={handleSubmitStep2}
                            loading={loading}
                        />
                    ) : (
                        <StepDetailRestaurant
                            defaultData={detail}
                            onPrev={() => setStep(1)}
                            onSubmit={handleSubmitStep2}
                            loading={loading}
                        />
                    ))}
            </div>
        </div>
    );
}

export default AdminAddDestination;
