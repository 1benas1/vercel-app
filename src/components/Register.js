import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const Register = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <SignUp />
    </div>
  );
};

export default Register;