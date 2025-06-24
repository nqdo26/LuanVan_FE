import { Row, Col } from "antd";
import { motion } from "framer-motion";
import { FaUmbrellaBeach, FaMountain, FaLandmark } from "react-icons/fa";
import styles from "./Category.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const categories = [
    { name: "Biển", icon: <FaUmbrellaBeach />, color: "#1E90FF" },
    { name: "Núi", icon: <FaMountain />, color: "#32CD32" },
    { name: "Văn hóa", icon: <FaLandmark />, color: "#FF6347" },
];

function Category() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className={cx("category-wrapper")}>
                <h2 className={cx("title")}>Khám phá theo loại hình</h2>
                <Row gutter={16}>
                    {categories.map((cat, index) => (
                        <Col 
                        key={index} 
                        span={8} 
                        xs={24} 
                            sm={24} 
                            md={12} 
                            lg={8}  
                        className={cx("category-item")}>
                            <motion.div
                                className={cx("item")}
                                style={{ backgroundColor: cat.color }}
                                whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
                                transition={{ duration: 0.01 }}
                            >
                                <div className={cx("icon")}>{cat.icon}</div>
                                <h1 className={cx("name")}>{cat.name}</h1>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>
        </motion.div>
    );
}

export default Category;
