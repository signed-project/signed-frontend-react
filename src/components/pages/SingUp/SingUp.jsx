import React, { useEffect, useState } from 'react';


const SingUp = ({ toggleTheme }) => {

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  return (
    <>
      <h1>sing up</h1>
    </>
  );
};

export default SingUp;
