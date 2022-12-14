import http from "k6/http";
import {sleep, check, group} from "k6";
import {URL} from "https://jslib.k6.io/url/1.0.0/index.js";
const ENV = JSON.parse(open("./../../resources/env.json")).dev;

const params = {
  headers: {
    "Content-Type": "application/json",
  },
};

export function getCast(id) {
  return check(http.get(`${ENV.cast_path}/${id}`, params), {
    "response code was 200": (res) => res.status == 200,
  });
}

export function postCast(body) {
  return check(
    http.post(`${ENV.cast_path}`, JSON.stringify(body), params),
    {"response code was 201": (res) => {
      res.status == 201
      console.log(res.body)
    }
  }
  );
}

export function deleteCastById(id) {
  let response = http.del(`${ENV.cast_path}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return check(response, {
    "response code was 200": (res) => res.status == 200,
  });
}