import { useEffect } from 'react';
import axiosCustom from '../api/axios';
import useRefreshToken from './useRefreshToken';
import { selectAccessToken } from '../store/User/index.selector';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const useAxiosInterceptors = () => {
  const refreshToken = '';
  const accessToken = useSelector(selectAccessToken);
  const navigate = useNavigate();

  useEffect(() => {
    const requestIntercept = axiosCustom.interceptors.request.use(
      (config: any) => {
        if (!(config.headers.Authorization || config.headers.authorization)) {
          config.headers = {
            ...config.headers,
            Authorization: `EXPENXY ${accessToken}`,
          };
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosCustom.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log('error response interceptor', error);
        const prevRequest = error.config;

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await useRefreshToken();
          prevRequest.headers = {
            ...prevRequest.headers,
            Authorization: `EXPENXY ${newAccessToken}`,
          };
          return axiosCustom(prevRequest);
        } else if (error?.response?.status === 401 && !prevRequest.sent) {
          const { message } = error?.response.data;

          if (message === 'Unauthorized') {
            console.log(
              'Status 401 and Unauthorized in response interceptor, redirect to login',
            );
            navigate('/login');
          }
        } else if (error?.response?.status === 404 && !prevRequest?.sent) {
          throw error;
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosCustom.interceptors.request.eject(requestIntercept);
      axiosCustom.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshToken]);

  return axiosCustom;
};

export default useAxiosInterceptors;
