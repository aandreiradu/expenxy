import { useAppDispatch } from '../store/hooks';
import { setAccessToken, setAuthData } from '../store/User/index.slice';
import axios from '../api/axios';
import { useDispatch } from 'react-redux';

type TSuccessRefreshResponse = {
  data: {
    accessToken: string;
    username: string;
  };
};

type TFailedRefreshResponse = {};

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    const response = await axios.get<TSuccessRefreshResponse>('/refresh', {
      withCredentials: true,
    });

    // console.log('response refresh method from useRefreshToken', response);
    const { accessToken, username } = response.data.data;

    console.log('received this from backend', accessToken);

    if (accessToken) {
      dispatch(setAuthData({ accessToken, username }));
    }

    return accessToken;
  };

  return refresh;
};

export default useRefreshToken;
