import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './AddCityForm.module.scss';
import { getCityTypesApi } from '~/utils/api';

const cx = classNames.bind(styles);

function AddCityForm({ defaultData, onNext }) {
    const [form, setForm] = useState({
        title: defaultData.title || '',
        description: defaultData.description || '',
        type: defaultData.type || [],
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

    const handleTypeChange = (typeId) => {
        setForm((prev) => {
            const currentTypes = prev.type || [];
            const isSelected = currentTypes.includes(typeId);

            if (isSelected) {
                // Remove type if already selected
                return { ...prev, type: currentTypes.filter((id) => id !== typeId) };
            } else {
                // Add type if not selected
                return { ...prev, type: [...currentTypes, typeId] };
            }
        });
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.description || !form.type.length) {
            setError('Vui lòng điền đầy đủ thông tin và chọn ít nhất một phân loại.');
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
                    <label>Phân loại (có thể chọn nhiều)</label>
                    <div className={cx('checkbox-group')}>
                        {typeOptions.map((opt) => (
                            <label key={opt.value} className={cx('checkbox-item')}>
                                <input
                                    type="checkbox"
                                    checked={form.type.includes(opt.value)}
                                    onChange={() => handleTypeChange(opt.value)}
                                />
                                <span>{opt.label}</span>
                            </label>
                        ))}
                    </div>
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
