import { DiscordLogo } from 'phosphor-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/Layouts/AuthLayout';
import { Input } from '../../components/Input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterProps } from './schema';
import { useHttpRequest } from '../../hooks/useHttp';
import { useEffect, useState } from 'react';
import Modal from '../../components/UI/Modal';
import { PulseLoader } from 'react-spinners';
import statsAndMaps from '../../config/statusAndMessagesMap';
import { Check } from 'phosphor-react';
import TopLevelNotification from '../../components/UI/TopLevelNotification';

const title = 'Your Finances In One Place';
const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, fuga!';

type ValidationErrors = {
  username: 'username';
  password: 'password';
  confirmPassword: 'confirmPassword';
  email: 'email';
};

const Register = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const { error, isLoading, sendRequest } = useHttpRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<RegisterProps>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
  });
  const [topLevelNotification, setTopLevelNotification] = useState({
    show: false,
    message: '',
    icon: <></>,
  });

  const onSubmit: SubmitHandler<RegisterProps> = async (data) => {
    console.log('data', data);

    const response = await sendRequest({
      method: 'POST',
      url: '/register',
      withCredentials: false,
      body: {
        username: data.username,
        password: data.password,
        email: data.email,
      },
    });

    if (response?.data) {
      const { message } = response.data;
      if (message === statsAndMaps['accountCreatedSuccessfully']?.message) {
        const frontendMessage = statsAndMaps['accountCreatedSuccessfully']?.frontendMessage;
        frontendMessage &&
          setTopLevelNotification({
            show: true,
            message: frontendMessage,
            icon: <Check className="w-14 h-8 text-green-400" />,
          });

        reset();
        setTimeout(() => {
          return navigate('/login');
        }, 5500);
      }
    }
  };

  useEffect(() => {
    if (error) {
      console.log('@@@error register', error);
      const { message, fieldErrors } = error;

      if (message === 'Error validation') {
        console.log('error hmm?', error);
        console.log('fieldErrors', fieldErrors);
        if (fieldErrors && Object.keys(fieldErrors).length > 0) {
          for (let idx in fieldErrors) {
            setError(String(idx) as any, { message: String(fieldErrors[idx]) });
          }
        }
      } else {
        setShowModal(true);
      }
    }

    return () => {
      setShowModal(false);
    };
  }, [error]);

  return (
    <AuthLayout title={title} description={description}>
      {/* Show Error Modal */}
      {error && showModal && (
        <Modal
          hasConfirm={false}
          onConfirm={() => setShowModal(false)}
          onClose={() => {}}
          show={showModal}
          title={'Ooops'}
          message={error.message}
        />
      )}

      {/* Shop Top Level Notification */}
      {topLevelNotification.show && (
        <TopLevelNotification
          hasCloseButton={false}
          dismissAfterXMs={5500}
          message={topLevelNotification.message}
          show={topLevelNotification.show}
          onClose={() =>
            setTopLevelNotification({
              show: false,
              message: '',
              icon: <></>,
            })
          }
          icon={topLevelNotification.icon}
        />
      )}

      {/* Shop Top Level Notification */}
      {topLevelNotification.show && (
        <TopLevelNotification
          hasCloseButton={false}
          dismissAfterXMs={5500}
          message={topLevelNotification.message}
          show={topLevelNotification.show}
          onClose={() =>
            setTopLevelNotification({
              show: false,
              message: '',
              icon: <></>,
            })
          }
          icon={topLevelNotification.icon}
        />
      )}

      <h1 className="text-3xl  font-bold">Welcome to EXPENXY</h1>
      <span className="text-base  py-2">Register your account</span>
      <form id="register" onSubmit={handleSubmit(onSubmit)} className="flex flex-col  space-y-10 w-full mt-3">
        <div className="relative z-0">
          <Input
            id="username"
            {...register('username')}
            className={`block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer
              ${errors.username?.message && 'border-red-500'}
            `}
            placeholder=" "
            autoComplete="false"
            spellCheck="false"
            label="Username"
            error={
              errors.username?.message //|| validationError['username']?.message
            }
            required
          />
        </div>
        <div className="relative z-0">
          <Input
            id="email"
            {...register('email')}
            className={`block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer
              ${errors.email?.message && 'border-red-500'}
            `}
            placeholder=" "
            autoComplete="false"
            spellCheck="false"
            label="Email"
            error={errors.email?.message}
            required
          />
        </div>

        <div className="relative z-0">
          <Input
            id="password"
            {...register('password')}
            type="password"
            className={`block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer
              ${errors.password?.message && 'border-red-500'}
            `}
            placeholder=" "
            autoComplete="false"
            spellCheck="false"
            label="Password"
            error={errors.password?.message}
            required
          />
        </div>
        <div className="relative z-0">
          <Input
            id="confirmPassword"
            {...register('confirmPassword')}
            type="password"
            className="block py-2.5 px-0 w-full text-base text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-[#7289DA] focus:outline-none focus:ring-0 focus:border-[#7289DA] peer"
            placeholder=" "
            autoComplete="false"
            spellCheck="false"
            label="Confirm Password"
            error={errors.confirmPassword?.message}
            required
          />
        </div>
        <span className="text-sm ml-auto text-yellow-500 mt-6 cursor-pointer">Forgot your password</span>
        <button
          form="register"
          className="disabled:cursor-not-allowed disabled:pointer-events-none w-full bg-[#1f1f1f] mt-7 p-3 rounded-md text-lg uppercase hover:bg-white hover:text-[#1f1f1f] focus:bg-white focus:text-[#1f1f1f] focus:outline-none transition-all duration-100 ease-in"
        >
          {!isLoading ? 'Register' : <PulseLoader color="#1f1f1f" />}
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
        Already have an account?{' '}
        <Link className="text-yellow-500" to={'/login'}>
          Login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
