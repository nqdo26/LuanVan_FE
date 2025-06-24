import { SearchOutlined } from "@ant-design/icons";
import classNames from "classnames/bind";
import styles from "./SearchBarInSearchPage.module.scss";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const cx = classNames.bind(styles);

function SearchBarInSearchPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
             window.scrollTo(0, 0); 
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -5, 
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.15)", 
            }}
            transition={{ type: "spring", stiffness: 120, damping: 10 }} 
            className={cx("search-bar", { "has-content": searchTerm.length > 0 })}
        >
            <div className={cx("search-icon")}>
                <SearchOutlined style={{ padding: "6px 6px" }} />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Tìm kiếm địa điểm, hành trình ..."
                className={cx("search-input")}
            />
        </motion.div>
    );
}

export default SearchBarInSearchPage;
