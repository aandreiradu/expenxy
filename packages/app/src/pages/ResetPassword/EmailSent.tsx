import React, { useCallback, useEffect } from 'react';
import ResetPasswordLayout from '../../components/Layouts/ResetPasswordLayout';
import { Envelope, ArrowLeft } from 'phosphor-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectResetToken } from '../../store/User/index.selector';
import { useSelector } from 'react-redux';

const EmailSent = () => {
  const resetPwToken = useSelector(selectResetToken);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email || null;

  const redirectToLogin = useCallback(() => {
    navigate('/login');
  }, []);

  useEffect(() => {
    if (!resetPwToken) {
      navigate('/reset');
    }
  }, [resetPwToken]);

  return (
    <ResetPasswordLayout
      headerTitle="Check your email"
      description={`We sent a password reset link to ${email}`}
      headerIcon={<Envelope className="w-9 h-9 p-1 text-black rounded-full" />}
    >
      <span className="mt-4 text-sm text-gray-500">Didn't received the email? Click to resend</span>
      <div className="flex w-full items-center justify-center gap-2 mt-6 cursor-pointer" onClick={redirectToLogin}>
        <ArrowLeft className="text-gray-500" />
        <p className="text-sm text-gray-500">Back To Log In</p>
      </div>
    </ResetPasswordLayout>
  );
};

export default EmailSent;
