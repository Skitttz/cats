import React from 'react';
import styles from './Footer.module.css';
import Cats from '../Assets/cats.svg';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Cats />
      <p>Cats. Alguns direitos reservados.</p>
    </footer>
  );
};

export default Footer;
