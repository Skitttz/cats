import React, { useRef } from "react";
import styles from "./PhotoLike.module.css";
import { ReactComponent as Heart } from "../../Assets/heart.svg";
import { HAS_LIKE_GET, LIKE_POST, PHOTO_LIKE_GET } from "../../Api";
import useFetch from "../../Hooks/useFetch";
import { useUser } from "../../UserContext";

const PhotoLike = ({ id }) => {
  const { error, request } = useFetch();
  const { login } = useUser();
  const [like, setLike] = React.useState(false);
  const [total, setTotal] = React.useState(0);
  const [animation, setAnimation] = React.useState(false);

  function totalIncrement(i) {
    setTotal(total + i);
  }

  async function handleClick() {
    const { url, options } = LIKE_POST(id);
    const { response, json } = await request(url, options);
    if (response.ok && json.message === "Post foi curtido!") {
      setLike(true);
      totalIncrement(+1);
      setAnimation(true);
    } else {
      totalIncrement(-1);
      setLike(false);
    }
  }

  React.useEffect(() => {
    async function isLiked() {
      const { url, options } = HAS_LIKE_GET(id);
      const { response, json } = await request(url, options);
      if (response.ok) {
        if (json.liked === true) {
          setLike(true);
        }
      }
    }

    async function getTotalLikes() {
      const { url, options } = PHOTO_LIKE_GET(id);
      const { response, json } = await request(url, options);
      if (response.ok) {
        setTotal(json.total_likes);
      }
    }

    getTotalLikes();
    isLiked();
  }, [id, request, total]);

  return (
    <>
      {like && login ? (
        <div className={styles.container}>
          <button
            className={`${styles.btnLike} ${animation ? styles.ativo : ""}`}
            onClick={handleClick}
          >
            <Heart style={{ fill: "red" }} />
          </button>
          <span>{total}</span>
        </div>
      ) : (
        <div className={styles.container}>
          <button className={styles.btnLike} onClick={handleClick}>
            <Heart />
          </button>
          <span>{total}</span>
        </div>
      )}
    </>
  );
};

export default PhotoLike;
