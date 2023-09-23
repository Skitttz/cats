import React from "react";
import styles from "./PhotoContent.module.css";
import { Link } from "react-router-dom";
import PhotoComments from "./PhotoComments";
import { useUser } from "../../UserContext";
import PhotoDelete from "./PhotoDelete";
import Image from "../Helper/Image";

const PhotoContent = ({ data, single }) => {
  const user = useUser();
  const { photo, comments } = data;
  return (
    <div className={`${styles.photo} ${single ? styles.single : ""}`}>
      <div className={styles.img}>
        <Image src={photo.src} alt={photo.title} />
      </div>
      <div className={styles.details}>
        <div>
          <p className={styles.author}>
            {user.data && user.data.username === photo.author ? (
              <PhotoDelete id={photo.id} />
            ) : (
              <Link to={`/perfil/${photo.author}`}>@{photo.author}</Link>
            )}

            <span className={styles.view}>{photo.acessos}</span>
          </p>
          <h1 className={`${styles.titlePhoto} title`}>
            <Link to={`/photo/${photo.id}`}>{photo.title}</Link>
          </h1>
          <ul className={styles.attributes}>
            <li style={{ wordBreak: "break-all" }}>{photo.descricao} </li>
          </ul>
          <div className={styles.line}></div>
        </div>
      </div>

      <PhotoComments
        single={single}
        idade={photo.idade} // Passe idade como prop
        descricao={photo.descricao} // Passe descricao como prop
        id={photo.id}
        comments={comments}
      />
    </div>
  );
};

export default PhotoContent;
