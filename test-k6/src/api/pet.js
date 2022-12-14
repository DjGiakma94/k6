import http from "k6/http";
import {sleep, check, group} from "k6";
import {URL} from "https://jslib.k6.io/url/1.0.0/index.js";
const ENV = JSON.parse(open("./../../resources/env.json")).dev;

const params = {
  headers: {
    "Content-Type": "application/json",
  },
};

export function getPet(id) {
  return check(http.get(`${ENV.base_path}/${ENV.pet}/${id}`, params), {
    "response code was 200": (res) => res.status == 200,
  });
}

export function postPet(body) {
  return check(
    http.post(`${ENV.base_path}/${ENV.pet}`, JSON.stringify(body), params),
    {"response code was 200": (res) => res.status == 200}
  );
}

export function updatePet(body) {
  return check(
    http.post(`${ENV.base_path}/${ENV.pet}`, JSON.stringify(body), params),
    {
      "response code was 200": (res) => res.status == 200,
      "body_createPet is not null": (resp) => resp.json(body) !== "",
    }
  );
}

export function GetpetfindByStatus() {
  let findByStatus = new URL(`${ENV.base_path}/${ENV.pet}/findByStatus`);

  findByStatus.searchParams.append("status", "avaible");

  const resp = http.get(findByStatus.toString(), params);
  return check(resp, {
    "response code was 200": (res) => res.status == 200,
  });
}

export function deletePetById(id) {
  let response = http.del(`${ENV.base_path}/${ENV.pet}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return check(response, {
    "response code was 200": (res) => res.status == 200,
  });
}
