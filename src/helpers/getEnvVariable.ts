export const getEnvVariables = () => {
  import.meta.env; // aqui importamos el objeto env, que son nuestras variables de entorno
  return {
    ...import.meta.env, // se esparcean las variables de entorno, esto con el fin de que se puedan usar en cualquier parte de la aplicacion
  };
};
