import { motion } from "framer-motion";
import classNames from 'classnames/bind';

import styles from './CustomTitle.module.scss';

const cx = classNames.bind(styles);

function CustomTitle({ title, size }) {
    return (
        <motion.h1
            animate={{ x: [-15, 10, -15] }} 
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} 
            style={{
                fontSize: size,
            }}
            className={cx('title')}
        >
            {title}
        </motion.h1>
    );
}

export default CustomTitle;
