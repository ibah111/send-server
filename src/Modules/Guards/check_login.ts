import axios from 'axios';
import { AuthUser, AuthUserError, AuthUserSuccess } from './auth.guard';
import client from 'src/utils/client';
import server from 'src/utils/server';
export const checkLogin = async (token: string) => {
  if (!token) {
    return false;
  }
  // Тестируем систему................................
  if (client('demo'))
    return !Number.isNaN(token)
      ? ({
          login_result: Boolean(token),
          id: 1465,
          login: 'smorkalov@zakon43.ru',
          firstname: 'Фамилия',
          position: 'Должность',
        } as AuthUserSuccess)
      : ({ login_result: false } as AuthUserError);
  const result = await axios.get<AuthUser<boolean>>(
    server('oauth') + '/oauth/login',
    { headers: { token } },
  );
  if (result.data === undefined || result.data === null) {
    return false;
  } else {
    if (result.data.login_result === true) {
      return result.data as AuthUserSuccess;
    } else {
      return result.data as AuthUserError;
    }
  }
};
