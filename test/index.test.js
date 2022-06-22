const assert = require("assert");
const { check } = require("../index.js");

const sortedArray = [
  "f319",
  "46ec",
  "c1c7",
  "3720",
  "c7df",
  "c4ea",
  "4e3e",
  "80fd",
];
let checkResult = [];

beforeEach(async () => {
  checkResult = await check(
    ["f319", "3720", "4e3e", "46ec", "c7df", "c1c7", "80fd", "c4ea"],
    "b93ac073-eae4-405d-b4ef-bb82e0036a1d"
  );
});

describe("check", () => {
  it("Validates if the check function works", () => {
    assert.deepEqual(sortedArray, checkResult);
  });
});
