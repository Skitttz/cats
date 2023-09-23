import React from "react";

const PasswordStrong = ({ children }) => {
  /* Tamanho */
  const validateTL = children.length >= 6 && children.length <= 20;

  /* Caract Especial */
  const validateSC = /[^A-Za-z0-9]/.test(children);

  /* Lower Case */
  const validateLW = /[a-z]/.test(children);

  /* Upper Case */
  const validateUC = /[A-Z]/.test(children);

  /* Number Case */
  const validateNC = /[0-9]/.test(children);

  return (
    <div
      className="animeDown"
      style={{ fontWeight: "550", marginBottom: "2rem" }}
    >
      <p>
        {validateTL
          ? "😸✔️ OK! temos uma senha entre 6 a 20 caracteres."
          : `😿❌ A senha precisa ter entre 6 a 20 caracteres.`}
      </p>
      <p>
        {validateSC
          ? "😸✔️ OK! Temos um caracter especial."
          : `😿❌ Adicione um caractere especial, como um
        arranhão. `}
      </p>
      <p>
        {validateLW
          ? "😸✔️ OK! Já temos uma letra minúscula. "
          : "😿❌ Precisamos de uma letra minúscula aqui. "}
      </p>
      <p>
        {validateUC
          ? "😸✔️ OK! Temos uma letra maiúscula aqui. "
          : `😿❌ Precisamos de uma letra maiúscula seria
        ótimo. `}
      </p>
      <p>
        {validateNC
          ? "😸✔️ OK! Temos um número. "
          : `😿❌ Precisamos de um número para brincar.
        aqui. `}
      </p>
    </div>
  );
};

export default PasswordStrong;
