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
    // Tag state
    const [tags, setTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);

    // City Type state (REAL)
    const [cityTypes, setCityTypes] = useState([]);
    const [loadingCityTypes, setLoadingCityTypes] = useState(false);
    const [isCityTypeModalOpen, setIsCityTypeModalOpen] = useState(false);
    const [editingCityType, setEditingCityType] = useState(null);

    // Modal Tag
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState(null);

    const [form] = Form.useForm();
    const [cityTypeForm] = Form.useForm();

    // Fetch data
    useEffect(() => {
        fetchTags();
        fetchCityTypes();
    }, []);

    const fetchTags = async () => {
        setLoadingTags(true);
        try {
            const res = await getTagsApi();
            let dataArr = [];
            if (Array.isArray(res)) dataArr = res;
            else if (res && Array.isArray(res.data)) dataArr = res.data;
            setTags(dataArr);
        } catch {
            setTags([]);
            message.error('Lỗi khi lấy danh sách Thẻ!');
        }
        setLoadingTags(false);
    };

    const fetchCityTypes = async () => {
        setLoadingCityTypes(true);
        try {
            const res = await getCityTypesApi();
            let dataArr = [];
            if (Array.isArray(res)) dataArr = res;
            else if (res && Array.isArray(res.data)) dataArr = res.data;
            setCityTypes(dataArr);
        } catch {
            setCityTypes([]);
            message.error('Lỗi khi lấy danh sách Loại thành phố!');
        }
        setLoadingCityTypes(false);
    };

    // Tag handlers
    const handleAddTag = () => {
        setEditingTag(null);
        form.resetFields();
        setIsTagModalOpen(true);
    };

    const handleEditTag = (record) => {
        setEditingTag(record);
        form.setFieldsValue({ title: record.title });
        setIsTagModalOpen(true);
    };

    const handleDeleteTag = async (record) => {
        try {
            await deleteTagApi(record._id);
            message.success('Xóa Thẻ thành công!');
            fetchTags();
        } catch {
            message.error('Xóa Thẻ thất bại!');
        }
    };

    const handleTagModalOk = async () => {
        try {
            const values = await form.validateFields();
            const title = values.title.trim();
            let res;
            if (editingTag) {
                res = await updateTagApi(editingTag._id, title);
                if (res && res.EC === 0) {
                    message.success('Cập nhật Thẻ thành công!');
                } else if (res.EC === 1) {
                    message.error('Thẻ đã tồn tại');
                } else {
                    message.error(res?.EM || 'Xóa Thẻ thất bại!');
                }
            } else {
                res = await createTagApi(title);
                if (res && res.EC === 0) {
                    message.success('Thêm Tag mới thành công!');
                } else if (res.EC === 1) {
                    message.error('Thẻ đã tồn tại');
                } else {
                    message.error(res?.EM || 'Xóa Thẻ thất bại!');
                }
            }
            setIsTagModalOpen(false);
            fetchTags();
        } catch {
            message.error('Vui lòng kiểm tra lại thông tin!');
        }
    };

    // CityType handlers (REAL)
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
            const res = await deleteCityTypeApi(record._id);
            if (res && res.EC === 0) {
                message.success('Xóa danh mục thành công!');
                fetchCityTypes();
            } else {
                message.error(res?.EM || 'Xóa danh mục thất bại!');
            }
        } catch {
            message.error('Lỗi hệ thống!');
        }
    };

    const handleCityTypeModalOk = async () => {
        try {
            const values = await cityTypeForm.validateFields();
            const title = values.title.trim();
            let res;
            if (editingCityType) {
                res = await updateCityTypeApi(editingCityType._id, title);
                if (res && res.EC === 0) {
                    message.success('Cập nhật danh mục thành công!');
                } else if (res.EC === 1) {
                    message.error('Danh mục đã tồn tại');
                } else {
                    message.error(res?.EM || 'Xóa danh mục thất bại!');
                }
            } else {
                res = await createCityTypeApi(title);
                if (res && res.EC === 0) {
                    message.success('Thêm danh mục thành công!');
                } else if (res.EC === 1) {
                    message.error('Danh mục đã tồn tại');
                } else {
                    message.error(res?.EM || 'Xóa danh mục thất bại!');
                }
            }
            setIsCityTypeModalOpen(false);
            fetchCityTypes();
        } catch {
            message.error('Vui lòng kiểm tra lại thông tin!');
        }
    };

    // Table columns
    const tagColumns = [
        {
            title: 'STT',
            render: (_, __, idx) => idx + 1,
            width: 60,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            width: 200,
            ellipsis: true,
            render: (id) => <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{id}</span>,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
        },
        {
            title: 'Số địa điểm có thẻ',
            dataIndex: 'destinationsCount',
            align: 'center',
            width: 140,
            render: (count) => count ?? 0,
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
            title: 'ID',
            dataIndex: '_id',
            width: 200,
            ellipsis: true,
            render: (id) => <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{id}</span>,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
        },
        {
            title: 'Số thành phố',
            dataIndex: 'cityCount',
            align: 'center',
            width: 140,
            render: (count) => count ?? 0,
        },
        {
            title: 'Tùy chọn',
            render: (record) => (
                <div style={{ display: 'flex', gap: 10 }}>
                    <Button type="primary" onClick={() => handleEditCityType(record)}>
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xác nhận xóa?"
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
                            <p className={cx('small-card-value')}>{Array.isArray(tags) ? tags.length : 0}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Danh mục thành phố:</p>
                            <p className={cx('small-card-value')}>{Array.isArray(cityTypes) ? cityTypes.length : 0}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('section-2')} style={{ marginBottom: 32 }}>
                    <h2 style={{ marginBottom: 12 }}>Danh sách Thẻ</h2>
                    <Button type="primary" onClick={handleAddTag} style={{ marginBottom: 14 }}>
                        Thêm Thẻ mới
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
                    <h2 style={{ marginBottom: 12 }}>Danh mục thành phố</h2>
                    <Button type="primary" onClick={handleAddCityType} style={{ marginBottom: 14 }}>
                        Thêm Danh mục mới
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
            {/* Tag Modal */}
            <Modal
                title={editingTag ? 'Chỉnh sửa Thẻ' : 'Thêm Thẻ mới'}
                open={isTagModalOpen}
                onOk={handleTagModalOk}
                onCancel={() => setIsTagModalOpen(false)}
                okText="Lưu"
                cancelText="Hủy"
                destroyOnClose
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="title"
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Tiêu đề không được để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title={editingCityType ? 'Chỉnh sửa Danh mục' : 'Thêm Danh mục mới'}
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
                        label="Tiêu đề"
                        rules={[{ required: true, message: 'Tiêu đề không thể để trống!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </motion.div>
    );
}

export default AdminCategoriesManage;
