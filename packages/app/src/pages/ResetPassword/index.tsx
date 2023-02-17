import { ResetPasswordProps, resetPwSchema } from './schema';
import { useCallback, useEffect, useState } from 'react';
import { Key, ArrowLeft } from 'phosphor-react';
import { Input } from '../../components/Input';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHttpRequest } from '../../hooks/useHttp';
import ResetPasswordLayout from '../../components/Layouts/ResetPasswordLayout';
import Modal from '../../components/UI/Modal';
import { PulseLoader } from 'react-spinners';
import { setResetPwToken } from '../../store/User/index.slice';
import { useAppDispatch } from '../../store/hooks';

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    getValues,
  } = useForm<ResetPasswordProps>({
    resolver: zodResolver(resetPwSchema),
    mode: 'onSubmit',
  });
  const { error, isLoading, sendRequest } = useHttpRequest();

  useEffect(() => {
    console.log('error useEffect', error);
    if (error) {
      const { message } = error;
      if (message === 'No user found') {
        setShowModal({
          show: true,
          message: 'No account associated with this email',
        });
        reset();
      } else {
        setShowModal({
          show: true,
          message: 'Something went wrong, please try again later',
        });
        reset();
      }
    }
  }, [error]);

  const onSubmit: SubmitHandler<ResetPasswordProps> = async (data) => {
    const response = await sendRequest({
      method: 'POST',
      url: '/reset',
      body: {
        email: data.email,
      },
      withCredentials: true,
    });

    if (response?.data) {
      const { token } = response.data;
      if (token) {
        const email = getValues('email');
        console.log('email', email);
        dispatch(setResetPwToken({ resetPwToken: token }));
        setTimeout(() => {
          navigate('/reset/sent', {
            state: {
              email: email,
            },
          });
        }, 1500);
      }
    }
  };

  const redirectToLogin = useCallback(() => {
    navigate('/login');
  }, []);

  return (
    <ResetPasswordLayout
      headerTitle="Forgot password?"
      description={"No worries, we'll send you reset instructions."}
      headerIcon={<Key className="w-9 h-9 p-1 text-black rounded-full" />}
    >
      {error && showModal.show && (
        <Modal
          show={showModal.show}
          title="Ooops!"
          message={showModal.message}
          onConfirm={() => setShowModal({ message: '', show: false })}
        />
      )}

      <form
        className="flex flex-col mt-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className="mb-1" htmlFor="email">
          Email
        </label>
        <Input
          className="border border-gray-400 rounded-md px-2 py-1 bg-transparent text-black focus:outline-none active:outline-none text-base"
          {...register('email')}
          type="text"
          id="email"
          required
          placeholder="Enter your email"
          error={errors.email?.message}
        />
        <button
          className="flex items-center justify-center mt-4 p-2 border-0  w-full text-black font-bold bg-yellow-300 rounded-md focus:outline-none active:outline-none "
          disabled={isLoading || showModal.show}
        >
          {!isLoading ? 'Reset Password' : <PulseLoader color="#1f1f1f" />}
        </button>
      </form>
      <div
        className="flex w-full items-center justify-center gap-2 mt-6 cursor-pointer"
        onClick={redirectToLogin}
      >
        <ArrowLeft className="text-gray-500" />
        <p className="text-sm text-gray-500">Back To Log In</p>
      </div>
    </ResetPasswordLayout>
  );
};

export default ResetPassword;
