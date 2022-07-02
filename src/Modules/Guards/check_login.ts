import CryptoJS from 'crypto-js';
import axios from 'axios';
import { AuthUserError, AuthUserSuccess } from './auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import client from 'src/utils/client';
const CryptoJSAesJson = {
  stringify: function (cipherParams: CryptoJS.lib.CipherParams) {
    const j: { ct?: string; iv?: string; s?: string } = {
      ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
    };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j);
  },
  parse: function (jsonStr: string) {
    const j = JSON.parse(jsonStr);
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  },
};
export const checkLogin = async (token: string) => {
  if (!token) {
    return false;
  }
  // Тестируем систему................................
  if (client('demo'))
    return !Number.isNaN(token)
      ? {
          login_result: Boolean(token),
          id: 1465,
          login: 'smorkalov@zakon43.ru',
          firstname: 'Фамилия',
          position: 'Должность',
        }
      : { login_result: false };
  let body = {};
  try {
    const encrypted = CryptoJS.enc.Base64.parse(token).toString(
      CryptoJS.enc.Utf8,
    );
    const pass = CryptoJS.SHA512('Irjlf123!').toString();
    body = JSON.parse(
      CryptoJS.AES.decrypt(encrypted, pass, {
        format: CryptoJSAesJson,
      }).toString(CryptoJS.enc.Utf8),
    );
  } catch (err) {
    throw new UnauthorizedException({
      message: 'Не удалось прочитать токен доступа',
      code: 'error_token',
    });
  }
  const result = await axios({
    url: 'https://chat.nbkfinance.ru/scripts/login-api.php',
    method: 'POST',
    params: { ...body },
  });
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
