import http from "k6/http";
import {sleep, check, group} from "k6";
const ENV = JSON.parse(open("./../../resources/env.json")).dev;

const params = {
  headers: {
    "Content-Type": "application/json",
  },
};

export function getOrder(id) {
    return check(http.get(`${ENV.base_path}/${ENV.store}/order/${id}`, params), {
      "response code was 200": (res) => res.status == 200,
    });
  }

export function postOrder(body) {
  return check(http.post(`${ENV.base_path}/${ENV.store}/order`, JSON.stringify(body), params),
  {"response code was 200": (res) => res.status == 200}
  );
}

export function deleteOrderById(id) {
  let response = http.del(`${ENV.base_path}/${ENV.store}/order/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return check(response, {
    "response code was 200": (res) => res.status == 200,
    'body size was bigger 2 bytes': (res) => res.body.length > 2,
  });
}

export function getInventory() {
  let response = http.get(`${ENV.base_path}/${ENV.store}/inventory`, params);

  return check(response, {
    "response code was 200": (res) => res.status == 200,
    'body size was minor of 123434 bytes': (res) => res.body.length < 123434,
  });
}
