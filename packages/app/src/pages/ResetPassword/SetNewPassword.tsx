import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResetPasswordLayout from '../../components/Layouts/ResetPasswordLayout';
import { useHttpRequest } from '../../hooks/useHttp';
import { ArrowLeft, Key } from 'phosphor-react';
import Modal from '../../components/UI/Modal';
import { Input } from '../../components/Input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PulseLoader } from 'react-spinners';
import { setNewPasswordSchema, SetNewPasswordProps } from './schema';

const SetNewPassword = () => {
  const [showModal, setShowModal] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });
  const { error, isLoading, sendRequest } = useHttpRequest();
  const { token } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    reset,
  } = useForm<SetNewPasswordProps>({
    resolver: zodResolver(setNewPasswordSchema),
    mode: 'onSubmit',
  });

  const redirectToLogin = useCallback(() => {
    navigate('/login');
  }, []);

  const checkTokenValidity = useCallback(async () => {
    await sendRequest({
      url: `/reset/${token}`,
      method: 'GET',
      withCredentials: false,
    });
  }, []);

  const onSubmit: SubmitHandler<SetNewPasswordProps> = async (data) => {
    console.log('data', data);

    const response = await sendRequest({
      url: '/new-password',
      method: 'POST',
      body: {
        password: getValues('password'),
        confirmPassword: getValues('confirmPassword'),
        token,
      },
    });

    console.log('response', response);
  };

  useEffect(() => {
    if (!token) {
      navigate('/reset');
      return;
    }

    checkTokenValidity();
  }, [token]);

  useEffect(() => {
    if (error) {
      const { message, fieldErrors } = error;

      switch (message) {
        case 'Error validation': {
          if (fieldErrors) {
            for (let idx in fieldErrors) {
              setError(String(idx) as any, {
                message: String(fieldErrors[idx]),
              });
            }
          }
          break;
        }

        case 'No account found based on generated token or token is expired': {
          setShowModal({
            show: true,
            message:
              'No account found based on generated token or token is expired. You will be redirected to reset password',
          });
          reset();
          setTimeout(() => {
            navigate('/reset');
          }, 3000);
          break;
        }

        case 'Invalid request params': {
          setShowModal({
            show: true,
            message: 'Something went wrong. Please contact the administrator',
          });
          break;
        }

        default: {
          setShowModal({
            show: true,
            message: 'Something went wrong. Please contact the administrator',
          });
        }
      }
    }
  }, [error]);

  return (
    <ResetPasswordLayout
      headerTitle="Set new password"
      description="Your new password must be different to the previously used password"
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
        <div className="flex flex-col items-start justify-center">
          <label className="mb-1" htmlFor="password">
            Password
          </label>
          <Input
            className="w-full border border-gray-400 rounded-md px-2 py-1 bg-transparent text-black focus:outline-none active:outline-none text-base"
            {...register('password')}
            type="password"
            id="password"
            required
            error={errors.password?.message}
          />
        </div>
        <div className="flex flex-col items-start justify-center">
          <label className="mb-1" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <Input
            className="w-full border border-gray-400 rounded-md px-2 py-1 bg-transparent text-black focus:outline-none active:outline-none text-base"
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            required
            error={errors.confirmPassword?.message}
          />
        </div>
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

export default SetNewPassword;
