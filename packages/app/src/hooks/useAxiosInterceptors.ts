import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import { selectAccessToken } from '../store/User/index.selector';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import axiosPrivate from '../api/axios';

const useAxiosInterceptors = () => {
  const refresh = useRefreshToken();
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use((config: any) => {
      if (!config.headers['Authorization'] || !config.headers['authorization']) {
        // Attach the access token from the current state
        config.headers['Authorization'] = `EXPENXY ${accessToken}`;
      }

      return config;
    });

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: any) => {
        // maybe acc token has expired here
        const prevRequest = error?.config;
        if (error.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `EXPENXY ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        } else if (error?.response?.status === 401 && !prevRequest?.sent) {
          const { message } = error?.response.data;

          if (message === 'Unauthorized') {
            console.log('Received 401 Unauthorized from backend, redirect to login');
            // throw error;
            navigate('/login');
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept);
      axiosPrivate.interceptors.request.eject(requestIntercept);
    };
  }, [refresh, accessToken]);

  return axiosPrivate;
};

export default useAxiosInterceptors;
