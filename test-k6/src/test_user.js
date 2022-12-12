import http from "k6/http";
import { sleep, check, group } from "k6";
import { Trend } from "k6/metrics";
import { URL } from "https://jslib.k6.io/url/1.0.0/index.js";
import { reportHTML } from "https://raw.githubusercontent.com/fziviello/k6-report-html/main/dist/reportHtml.min.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const ENV = JSON.parse(open("./../resources/env.json")).dev;
const dataPreparation = JSON.parse(
  open("./../resources/dataPreparation.json")
).user;

const oneCustomMetric = new Trend("oneCustomMetric", true);

export const options = {
  stages: [{ duration: "2s", target: 1 }],
  vus: 1,
  thresholds: {
    oneCustomMetric: ["p(95) < 200"],
    http_req_blocked: ["min<100", "max > 0"],
    http_req_duration: ["avg<200"],
    http_req_waiting: ["max>100"],
    http_req_sending: ["p(90)<500"],
    http_req_receiving: ["med<300", "max > 0"],
    http_req_connecting: ["avg > 0", "max > 0"],
    http_req_tls_handshaking: ["max > 0"],
    group_duration: ["avg<200"],
    iteration_duration: ["min<100", "max>100"],
  },
};

const params = {
  headers: {
    "Content-Type": "application/json",
  },
};

export function setup() {
  return { username: "string2" };
}

export default function (data) {
  group("postUser", () => {
    postUser();
  });
  group("getUser", () => {
    getUser(data.username);
  });
  group("deleteUser", () => {
    deleteUserById(data.username);
  });
  group("loginUser", () => {
    loginUser();
  });
  group("logoutUser", () => {
    logoutUser();
  });
  group("createWithArray", () => {
    createUserWithArray();
  });
  group("createWithList", () => {
    createUserWithList();
  });
}

export function teardown(data) {
  if (data.username != "string2") {
    throw new Error("incorrect data: " + JSON.stringify(data));
  }
}

function postUser() {
  let response = http.post(
    `${ENV.base_path}/${ENV.user}`,
    JSON.stringify(dataPreparation.createUser.body),
    params
  );

  check(response, {
    "response code was 200": (resp) => resp.status == 200,
    'body size was minor of 123434 bytes': (res) => res.body.length < 123434,
  });
}

function getUser(username) {
  const response = http.get(`${ENV.base_path}/${ENV.user}/${username}`, params);

  check(response, {
    "response code was 200": (res) => res.status == 200,
    "body size was bigger 2 bytes": (res) => res.body.length > 2,
  });
}

function deleteUserById(username) {
  
  let response = http.del(`${ENV.base_path}/${ENV.user}/${username}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(response, {
    "response code was 200": (res) => res.status == 200,
    'body size was minor of 123434 bytes': (res) => res.body.length < 123434,
  });
}

function loginUser() {
  let login = new URL(`${ENV.base_path}/${ENV.user}/login`);

  login.searchParams.append("username", "string2");
  login.searchParams.append("password", "string");

  const resp = http.get(login.toString(), params);
  check(resp, {
    "response code was 200": (res) => res.status == 200,
  });
}

function logoutUser() {
  let logout = new URL(`${ENV.base_path}/${ENV.user}/logout`);

  const resp = http.get(logout.toString(), params);
  check(resp, {
    "response code was 200": (res) => res.status == 200,
    "body size was bigger 2 bytes": (res) => res.body.length > 2,
  });
}

function createUserWithArray() {
  let response = http.post(
    `${ENV.base_path}/${ENV.user}/createWithArray`,
    JSON.stringify(dataPreparation.createUserWithArray.body),
    params
  );

  check(response, {
    "response code was 200": (resp) => resp.status == 200,
  });
}

function createUserWithList() {
  let response = http.post(
    `${ENV.base_path}/${ENV.user}/createWithList`,
    JSON.stringify(dataPreparation.createUserWithArray.body),
    params
  );

  check(response, {
    "response code was 200": (resp) => resp.status == 200,
  });
}

export function handleSummary(data) {
  return {
    "report.html": reportHTML(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
