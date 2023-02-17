import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import { selectAccessToken } from '../../store/User/index.slice';
import useRefreshToken from '../../hooks/useRefreshToken';

import axios from 'axios';

type TAxiosError = {
  message: string;
  data?: string[];
};

const Persist = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const refresh = useRefreshToken();
  const navigate = useNavigate();
  const isAuth = useSelector(selectAccessToken);

  useEffect(() => {
    console.log('Persist effect run');
    let isMounted = true;

    const checkRefreshToken = async () => {
      console.log('running checkRefreshToken');
      try {
        await refresh();
      } catch (error) {
        console.error('error checkRefreshToken', error);
        if (axios.isAxiosError(error)) {
          const { message }: TAxiosError = error.response?.data;
          if (message === 'Unauthorized') {
            return navigate('/login');
          }
        }
        return navigate('/login');
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !isAuth ? checkRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  return <>{isLoading ? 'Loading...' : <Outlet />}</>;
};

export default Persist;
