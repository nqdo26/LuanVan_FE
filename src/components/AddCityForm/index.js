import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AddCityForm.module.scss';
import { getCityTypesApi } from '~/utils/api';

const cx = classNames.bind(styles);

function AddCityForm({ defaultData, onNext }) {
    const [form, setForm] = useState({
        title: defaultData.title || '',
        description: defaultData.description || '',
        type: defaultData.type || '',
    });
    const [typeOptions, setTypeOptions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTypes = async () => {
            const res = await getCityTypesApi();
            if (Array.isArray(res.data)) {
                setTypeOptions(res.data.map((t) => ({ value: t._id, label: t.title })));
            }
        };
        fetchTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.type) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        onNext(form);
    };

    return (
        <form className={cx('form')} onSubmit={handleSubmit}>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="title">Tên thành phố</label>
                    <input id="title" name="title" value={form.title} onChange={handleChange} />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="type">Phân loại</label>
                    <select id="type" name="type" value={form.type} onChange={handleChange}>
                        <option value="">-- Chọn loại thành phố --</option>
                        {typeOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className={cx('submit-btn')}>
                Tiếp tục
            </button>
        </form>
    );
}

export default AddCityForm;
