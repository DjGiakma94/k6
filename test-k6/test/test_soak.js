import {reportHTML} from "https://raw.githubusercontent.com/fziviello/k6-report-html/main/dist/reportHtml.min.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import {describe} from "https://jslib.k6.io/k6chaijs/4.3.4.2/index.js";
import {soak} from "./../src/testType.js";
import {getPet, postPet, updatePet, GetpetfindByStatus, deletePetById} from "./../src/api/pet.js";
import {getOrder, postOrder, getInventory, deleteOrderById} from "../src/api/store.js";
import { getUser, postUser, deleteUserById, loginUser, logoutUser, createUserWithArray, createUserWithList } from "../src/api/user.js";

const dataPet = JSON.parse(open("./../resources/dataPreparation.json")).pet;
const dataStore = JSON.parse(open("./../resources/dataPreparation.json")).store;
const dataUser = JSON.parse(open("./../resources/dataPreparation.json")).user;

const typeTest = soak();

export const options = {
  stages: typeTest.stages,
  vus: typeTest.vus,
  thresholds: typeTest.thresholds,
};

export function setup() {}

export default function () {
  describe("GET PET", () => {
    getPet(10);
  });
  describe("CREATE PET", () => {
    postPet(dataPet.createPet.body);
  });
  describe("UPDATE PET", () => {
    updatePet(dataPet.updatePet.body);
  });
  describe("GET PET BY STATUS", () => {
    GetpetfindByStatus()
  });
  describe("DELETE PET", () => {
    deletePetById(1);
  });
  describe("GET ORDER", () => {
    getOrder(1);
  });
  describe("CREATE ORDER", () => {
    postOrder(dataStore.createOrder.body);
  });
  describe("DELETE ORDER", () => {
    deleteOrderById(1);
  });
  describe("GET INVENTORY", () => {
    getInventory();
  });
  describe("CREATE USER", () => {
    postUser(dataUser.createUser.body);
  });
  describe("GET USER", () => {
    getUser(2);
  });
  describe("DELETE USER", () => {
    deleteUserById(1);
  });
  describe("LOGIN USER", () => {
    loginUser();
  });
  describe("LOGOUT USER", () => {
    logoutUser();
  });
  describe("CREATE USER WITH ARRAY", () => {
    createUserWithArray(dataUser.createUserWithArray.body);
  });
  describe("CREATE USER WITH LIST", () => {
    createUserWithList(dataUser.createUserWithArray.body);
  });
}

export function teardown(data) {}

export function handleSummary(data) {
  return {
    "./reports/stress.html": reportHTML(data, {title: "Stress Test"}),
    stdout: textSummary(data, {indent: " ", enableColors: true}),
  };

}