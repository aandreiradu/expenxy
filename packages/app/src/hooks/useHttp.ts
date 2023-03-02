import axios, { AxiosResponse } from 'axios';
import { useCallback, useReducer } from 'react';
import { Reducer } from 'react';
import useAxiosInterceptors from './useAxiosInterceptors';

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

interface CustomAxiosResponse extends AxiosResponse {
  message?: string;
  status: number;
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
  const [state, dispatch] = useReducer<Reducer<IState, IAction>>(apiReducer, initialState);

  const sendRequest = useCallback(async (config: IRequestConfig): Promise<CustomAxiosResponse | void> => {
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

      // setTimeout(() => {
      dispatch({
        type: ActionTypes.RESPONSE,
        payload: response.data,
      });
      // }, 5000);

      response.data.status = response.status;
      response.data.status = response.status;
      return response.data;
    } catch (error) {
      const customError: any = error;
      console.log('error useHttp', error);

      dispatch({
        type: ActionTypes.ERROR,
        payload: {
          status: customError?.response.status || 500,
          message: customError?.response.data.message,
          ...customError?.response.data.error,
        },
      });
    }
  }, []);

  return {
    sendRequest,
    isLoading: state.isLoading,
    error: state.error,
  };
};
