import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './EditDestination.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { getDestinationToEditApi, updateDestinationToEditApi } from '~/utils/api';
import { message } from 'antd';
import DestinationEditForm from '~/components/DestinationEditForm';

const cx = classNames.bind(styles);

function EditDestination() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [defaultData, setDefaultData] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        getDestinationToEditApi(id)
            .then((res) => {
                if (res && res.EC === 0) {
                    const d = res.data;
                    setDefaultData({
                        form: {
                            title: d.title,
                            aiDescription: '',
                            type: d.type,
                            tags: d.tags.map((t) => ({ title: t.title, _id: t._id })),
                            address: d.location?.address || '',
                            city: d.location?.city?._id || '',
                            phone: d.contactInfo?.phone || '',
                            website: d.contactInfo?.website || '',
                            facebook: d.contactInfo?.facebook || '',
                            instagram: d.contactInfo?.instagram || '',
                            createdBy: d.createdBy || '',
                        },
                        detail: {
                            description: d.details?.description || '',
                            highlight: d.details?.highlight || [],
                            services: d.details?.services || [],
                            cultureType: d.details?.cultureType || [],
                            activities: d.details?.activities || [],
                            fee: d.details?.fee || [],
                            usefulInfo: d.details?.usefulInfo || [],
                            openHour: d.openHour || {},
                            album: {
                                space: d.album?.space || [],
                                fnb: d.album?.fnb || [],
                                extra: d.album?.extra || [],
                            },
                        },
                    });
                } else {
                    message.error('Không tìm thấy địa điểm');
                }
            })
            .catch(() => message.error('Lỗi khi tải thông tin địa điểm'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            const { title, type, tags, address, city, phone, website, facebook, instagram, createdBy, ...detail } =
                formData;

            const contactInfo = {
                phone,
                website,
                facebook,
                instagram,
            };

            const payload = {
                title,
                type,
                tags: tags.map((tag) => (typeof tag === 'object' ? tag._id : tag)),
                city,
                address,
                createdBy,
                contactInfo,
                openHour: detail.openHour,
                details: {
                    description: detail.description,
                    highlight: detail.highlight,
                    services: detail.services,
                    cultureType: detail.cultureType,
                    activities: detail.activities,
                    fee: detail.fee,
                    usefulInfo: detail.usefulInfo,
                },
                album: {
                    space: detail.album?.space || [],
                    fnb: detail.album?.fnb || [],
                    extra: detail.album?.extra || [],
                    highlight: detail.album?.highlight || [],
                },
            };

            console.log('Payload gửi sang BE:', payload);
            const res = await updateDestinationToEditApi(id, payload);

            if (res && res.EC === 0) {
                message.success('Cập nhật địa điểm thành công!');
                navigate('/admin/destinations-management');
            } else {
                message.error(res?.EM || 'Cập nhật thất bại!');
            }
        } catch (err) {
            console.error('Chi tiết lỗi:', err);
            if (err.response?.data?.EM) {
                message.error(err.response.data.EM);
            } else {
                message.error('Có lỗi khi cập nhật địa điểm!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <h1 className={cx('title')}>Chỉnh sửa thông tin địa điểm</h1>
                {defaultData ? (
                    <DestinationEditForm initialData={defaultData} onSave={handleSubmit} loading={loading} />
                ) : (
                    <div style={{ padding: 40, textAlign: 'center' }}>Đang tải dữ liệu...</div>
                )}
            </div>
        </div>
    );
}

export default EditDestination;
