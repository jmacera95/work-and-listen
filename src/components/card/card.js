import Image from "next/image";
import styles from "./card.module.css";
import { useState } from "react";

import { motion } from "framer-motion";
import cls from "classnames";

const Card = (props) => {
    const { imgUrl = "https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80", size = "medium", id, shouldScale = true } = props;
    const [imgSrc, setImgSrc] = useState(imgUrl);

    const classMap = {
        "large": styles.lgItem,
        "medium": styles.mdItem,
        "small": styles.smItem,
    };

    const handleOnError = (e) => {
        e.preventDefault();
        setImgSrc("https://images.unsplash.com/photo-1489641493513-ba4ee84ccea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80");
    }

    const scale = id === 0 ? {scaleY: 1.1} : {scale:1.1};
    
    const whileHover = shouldScale && {
        ...scale
    }

    return (
        <div className={styles.container}>
            <motion.div className={cls(styles.imgMotionWrapper, classMap[size])}
            whileHover={whileHover}>
                <Image
                    src={imgSrc}
                    alt="image"
                    fill={true}
                    onError={handleOnError}
                    className={styles.cardImg}
                />
            </motion.div>
        </div>
    )
};

export default Card;