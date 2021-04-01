import React, { useEffect, useState } from 'react';


const Profile = ({ toggleTheme }) => {

  useEffect(() => {
    toggleTheme(true);
  }, [toggleTheme]);

  return (
    <>
      <h1 style={{ height: '3000px' }}>Profile</h1>
    </>
  );
};

export default Profile;
