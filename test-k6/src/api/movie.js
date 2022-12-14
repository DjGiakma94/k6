import http from "k6/http";
import {sleep, check, group} from "k6";
import {URL} from "https://jslib.k6.io/url/1.0.0/index.js";
const ENV = JSON.parse(open("./../../resources/env.json")).dev;

const params = {
  headers: {
    "Content-Type": "application/json",
  },
};

export function getMovie(id) {
  return check(http.get(`${ENV.movie_path}/${id}`, params), {
    "response code was 200": (res) => res.status == 200,
  });
}

export function postMovie(body) {
  return check(
    http.post(`${ENV.movie_path}`, JSON.stringify(body), params),
    {"response code was 201": (res) => {
      res.status == 201
      console.log(res.body)
    }
  }
  );
}

export function updateMovie(body, id) {
  return check(
    http.post(`${ENV.movie_path}/${id}`, JSON.stringify(body), params),
    {
      "response code was 200": (res) => res.status == 200,
      "body_createMovie is not null": (resp) => resp.json(body) !== "",
    }
  );
}


export function deleteMovieById(id) {
  let response = http.del(`${ENV.movie_path}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return check(response, {
    "response code was 200": (res) => res.status == 200,
  });
}