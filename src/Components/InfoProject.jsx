import { Brush, GithubIcon, LinkedinIcon } from 'lucide-react';
import React from 'react';
import Logo from '../Assets/cats.svg';
import styles from './InfoProject.module.css';

const InfoProjectModal = ({ setInfoModal }) => {
  function handleOutSideClick(event) {
    if (event.target === event.currentTarget) {
      setInfoModal(null);
    }
  }
  return (
    <div>
      <div
        className={`${styles.modal} animeOpacity`}
        onClick={handleOutSideClick}
      >
        <div className={`${styles.dialogModal} animeDown`}>
          <div className={styles.menu} onClick={handleOutSideClick}></div>
          <div className={styles.mainContainer}>
            <div className={styles.containerAbout}>
              <div className={styles.containerLogo}>
                <Logo />
              </div>
              <div>
                <p>
                  O objetivo principal do projeto <span>Cats</span> é criar uma
                  comunidade, onde os amantes de gatos possam se conectar,
                  compartilhar suas experiências e mostrar seus carismáticos
                  felinos.
                </p>
              </div>
            </div>
            <div className={styles.containerStory}>
              <h5>
                Inicialmente desenvolvido para um projeto de conclusão do curso
                da{' '}
                <a href="https://www.origamid.com/" target="__blank">
                  Origamid
                </a>
                , entretando foi além dos ensinamentos dados, criando sua
                própria identidade.
              </h5>
              <div className={styles.containerContact}>
                <a href="https://github.com/Skitttz/Cats" target="__blank">
                  <GithubIcon /> Repositório
                </a>
                <a
                  href="https://www.figma.com/file/W3Ms5OmiEDYSquoKonZ55h/Cats?type=design&node-id=0%3A1&mode=design&t=A2WmgYHU4V3n9mRr-1"
                  target="__blank"
                >
                  <Brush /> Prototipação
                </a>
                <a
                  href="https://www.linkedin.com/in/carlos-vinicius-dev/"
                  target="__blank"
                >
                  <LinkedinIcon /> Contato
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoProjectModal;
