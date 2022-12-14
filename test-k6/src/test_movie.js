import http from "k6/http";
import { sleep, check, group } from "k6";
import { Trend } from "k6/metrics";
import { URL } from "https://jslib.k6.io/url/1.0.0/index.js";
import { FormData } from "https://jslib.k6.io/formdata/0.0.2/index.js";
import { reportHTML } from "https://raw.githubusercontent.com/fziviello/k6-report-html/main/dist/reportHtml.min.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.2/index.js';


const ENV = JSON.parse(open("./../resources/env.json")).dev;
const dataPreparation = JSON.parse(
  open("./../resources/dataPreparation.json")
).pet;

const oneCustomMetric = new Trend("oneCustomMetric", true);
const txt = open("./text.txt");
const img1 = open("./image1.jpg", "b");

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
    group_duration: ["avg<800"],
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
  describe("create movie", () => {
    postMovie();
  });
  group("GET Movie", () => {
    getMovie(data.id);
  });
  group("UPDATE Movie", () => {
    updateMovie();
  });
  group("deleteMovie", () => {
    deleteMovieById(data.id);
  });

  sleep(1);
}

export function teardown(data) {
    check(data, {
      "Id is correct": (d) => d.id == 2,
    });
}

function getMovie(id) {
  let response = http.get(`${ENV.base_path}/${ENV.pet}/${id}`, params);

  check(response, {
    "response code was 200": (res) => res.status == 200,
  });
}

function postMovie() {
  let response = http.post(
    `${ENV.base_path}/${ENV.pet}`,
    JSON.stringify(dataPreparation.createPet.body),
    params
  );

  expect(response.status, 'response status').to.equal(200);
  expect(response).to.have.validJsonBody();
}

function updateMovie() {
  let response = http.post(
    `${ENV.base_path}/${ENV.pet}`,
    JSON.stringify(dataPreparation.updatePet.body),
    params
  );

  check(response, {
    "response code was 200": (res) => res.status == 200,
    "body_createPet is not null": (resp) =>
      resp.json(dataPreparation.createPet.body) !== "",
  });
  console.log(response.headers)
}

function GetpetfindByStatus() {
  let findByStatus = new URL(`${ENV.base_path}/${ENV.pet}/findByStatus`);

  findByStatus.searchParams.append("status", "avaible");

  const resp = http.get(findByStatus.toString(), params);
  check(resp, {
    "response code was 200": (res) => res.status == 200,
  });
}

function deleteMovieById(id) {
  let response = http.del(`${ENV.base_path}/${ENV.pet}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  check(response, {
    "response code was 200": (res) => res.status == 200,
    //deleteOrderById.body == '{'code':   ,'type':'unknown','message':'Order Not Found'}'
  });
}

function uploadImage(id) {
  const fd = new FormData();
  fd.append("someTextField", "someValue");
  fd.append("images", http.file(img1, "image1.jpg", "image/jpeg"));
  fd.append("text", http.file(txt, "text.txt", "text/plain"));

  const response = http.post(
    `${ENV.base_path}/${ENV.pet}/${id}/uploadImage`,
    fd.body(),
    {
      headers: {
        "Content-Type": "application/json; boundary=" + fd.boundary,
      },
    }
  );
  check(response, {
    "is status 415": (res) => res.status === 415,
    'body size was minor of 123434 bytes': (res) => res.body.length < 123434,
  });
}

export function handleSummary(data) {
  return {
    "report.html": reportHTML(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
