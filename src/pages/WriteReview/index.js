import React from 'react';
import classNames from 'classnames/bind';

import styles from './WriteReview.module.scss';
import CardReview from '~/components/CardReview';
import ReviewForm from '~/components/ReviewForm';

const cx = classNames.bind(styles);

function WriteReview() {
    const type = 'restaurant';

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('side-bar')}>
                    <h1>Trải nghiệm của bạn như thế nào? Hãy chia sẻ cho mọi người biết nhé</h1>
                    <CardReview />
                </div>

                <div className={cx('content')}>
                    <ReviewForm type={type} />
                </div>
            </div>
        </div>
    );
}

export default WriteReview;
