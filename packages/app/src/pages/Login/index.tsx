const dotenv = import.meta.env['VITE_BACKEND_PORT'];

import { DiscordLogo } from 'phosphor-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Layouts/AuthLayout';
import { Input } from '../../components/Input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginSchema } from './schema';
import { useHttpRequest } from '../../hooks/useHttp';
import { useAppDispatch } from '../../store/hooks';
import { setAccessToken } from '../../store/User/index.slice';
import { useCallback, useEffect, useState } from 'react';
import Modal from '../../components/UI/Modal';
import { PulseLoader } from 'react-spinners';

const title = 'Your Finances In One Place';
const description =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, fuga!';

type ValidationErrors = {
  username: 'username';
  email: 'email';
};

const Login = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sendRequest, error, isLoading } = useHttpRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (error) {
      console.log('@@error login', error);
      const { message, fieldErrors } = error;

      if (message === 'Error validation') {
        if (fieldErrors && Object.keys(fieldErrors).length > 0) {
          for (let idx in fieldErrors) {
            setError(String(idx) as any, { message: String(fieldErrors[idx]) });
          }
        }
      } else {
        console.log('setting here');
        setShowModal(true);
      }
    }

    return () => {
      setShowModal(false);
    };
  }, [error]);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    const response = await sendRequest({
      method: 'POST',
      url: '/login',
      body: {
        usernameOrEmail: data.email,
        password: data.password,
      },
      withCredentials: true,
    });

    if (response?.data) {
      const { accessToken, username } = response.data;

      if (accessToken && username) {
        dispatch(setAccessToken({ accessToken: accessToken }));
        navigate('/');
      }
    }
  };

  const redirectToResetPw = useCallback(() => {
    navigate('/reset');
  }, []);

  return (
    <AuthLayout title={title} description={description}>
      {error && showModal && (
        <Modal
          onConfirm={setShowModal}
          show={showModal}
          title={'Ooops'}
          message={error.message}
        />
      )}

      <h1 className="text-3xl  font-bold">Welcome to EXPENXY</h1>
      <span className="text-base  py-2">Login into your account</span>
      <form
        id="login"
        className="flex flex-col  space-y-10 w-full mt-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="relative z-0">
          <Input
            error={errors?.email?.message}
            {...register('email')}
            type=""
            className="block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer"
            placeholder=" "
            label="Email"
            required
          />
        </div>
        <div className="relative z-0">
          <Input
            {...register('password')}
            type="password"
            className="block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer"
            placeholder=" "
            label={'Password'}
            error={errors.password?.message}
            required
          />
        </div>
        <span
          className="text-sm ml-auto text-yellow-500 mt-6 cursor-pointer"
          onClick={redirectToResetPw}
        >
          Forgot your password
        </span>
        <button
          disabled={Object.keys(errors).length > 0 || isLoading}
          form="login"
          className="disabled:cursor-not-allowed disabled:pointer-events-none w-full bg-[#1f1f1f] mt-7 p-3 rounded-md text-lg uppercase hover:bg-white hover:text-[#1f1f1f] focus:bg-white focus:text-[#1f1f1f] focus:outline-none transition-all duration-100 ease-in"
        >
          {!isLoading ? 'Login' : <PulseLoader color="#1f1f1f" />}
        </button>
      </form>
      <div className="flex items-center justify-start mt-8 gap-3 w-full">
        <span>Sign up with</span>
        <ul className="flex gap-2">
          <li className="p-1 bg-[#1f1f1f] rounded-md cursor-pointer">
            <DiscordLogo className="w-6 h-6" color=" #7289DA" />
          </li>
        </ul>
      </div>
      <p className="mt-10 text-basic">
        Don't have an account?{' '}
        <Link className="text-yellow-500" to={'/register'}>
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
