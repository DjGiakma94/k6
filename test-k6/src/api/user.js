import http from "k6/http";
import {sleep, check, group} from "k6";
import {URL} from "https://jslib.k6.io/url/1.0.0/index.js";
const ENV = JSON.parse(open("./../../resources/env.json")).dev;

const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

export function postUser(body) {
    let response = http.post(
      `${ENV.base_path}/${ENV.user}`,
      JSON.stringify(body),
      params
    );
  
    return check(response, {
      "response code was 200": (resp) => resp.status == 200,
      'body size was minor of 123434 bytes': (res) => res.body.length < 123434,
    });
  }
  
export  function getUser(username) {
    const response = http.get(`${ENV.base_path}/${ENV.user}/${username}`, params);
  
    return check(response, {
      "response code was 200": (res) => res.status == 200,
      "body size was bigger 2 bytes": (res) => res.body.length > 2,
    });
  }
  
export  function deleteUserById(username) {
    
    let response = http.del(`${ENV.base_path}/${ENV.user}/${username}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    return check(response, {
      "response code was 200": (res) => res.status == 200,
      'body size was minor of 123434 bytes': (res) => res.body.length < 123434,
    });
  }
  
export  function loginUser() {
    let login = new URL(`${ENV.base_path}/${ENV.user}/login`);
  
    login.searchParams.append("username", "string2");
    login.searchParams.append("password", "string");
  
    const resp = http.get(login.toString(), params);
    return check(resp, {
      "response code was 200": (res) => res.status == 200,
    });
  }
  
export  function logoutUser() {
    let logout = new URL(`${ENV.base_path}/${ENV.user}/logout`);
  
    const resp = http.get(logout.toString(), params);
    return check(resp, {
      "response code was 200": (res) => res.status == 200,
      "body size was bigger 2 bytes": (res) => res.body.length > 2,
    });
  }
  
export  function createUserWithArray(body) {
    let response = http.post(
      `${ENV.base_path}/${ENV.user}/createWithArray`,
      JSON.stringify(body),
      params
    );
  
    return check(response, {
      "response code was 200": (resp) => resp.status == 200,
    });
  }
  
export  function createUserWithList(body) {
    let response = http.post(
      `${ENV.base_path}/${ENV.user}/createWithList`,
      JSON.stringify(body),
      params
    );
  
    return check(response, {
      "response code was 200": (resp) => resp.status == 200,
    });
  }