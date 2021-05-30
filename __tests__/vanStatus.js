const { response } = require("express");
const request = require("supertest");

// Getting the vendor app
const app = require("../Vendor-Backend/index");

/*

Test Suite for testing the van opening and closing functionality

*/

describe("Integration test: Van status update", () => {
  // Test case 1: Opening the van

  // Store the auth token
  token =
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiVGVzdCBWZW5kb3IiLCJwYXNzd29yZCI6IjEyMzQ1NjdFIiwidGltZXN0YW1wIjoiMjAyMS0wNS0zMFQxMDo0MTo0Ny4zNDhaIn0.txMkF188CyDWrFSHguh3fq_ENy1oWLNkRsKEv8FMAGs";

  test("Test 1 (Update status to open)", () => {
    return request(app)
      .post("/api/vendor/open")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "6094bc1c1f5f5250c8f2bcaf",
        address: "700 Carlton Street",
        location: {
          longitude: 123.123,
          latitude: 123.321,
        },
      })
      .then((response) => {
        // Check the HTTP status code
        expect(response.statusCode).toBe(200);
        // Check that the database has been updated
        expect(response.body.open).toBe(true);
      });
  });

  // Test 2: Closing of the van
  test("Test 2 (Update status to close)", () => {
    return request(app)
      .post("/api/vendor/close")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        // Check the HTTP status code
        expect(response.statusCode).toBe(200);
        // Check that the database has been updated
        expect(response.body.open).toBe(false);
        // Check the location
        expect(response.body.position).toBeUndefined();
      });
  });
});
