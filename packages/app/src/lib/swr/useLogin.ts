import useSWR from 'swr';

const URL = '';

interface LoginArgs {
  email: string;
  password: string;
}

export const useLogin = (loginData: LoginArgs) => {
  console.log('received data', loginData);

  const { data, error } = useSWR('login');
};
