import { useEffect } from 'react';
import axiosCustom from '../api/axios';
import useRefreshToken from './useRefreshToken';
import { selectAccessToken } from '../store/User/index.selector';
import { useSelector } from 'react-redux';

const useAxiosInterceptors = () => {
  const refreshToken = '';
  const accessToken = useSelector(selectAccessToken);

  console.log('accessToken', accessToken);

  useEffect(() => {
    const requestIntercept = axiosCustom.interceptors.request.use(
      (config: any) => {
        if (!(config.headers.Authorization || config.headers.authorization)) {
          console.log(
            'suntem in requestIntercept?? si punem urm accessToken',
            accessToken,
          );
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
        const prevRequest = error.config;

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          console.log('suntem aici ???');
          prevRequest.sent = true;
          const newAccessToken = await useRefreshToken();
          console.log('newAccessToken', newAccessToken);
          prevRequest.headers = {
            ...prevRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };
          return axiosCustom(prevRequest);
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
