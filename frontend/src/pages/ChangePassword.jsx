import React from 'react';
import { useSelector } from 'react-redux';
import PasswordResetFlow from '../components/auth/PasswordResetFlow';

const ChangePassword = () => {
  const { user } = useSelector((store) => store.user);

  return <PasswordResetFlow defaultEmail={user?.email || ''} portalMode />;
};

export default ChangePassword;
