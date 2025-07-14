import classNames from 'classnames/bind';
import { Rate, Input, DatePicker, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './ReviewForm.module.scss';
import { useState, useContext } from 'react';
import { createCommentApi } from '~/utils/api';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);
const { TextArea } = Input;

const ratingLabels = {
    restaurant: {
        criteria1: 'Đồ ăn/Thức uống',
        criteria2: 'Không gian',
        criteria3: 'Dịch vụ',
        criteria4: 'Vệ sinh',
        criteria5: 'Giá cả',
        criteria6: 'Độ thuận tiện',
    },
    tourist: {
        criteria1: 'Cảnh quan',
        criteria2: 'Hoạt động trải nghiệm',
        criteria3: 'Nét đặc trưng',
        criteria4: 'Vệ sinh',
        criteria5: 'Chi phí tham quan',
        criteria6: 'Độ thuận tiện',
    },
};

function ReviewForm({ type = 'restaurant', onSubmit, destinationId, destinationData }) {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        criteria1: 0,
        criteria2: 0,
        criteria3: 0,
        criteria4: 0,
        criteria5: 0,
        criteria6: 0,
        title: '',
        content: '',
        visitDate: null,
        images: [],
    });

    const getRatingText = (rating) => {
        if (rating >= 4.5) return 'Rất tốt';
        if (rating >= 3.5) return 'Tốt';
        if (rating >= 2.5) return 'Bình thường';
        if (rating >= 1.5) return 'Tệ';
        return 'Rất tệ';
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return '#00B300';
        if (rating >= 4) return '#66FF66';
        if (rating >= 3) return '#FFD700';
        if (rating >= 2) return '#FF8C00';
        return '#FF0000';
    };

    const handleChange = (key, value) => {
        setForm((prev) => {
            const newForm = { ...prev, [key]: value };
            const rateKeys = Object.keys(ratingLabels[type]).filter((k) => ratingLabels[type][k]);
            const validRates = rateKeys.map((k) => newForm[k]).filter((v) => v > 0);
            const total = validRates.reduce((sum, val) => sum + val, 0);
            newForm.rating = validRates.length ? Math.round((total / validRates.length) * 2) / 2 : 0;
            return newForm;
        });
    };

    const handleImageChange = ({ fileList }) => {
        if (fileList.length > 4) {
            message.warning('Chỉ được tải tối đa 4 hình ảnh!');
            return;
        }
        setForm((prev) => ({ ...prev, images: fileList }));
    };

    const handleSubmit = async () => {
        if (!auth.isAuthenticated) {
            message.error('Vui lòng đăng nhập để viết đánh giá');
            return;
        }

        if (!form.title.trim()) {
            message.error('Vui lòng nhập tiêu đề');
            return;
        }

        if (!form.content.trim()) {
            message.error('Vui lòng nhập nội dung đánh giá');
            return;
        }

        if (!form.visitDate) {
            message.error('Vui lòng chọn thời gian trải nghiệm');
            return;
        }

        const rateKeys = Object.keys(ratingLabels[type]).filter((k) => ratingLabels[type][k]);
        const allRated = rateKeys.every((key) => form[key] > 0);
        if (!allRated) {
            message.error('Vui lòng đánh giá đầy đủ tất cả tiêu chí');
            return;
        }

        try {
            setLoading(true);
            const commentData = {
                destinationId,
                title: form.title,
                content: form.content,
                visitDate: form.visitDate,
                images: form.images,
                detail: {
                    criteria1: form.criteria1,
                    criteria2: form.criteria2,
                    criteria3: form.criteria3,
                    criteria4: form.criteria4,
                    criteria5: form.criteria5,
                    criteria6: form.criteria6,
                },
            };
            const response = await createCommentApi(commentData);
            if (response && response.EC === 0) {
                message.success('Đánh giá của bạn đã được gửi thành công!');
                navigate(`/destination/${destinationData.slug}`);
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra khi gửi đánh giá');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            message.error('Có lỗi xảy ra khi gửi đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate(destinationData?.slug ? `/destination/${destinationData.slug}` : -1);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('form-group')}>
                <label>Tiêu đề đánh giá:</label>
                <Input
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ví dụ: Khung cảnh tuyệt đẹp, đồ ăn xuất sắc!"
                />
            </div>

            <div className={cx('form-group')}>
                <label>Nội dung đánh giá:</label>
                <TextArea
                    rows={4}
                    maxLength={1000}
                    value={form.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                />
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#888' }}>
                    {form.content.length} / 1000 ký tự
                </div>
            </div>

            <div className={cx('form-group')}>
                <label>Thời gian trải nghiệm:</label>
                <DatePicker
                    placeholder="Chọn ngày"
                    format="DD/MM/YYYY"
                    value={form.visitDate}
                    onChange={(value) => handleChange('visitDate', value)}
                />
            </div>

            <div className={cx('form-group-rate')}>
                <label>Đánh giá tổng thể:</label>
                <div className={cx('total-rating')}>
                    <Rate
                        allowHalf
                        disabled
                        value={form.rating}
                        style={{ fontSize: '25px', color: getRatingColor(form.rating) }}
                    />
                    {form.rating > 0 && (
                        <span className={cx('rating-text')} style={{ color: getRatingColor(form.rating) }}>
                            {getRatingText(form.rating)}
                        </span>
                    )}
                </div>
            </div>

            <div className={cx('rating-details')}>
                <table>
                    <tbody>
                        {Object.entries(ratingLabels[type]).map(([criteriaKey, label]) =>
                            label ? (
                                <tr key={criteriaKey}>
                                    <td className={cx('rating-details-label')}>{label}:</td>
                                    <td className={cx('rating-stars')}>
                                        <Rate
                                            allowHalf
                                            value={form[criteriaKey]}
                                            onChange={(value) => handleChange(criteriaKey, value)}
                                        />
                                    </td>
                                </tr>
                            ) : null,
                        )}
                    </tbody>
                </table>
            </div>

            <div className={cx('form-group')}>
                <label>Tải lên hình ảnh (tối đa 4):</label>
                <Upload
                    listType="picture-card"
                    fileList={form.images}
                    onChange={handleImageChange}
                    beforeUpload={() => false}
                >
                    {form.images.length >= 4 ? null : (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải ảnh</div>
                        </div>
                    )}
                </Upload>
            </div>

            <div className={cx('form-group-submit')}>
                <Button type="primary" onClick={handleSubmit} loading={loading} disabled={loading}>
                    Gửi đánh giá
                </Button>
                <Button onClick={handleCancel}>Hủy bỏ</Button>
            </div>
        </div>
    );
}

export default ReviewForm;
