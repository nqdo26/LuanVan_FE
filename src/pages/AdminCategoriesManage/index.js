import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './AdminCategoriesManage.module.scss';
import { Button, Table, Popconfirm, message, Modal, Form, Input } from 'antd';
import {
    getTagsApi,
    createTagApi,
    updateTagApi,
    deleteTagApi,
    getCityTypesApi,
    createCityTypeApi,
    updateCityTypeApi,
    deleteCityTypeApi,
} from '~/utils/api';

const cx = classNames.bind(styles);

function AdminCategoriesManage() {
    // State for tags
    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);

    // State for city types
    const [cityTypes, setCityTypes] = useState([]);
    const [loadingCityTypes, setLoadingCityTypes] = useState(false);

    // Modal control
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [isCityTypeModalOpen, setIsCityTypeModalOpen] = useState(false);
    const [editingCityType, setEditingCityType] = useState(null);

    const [form] = Form.useForm();
    const [cityTypeForm] = Form.useForm();

    // Fetch tags
    const fetchTags = async () => {
        setLoadingTags(true);
        try {
            const res = await getTagsApi();
            let dataArr = [];
            // Trường hợp API trả về array
            if (Array.isArray(res)) {
                dataArr = res;
            }
            // Trường hợp API trả về object chứa array trong data field
            else if (res && Array.isArray(res.data)) {
                dataArr = res.data;
            }
            setTags(dataArr);
        } catch (e) {
            setTags([]);
            message.error('Lỗi khi lấy danh sách Tag!');
        }
        setLoadingTags(false);
    };

    // Fetch city types
    const fetchCityTypes = async () => {
        setLoadingCityTypes(true);
        try {
            const res = await getCityTypesApi();
            let dataArr = [];
            if (Array.isArray(res)) {
                dataArr = res;
            } else if (res && Array.isArray(res.data)) {
                dataArr = res.data;
            }
            setCityTypes(dataArr);
        } catch (e) {
            setCityTypes([]);
            message.error('Lỗi khi lấy danh sách City Type!');
        }
        setLoadingCityTypes(false);
    };

    useEffect(() => {
        fetchTags();
        fetchCityTypes();
    }, []);

    // -------- Tag handlers --------
    const handleAddTag = () => {
        setEditingTag(null);
        form.resetFields();
        setIsTagModalOpen(true);
    };

    const handleEditTag = (record) => {
        setEditingTag(record);
        form.setFieldsValue(record);
        setIsTagModalOpen(true);
    };

    const handleDeleteTag = async (record) => {
        try {
            await deleteTagApi(record._id);
            message.success('Xóa Tag thành công!');
            fetchTags();
        } catch {
            message.error('Xóa Tag thất bại!');
        }
    };

    const handleTagModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingTag) {
                await updateTagApi(editingTag._id, values.name, values.description);
                message.success('Cập nhật Tag thành công!');
            } else {
                await createTagApi(values.name, values.description);
                message.success('Thêm Tag mới thành công!');
            }
            setIsTagModalOpen(false);
            fetchTags();
        } catch (err) {
            // ignore
        }
    };

    // -------- City Type handlers --------
    const handleAddCityType = () => {
        setEditingCityType(null);
        cityTypeForm.resetFields();
        setIsCityTypeModalOpen(true);
    };

    const handleEditCityType = (record) => {
        setEditingCityType(record);
        cityTypeForm.setFieldsValue(record);
        setIsCityTypeModalOpen(true);
    };

    const handleDeleteCityType = async (record) => {
        try {
            await deleteCityTypeApi(record._id);
            message.success('Xóa City Type thành công!');
            fetchCityTypes();
        } catch {
            message.error('Xóa City Type thất bại!');
        }
    };

    const handleCityTypeModalOk = async () => {
        try {
            const values = await cityTypeForm.validateFields();
            if (editingCityType) {
                await updateCityTypeApi(editingCityType._id, values.title);
                message.success('Cập nhật City Type thành công!');
            } else {
                await createCityTypeApi(values.title);
                message.success('Thêm City Type mới thành công!');
            }
            setIsCityTypeModalOpen(false);
            fetchCityTypes();
        } catch (err) {
            // ignore
        }
    };

    // -------- Table columns --------
    const tagColumns = [
        {
            title: 'STT',
            render: (_, __, idx) => idx + 1,
            width: 60,
        },
        {
            title: 'Tên Tag',
            dataIndex: 'title',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
        },
        {
            title: 'Tùy chọn',
            render: (record) => (
                <div style={{ display: 'flex', gap: 10 }}>
                    <Button type="primary" onClick={() => handleEditTag(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa tag này?"
                        onConfirm={() => handleDeleteTag(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </div>
            ),
            width: 140,
        },
    ];

    const cityTypeColumns = [
        {
            title: 'STT',
            render: (_, __, idx) => idx + 1,
            width: 60,
        },
        {
            title: 'Tên loại thành phố',
            dataIndex: 'title',
        },
        {
            title: 'Tùy chọn',
            render: (record) => (
                <div style={{ display: 'flex', gap: 10 }}>
                    <Button type="primary" onClick={() => handleEditCityType(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa loại này?"
                        onConfirm={() => handleDeleteCityType(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </div>
            ),
            width: 140,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <div className={cx('section-1')}>
                    <h1 className={cx('title')}>Quản lý địa điểm</h1>
                    <div className={cx('section-1-items')}>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Thẻ:</p>
                            <p className={cx('small-card-value')}> {Array.isArray(tags) ? tags.length : 0}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Loại thành phố:</p>
                            <p className={cx('small-card-value')}> {Array.isArray(cityTypes) ? cityTypes.length : 0}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('section-2')} style={{ marginBottom: 32 }}>
                    <h2 style={{ marginBottom: 12 }}>Danh sách Tag địa điểm</h2>
                    <Button type="primary" onClick={handleAddTag} style={{ marginBottom: 14 }}>
                        Thêm Tag mới
                    </Button>
                    <Table
                        loading={loadingTags}
                        dataSource={Array.isArray(tags) ? tags : []}
                        columns={tagColumns}
                        rowKey="_id"
                        bordered
                        pagination={false}
                    />
                </div>
                <div className={cx('section-2')}>
                    <h2 style={{ marginBottom: 12 }}>Danh sách Loại thành phố</h2>
                    <Button type="primary" onClick={handleAddCityType} style={{ marginBottom: 14 }}>
                        Thêm City Type mới
                    </Button>
                    <Table
                        loading={loadingCityTypes}
                        dataSource={Array.isArray(cityTypes) ? cityTypes : []}
                        columns={cityTypeColumns}
                        rowKey="_id"
                        bordered
                        pagination={false}
                    />
                </div>
            </div>

            <Modal
                title={editingTag ? 'Chỉnh sửa Tag' : 'Thêm Tag mới'}
                open={isTagModalOpen}
                onOk={handleTagModalOk}
                onCancel={() => setIsTagModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Tên Tag"
                        rules={[{ required: true, message: 'Tên tag không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title={editingCityType ? 'Chỉnh sửa City Type' : 'Thêm City Type mới'}
                open={isCityTypeModalOpen}
                onOk={handleCityTypeModalOk}
                onCancel={() => setIsCityTypeModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={cityTypeForm} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tên loại thành phố"
                        rules={[{ required: true, message: 'Tên loại thành phố không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </motion.div>
    );
}

export default AdminCategoriesManage;
