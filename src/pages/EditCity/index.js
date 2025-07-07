import React from 'react';
import classNames from 'classnames/bind';
import styles from './EditCity.module.scss';
import CityEditForm from '~/components/CityEditForm';

const cx = classNames.bind(styles);

function EditCity() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <p className={cx('title')}>Chỉnh sửa thành phố</p>
                <CityEditForm />
            </div>
        </div>
    );
}

export default EditCity;
