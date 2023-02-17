import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { useCallback, useReducer } from 'react';
import { Reducer } from 'react';
import useAxiosInterceptors from './useAxiosInterceptors';

interface GetArgs {
  url: string;
  queryParams?: { [key: string]: string };
  accessToken?: string;
}

interface PostArgs<T = undefined> {
  url: string;
  body?: T;
  accessToken?: string;
}

interface DeleteArgs {
  url: string;
  accessToken?: string;
}

export const get = async <T>(
  args: GetArgs,
): Promise<{ data: T; status: number }> => {
  const { accessToken } = args;

  const requestUrl = new URL(args.url);
  const url = requestUrl.href;

  try {
    const { data, status } = await axios.get<T>(url, {
      headers: accessToken
        ? {
            Authorization: `EXPENXY ${accessToken}`,
          }
        : {},
      params: args.queryParams ? args.queryParams : '',
    });

    return { data, status };
  } catch (error) {
    console.log(error);
    throw new Error('Error GET');
  }
};

export const post = async <TRequest, TResponse>(
  args: PostArgs<TRequest>,
): Promise<TResponse> => {
  const { accessToken, body } = args;

  const requestUrl = new URL(args.url);
  const url = requestUrl.href;

  try {
    const { data, status } = await axios.post<TResponse>(url, body, {
      headers: accessToken
        ? {
            Authorization: `EXPENXY ${accessToken}`,
          }
        : {},
    });

    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Error POST');
  }
};

export const deleteRequest = async <TResponse>(
  args: DeleteArgs,
): Promise<void> => {
  const { accessToken } = args;

  const requestUrl = new URL(args.url);
  const url = requestUrl.href;

  try {
    const { data, status } = await axios.delete<TResponse>(url, {
      headers: accessToken
        ? {
            Authorization: `EXPENXY ${accessToken}`,
          }
        : {},
    });
  } catch (error) {
    console.log(error);
    throw new Error('Error Delete');
  }
};

interface IRequestConfig {
  url: string;
  method: 'POST' | 'GET' | 'PUT' | 'PATCH';
  body?: object;
  headers?: object;
  withCredentials?: boolean;
}

interface IState {
  isLoading: boolean;
  data: string[] | [];
  error: null | {
    message?: string;
    fieldErrors?: {
      [key: string]: string[];
    };
    data?: string[];
    status?: number;
  };
}

enum ActionTypes {
  SEND = 'SEND',
  RESPONSE = 'RESPONSE',
  ERROR = 'ERROR',
}

interface IAction {
  type: ActionTypes;
  payload?:
    | string[]
    | {
        message: string;
        status?: number;
        error?: string[] | string;
      };
}

const initialState: IState = {
  data: [],
  error: null,
  isLoading: false,
};

const apiReducer = (state: IState, action: IAction): any => {
  console.log('useAxiosInterceptors received', state, action);
  const { payload, type } = action;

  switch (type) {
    case ActionTypes.SEND:
      return {
        ...state,
        isLoading: true,
      };

    case ActionTypes.RESPONSE:
      return {
        ...state,
        isLoading: false,
        data: payload,
      };

    case ActionTypes.ERROR:
      return {
        ...state,
        isLoading: false,
        error: payload,
      };
  }
};

export const useHttpRequest = () => {
  const axiosPrivate = useAxiosInterceptors();
  const [state, dispatch] = useReducer<Reducer<IState, IAction>>(
    apiReducer,
    initialState,
  );

  const sendRequest = useCallback(
    async (config: IRequestConfig): Promise<AxiosResponse | void> => {
      const { body, headers, method, url, withCredentials } = config;

      try {
        dispatch({ type: ActionTypes.SEND });
        const response = await axiosPrivate({
          method: method ? method : 'GET',
          url,
          data: body,
          headers: headers ? headers : {},
          withCredentials: withCredentials ? withCredentials : false,
        });

        console.log('response hook', response);

        // setTimeout(() => {
        dispatch({
          type: ActionTypes.RESPONSE,
          payload: response.data,
        });
        // }, 10000);

        return response.data;
      } catch (error) {
        const customError: any = error;
        console.log('error useHttpRequest', customError.response);

        // setTimeout(() => {
        dispatch({
          type: ActionTypes.ERROR,
          payload: {
            status: customError?.response.status || 500,
            message: customError?.response.data.message,
            ...customError?.response.data.error,
          },
        });
        // }, 10000);
      }
    },
    [],
  );

  return {
    sendRequest,
    isLoading: state.isLoading,
    error: state.error,
  };
};
