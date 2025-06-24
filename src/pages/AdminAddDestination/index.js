import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminAddDestination.module.scss';
import StepBasicInfo from '~/components/StepBasicInfo';
import StepDetailRestaurant from '~/components/StepDetailRestaurant';
import StepDetailTourist from '~/components/StepDetailTourist';

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
};

function AdminAddDestination() {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState(initForm);
    const [detail, setDetail] = useState(initDetail);
    const [loading, setLoading] = useState(false);

    // Step 1 submit
    const handleSubmitStep1 = (data) => {
        setForm(data);
        setStep(2);
    };

    // Step 2 submit
    const handleSubmitStep2 = (data) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Thêm địa điểm thành công!');
            setForm(initForm);
            setDetail(initDetail);
            setStep(1);
        }, 1200);
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
                        />
                    ) : (
                        <StepDetailRestaurant
                            defaultData={detail}
                            onPrev={() => setStep(1)}
                            onSubmit={handleSubmitStep2}
                        />
                    ))}
            </div>
        </div>
    );
}

export default AdminAddDestination;
