import http from "k6/http";
import { sleep, check, group } from "k6";
import { Trend } from "k6/metrics";
import { reportHTML } from "https://raw.githubusercontent.com/fziviello/k6-report-html/main/dist/reportHtml.min.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const ENV = JSON.parse(open("./../resources/env.json")).dev;
const dataPreparation = JSON.parse(
  open("./../resources/dataPreparation.json")
).store;

const oneCustomMetric = new Trend("oneCustomMetric", true);

export const options = {
  stages: [{ duration: "2s", target: 1 }],
  vus: 1,
  thresholds: {
    oneCustomMetric: ["p(95) < 200"],
    http_req_blocked: ["min<100", "max > 0"],
    http_req_duration: ["avg<200"], // 95% of requests should be below 200ms
    http_req_waiting: ["max>100"],
    http_req_sending: ["p(90)<500"],
    http_req_receiving: ["med<300", "max > 0"],
    http_req_connecting: ["avg > 0", "max > 0"],
    http_req_tls_handshaking: ["max > 0"],
    group_duration: ["avg<200"],
    iteration_duration: ["min<100", "max>100"]
  },
};


const params = {
  headers: {
    "Content-Type": "application/json",
  },
};

export function setup() {
  return { id: 1 };
}

export default function (data) {
  group("postOrder", () => {
    postOrder();
  });
  group("getOrder", () => {
    getOrderById(data.id);
  });
  group("deleteOrder", () => {
    deleteOrderById(data.id);
  });
  group("getInventory", () => {
    getInventory();
  });

  sleep(1);
}

export function teardown(data) {
  if (data.id != 1) {
    throw new Error("incorrect data: " + JSON.stringify(data));
  }
}

function postOrder() {
  let response = http.post(
    `${ENV.base_path}/${ENV.store}/order`,
    JSON.stringify(dataPreparation.createOrder.body),
    params
  );

  check(response, {
    status_code_createOrder: (resp) => resp.status == 200,
    'body size was minor of 123434 bytes': (res) => res.body.length < 123434,
  });
}

function getOrderById(id) {
  let response = http.get(`${ENV.base_path}/${ENV.store}/order/${id}`, params);

  check(response, {
    "response code was 200": (res) => res.status == 200,
  });
}

function deleteOrderById(id) {
  let response = http.del(`${ENV.base_path}/${ENV.store}/order/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(response, {
    "response code was 200": (res) => res.status == 200,
    'body size was bigger 2 bytes': (res) => res.body.length > 2,
  });
}

function getInventory() {
  let response = http.get(`${ENV.base_path}/${ENV.store}/inventory`, params);

  check(response, {
    "response code was 200": (res) => res.status == 200,
    'body size was minor of 123434 bytes': (res) => res.body.length < 123434,
  });
}


export function handleSummary(data) {
  return {
    "report.html": reportHTML(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}