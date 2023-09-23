import React from "react";
import Input from "../Forms/Input";
import Button from "../Forms/Button";
import useForm from "../../Hooks/useForm";
import PasswordStrong from "./PasswordStrong";
import { USER_POST } from "../../Api";
import { useUser } from "../../UserContext";
import useFetch from "../../Hooks/useFetch";
import Error from "../Helper/Error";
import Head from "../Helper/Head";

const LoginCreate = () => {
  const username = useForm("username");
  const password = useForm("password");
  const email = useForm("email");

  const { userLogin } = useUser();
  const { loading, error, request } = useFetch();

  async function handleSubmit(event) {
    event.preventDefault();
    if (username.validate && password.validate() && username.validate()) {
      const { url, options } = USER_POST({
        username: username.value,
        email: email.value,
        password: password.value,
      });
      const { response } = await request(url, options);
      if (response.ok) {
        userLogin(username.value, password.value);
      }
    } else {
      <Error error={error} />;
      return null;
    }
  }
  return (
    <section className="animeLeft">
      <Head title="Crie sua Conta" />
      <h1 className="title">Cadastre-se</h1>
      <form onSubmit={handleSubmit}>
        <Input label="Usuário" type="text" name="username" {...username} />
        <Input label="Email" type="email" name="email" {...email} />
        <Input label="Senha" type="password" name="senha" {...password} />
        {password.value || password.value === "" ? (
          <PasswordStrong>{password.value}</PasswordStrong>
        ) : (
          ""
        )}
        {loading ? (
          <Button disabled>Cadastrarando...</Button>
        ) : (
          <Button>Cadastrar</Button>
        )}
        <Error error={error} />
      </form>
    </section>
  );
};

export default LoginCreate;
