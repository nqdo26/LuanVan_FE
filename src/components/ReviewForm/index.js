import classNames from 'classnames/bind';
import { Rate, Input, DatePicker, Button, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './ReviewForm.module.scss';
import { useState } from 'react';

const cx = classNames.bind(styles);
const { TextArea } = Input;

function ReviewForm({ type = 'restaurant', onSubmit }) {
    const [form, setForm] = useState({
        author: '',
        rating: 0,
        landscape: 0,
        service: 0,
        price: 0,
        cleanliness: 0,
        convenience: 0,
        activities: 0,
        title: '',
        content: '',
        date: null,
        images: [],
    });

    const getRatingText = (rating) => {
        if (rating >= 4.5) return 'Rất tốt';
        if (rating >= 3.5) return 'Tốt';
        if (rating >= 2.5) return 'Bình thường';
        if (rating >= 1.5) return 'Tệ';
        if (rating >= 0) return 'Rất tệ';
        return '';
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return '#00B300';
        if (rating >= 4) return '#66FF66';
        if (rating >= 3) return '#FFD700';
        if (rating >= 2) return '#FF8C00';
        if (rating >= 1) return '#FF0000';
        return '#FF0000';
    };

    const handleChange = (key, value) => {
        setForm((prev) => {
            const newForm = {
                ...prev,
                [key]: value,
            };

            const rateKeys = ['landscape', 'service', 'price', 'cleanliness', 'convenience', 'activities'];

            if (rateKeys.includes(key)) {
                const validRates = rateKeys.map((k) => newForm[k]).filter((v) => v > 0);

                const total = validRates.reduce((sum, val) => sum + val, 0);
                const average = validRates.length ? total / validRates.length : 0;

                newForm.rating = Math.round(average * 2) / 2; // Làm tròn 0.5
            }

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

    const handleSubmit = () => {
        console.log('Review gửi đi:', form);
        if (onSubmit) onSubmit(form);
    };

    return (
        <div className={cx('wrapper')}>
            {/* Tiêu đề */}
            <div className={cx('form-group')}>
                <label>Tiêu đề đánh giá:</label>
                <Input
                    value={form.title}
                    className={cx('title-input')}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ví dụ: Khung cảnh tuyệt đẹp, đồ ăn xuất sắc!"
                />
            </div>

            {/* Nội dung */}
            <div className={cx('form-group')}>
                <label>Nội dung đánh giá:</label>
                <TextArea
                    className={cx('content-input')}
                    rows={4}
                    value={form.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Hãy chia sẻ trải nghiệm của bạn..."
                />
            </div>

            {/* Ngày trải nghiệm */}
            <div className={cx('form-group')}>
                <label>Thời gian trải nghiệm:</label>
                <DatePicker picker="day" value={form.date} onChange={(value) => handleChange('date', value)} />
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
                        {type === 'restaurant' ? (
                            <tr>
                                <td className={cx('rating-details-label')}>Đồ ăn/Thức uống:</td>
                                <td className={cx('rating-stars')}>
                                    <Rate
                                        allowHalf
                                        value={form.activities}
                                        onChange={(value) => handleChange('activities', value)}
                                    />
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td className={cx('rating-details-label')}>Cảnh quan:</td>
                                <td className={cx('rating-stars')}>
                                    <Rate
                                        allowHalf
                                        value={form.landscape}
                                        onChange={(value) => handleChange('landscape', value)}
                                    />
                                </td>
                            </tr>
                        )}

                        {/* Không gian hoặc Hoạt động */}
                        {type === 'restaurant' ? (
                            <tr>
                                <td className={cx('rating-details-label')}>Không gian:</td>
                                <td className={cx('rating-stars')}>
                                    <Rate
                                        allowHalf
                                        value={form.landscape}
                                        onChange={(value) => handleChange('landscape', value)}
                                    />
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td className={cx('rating-details-label')}>Hoạt động trải nghiệm:</td>
                                <td className={cx('rating-stars')}>
                                    <Rate
                                        allowHalf
                                        value={form.activities}
                                        onChange={(value) => handleChange('activities', value)}
                                    />
                                </td>
                            </tr>
                        )}

                        {/* Phục vụ hoặc Chi phí tham quan */}
                        {type === 'restaurant' ? (
                            <tr>
                                <td className={cx('rating-details-label')}>Phục vụ:</td>
                                <td className={cx('rating-stars')}>
                                    <Rate
                                        allowHalf
                                        value={form.service}
                                        onChange={(value) => handleChange('service', value)}
                                    />
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td className={cx('rating-details-label')}>Chi phí tham quan:</td>
                                <td className={cx('rating-stars')}>
                                    <Rate
                                        allowHalf
                                        value={form.price}
                                        onChange={(value) => handleChange('price', value)}
                                    />
                                </td>
                            </tr>
                        )}

                        {/* Vệ sinh */}
                        <tr>
                            <td className={cx('rating-details-label')}>Vệ sinh:</td>
                            <td className={cx('rating-stars')}>
                                <Rate
                                    allowHalf
                                    value={form.cleanliness}
                                    onChange={(value) => handleChange('cleanliness', value)}
                                />
                            </td>
                        </tr>

                        {/* Giá cả hoặc Độ thuận tiện đường đi */}
                        {type === 'restaurant' ? (
                            <tr>
                                <td className={cx('rating-details-label')}>Giá cả:</td>
                                <td className={cx('rating-stars')}>
                                    <Rate
                                        allowHalf
                                        value={form.price}
                                        onChange={(value) => handleChange('price', value)}
                                    />
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td className={cx('rating-details-label')}>Độ thuận tiện đường đi:</td>
                                <td className={cx('rating-stars')}>
                                    <Rate
                                        allowHalf
                                        value={form.convenience}
                                        onChange={(value) => handleChange('convenience', value)}
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Upload hình ảnh */}
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

            {/* Nút submit */}
            <div className={cx('form-group-submit')}>
                <Button className={cx('btn-submit')} onClick={handleSubmit}>
                    Gửi đánh giá
                </Button>
                <Button className={cx('btn-cancel')} onClick={handleSubmit}>
                    Hủy bỏ
                </Button>
            </div>
        </div>
    );
}

export default ReviewForm;
