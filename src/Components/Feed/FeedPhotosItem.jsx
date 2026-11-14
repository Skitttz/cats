import React from "react";
import styles from "./FeedPhotosItem.module.css";
import Image from "../Helper/Image";

const FeedPhotosItem = ({ photo, setModalPhoto }) => {
  function handleClick() {
    setModalPhoto(photo);
  }

  return (
    <li className={styles.photo}>
      <button type="button" className={styles.openPhoto} onClick={handleClick} aria-label={`Abrir foto: ${photo.title}`}>
      <Image src={photo.src} alt={photo.title} />

      <span className={styles.view}>{photo.acessos}</span>
      </button>
    </li>
  );
};

export default FeedPhotosItem;
