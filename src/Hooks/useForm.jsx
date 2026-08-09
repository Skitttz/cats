import React from 'react';

const types = {
  username: {
    regex: /.{3,}/,
    message: 'Ops! Digite um pouco mais. 🐾 ',
  },
  displayName: {
    regex: /^.{2,50}$/,
    message: 'Use um nome de exibição entre 2 e 50 caracteres. 🐾',
  },
  email: {
    regex:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: 'Ops! Parece que você não preencheu um e-mail válido. 🐾',
  },
  password: {
    regex: /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%?=*&]).{6,20})/,
    message: '',
  },
  age: {
    regex: /^(?:[0-9]|[1-4][0-9]|50)$/,
    message: 'Ops! Apenas números de 0 a 50 nesse campo. 🐾 ',
  },
  description: {
    regex: /^.{1,255}$/,
    message: 'Ops! Só aceitamos até 255 caracteres. 🐾 ',
  },
};

const useForm = (type) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(null);

  function validate(value) {
    if (type === false) return true;
    if (type === 'age' && isNaN(value)) {
      setError('Digite apenas mi-au-números! 😸🐾');
      return false;
    }
    if (value.length === 0) {
      setError('Não deixe este campo mi-au-so! Preencha-o agora. 😸🐾');
      return false;
    } else if (types[type] && !types[type].regex.test(value)) {
      setError(types[type].message);
      return false;
    } else {
      setError(null);
      return true;
    }
  }

  function onChange({ target }) {
    if (error) validate(target.value);
    setValue(target.value);
  }

  return {
    value,
    setValue,
    onChange,
    error,
    validate: () => validate(value),
    onBlur: () => validate(value),
  };
};

export default useForm;
