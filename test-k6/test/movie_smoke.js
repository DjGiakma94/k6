import { reportHTML } from "https://raw.githubusercontent.com/fziviello/k6-report-html/main/dist/reportHtml.min.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { describe } from "https://jslib.k6.io/k6chaijs/4.3.4.2/index.js";
import { smoke } from "./../src/testType.js";
import { getMovie, postMovie, updateMovie, deleteMovieById } from "./../src/api/movie.js";



const dataMovie = JSON.parse(open("./../resources/dataPreparation.json")).movie;
const dataCast = JSON.parse(open("./../resources/dataPreparation.json")).cast;

const typeTest = smoke();

export const options = {
    stages: typeTest.stages,
    vus: typeTest.vus,
    thresholds: typeTest.thresholds,
};

export function setup() { }

export default function () {

    describe("CREATE Cast", () => {
        postCast(dataCast.createCast);
    });
    describe("GET Cast", () => {
        getCast(1);
    });
    describe("DELETE Cast", () => {
        deleteCastById(1);
    });
    describe("CREATE Movie", () => {
        postMovie(dataMovie.createMovie);
    });
    describe("GET Movie", () => {
        getMovie(1);
    });
    describe("UPDATE Movie", () => {
        updateMovie(dataMovie.updateMovie, 1);
    });
    describe("DELETE Movie", () => {
        deleteMovieById(1);
    });
}

export function teardown(data) { }

export function handleSummary(data) {
    return {
        "./reports/stress.html": reportHTML(data, { title: "Stress Test" }),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };

}