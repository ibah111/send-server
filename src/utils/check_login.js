import CryptoJS from "crypto-js";
import axios from "axios";
import client from "./client";
const CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
    if (cipherParams.iv) j.iv = cipherParams.iv.toString();
    if (cipherParams.salt) j.s = cipherParams.salt.toString();
    return JSON.stringify(j);
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    });
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
    return cipherParams;
  },
};
export const request = async (token) => {
  // Тестируем систему................................
  if (client("demo")) return { login_result: true, id: token };
  let body = "";
  try {
    const encrypted = CryptoJS.enc.Base64.parse(token).toString(
      CryptoJS.enc.Utf8
    );
    const pass = CryptoJS.SHA512("Irjlf123!").toString();
    body = JSON.parse(
      CryptoJS.AES.decrypt(encrypted, pass, {
        format: CryptoJSAesJson,
      }).toString(CryptoJS.enc.Utf8)
    );
  } catch (err) {}
  const result = await axios({
    url: "https://chat.nbkfinance.ru/scripts/login-api.php",
    method: "POST",
    params: { ...body },
  });
  if (
    result.data === undefined ||
    result.data === null ||
    result.data === "" ||
    result.data.login_result !== true
  ) {
    return false;
  } else {
    return result.data;
  }
};
/**
 * @param {(import("fastify").FastifyRequest} req
 * @param {import("sequelize").Sequelize} sql
 */
export default async (req, sql) => {
  const loged = await request(req?.body?.token);
  if (loged?.login_result) {
    return true;
  } else {
    return false;
  }
};
