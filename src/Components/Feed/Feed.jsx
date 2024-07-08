import React from 'react';
import FeedPhotos from './FeedPhotos';
import FeedModal from './FeedModal';
import styles from './Feed.module.css';
import PropTypes from 'prop-types';
import { disableScroll } from '../Utils/DisableScroll';

const Feed = ({ user = 0 }) => {
  const [modalPhoto, setModalPhoto] = React.useState(null);
  const [pages, setPages] = React.useState([1]);
  const [infinite, setInfinite] = React.useState(true);

  React.useEffect(() => {
    let wait = false;
    function infiniteScroll() {
      if (infinite) {
        const scroll = window.scrollY;
        const height = document.body.offsetHeight - window.innerHeight;
        if (scroll > height * 0.75 && !wait) {
          setPages((pages) => [...pages, pages.length + 1]);
          wait = true;
          setTimeout(() => {
            wait = false;
          }, 500);
        }
      }
    }
    window.addEventListener('wheel', infiniteScroll);
    window.addEventListener('scroll', infiniteScroll);

    return () => {
      window.removeEventListener('wheel', infiniteScroll);
      window.removeEventListener('scroll', infiniteScroll);
    };
  }, [infinite]);
  disableScroll(!!modalPhoto);

  return (
    <div>
      {modalPhoto && (
        <FeedModal photo={modalPhoto} setModalPhoto={setModalPhoto} />
      )}
      {pages.map((page) => (
        <FeedPhotos
          key={page}
          user={user}
          page={page}
          setModalPhoto={setModalPhoto}
          setInfinite={setInfinite}
        />
      ))}
      {!infinite && !user && (
        <p className={`${styles.noPost} animeDown`}>
          O estoque de gatinhos acabou não existem mais postagens.
        </p>
      )}
    </div>
  );
};

// React will no longer support defaultProps in future versions.
// Solution is use JavaScript default parameters directly in the function definition
// Feed.defaultProps = {
//   user: 0,
// };

Feed.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
};

export default Feed;
