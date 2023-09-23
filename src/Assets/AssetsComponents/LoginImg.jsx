import React from "react";
import Img from "../../Assets/login.jpg";

const LoginImg = () => {
  return (
    <div className="animeLeft">
      <img
        style={{
          maxWidth: "50vh",
        }}
        src={Img}
        alt="Imagem Logo Cats"
      />
    </div>
  );
};

export default LoginImg;
