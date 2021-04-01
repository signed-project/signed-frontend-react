import React, { useEffect, useState } from 'react';


const NewPost = ({ toggleTheme }) => {

  useEffect(() => {
    toggleTheme(false);
  }, [toggleTheme]);

  return (
    <>
      <h1 style={{ height: '3000px' }}>NewPost</h1>
    </>
  );
};

export default NewPost;
