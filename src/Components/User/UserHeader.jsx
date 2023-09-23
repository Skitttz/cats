import React from "react";
import UserHeaderNav from "./UserHeaderNav";
import styles from "./UserHeader.module.css";
import { useLocation } from "react-router-dom";

const UserHeader = () => {
  const [title, setTitle] = React.useState("");
  const location = useLocation();

  React.useEffect(() => {
    const { pathname } = location;
    switch (pathname) {
      case "/conta/post":
        setTitle("Postar 😼inhe");
        break;
      case "/conta/stat":
        setTitle("Estatísticas");
        break;
      case "/conta/chat":
        setTitle("Chat");
        break;
      default:
        setTitle("Minhas Fotos");
    }
  }, [location]);

  return (
    <div className={styles.header}>
      <h1 className="title">{title}</h1>
      <UserHeaderNav />
    </div>
  );
};

export default UserHeader;
