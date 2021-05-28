const { response } = require("express");
const request = require("supertest");

// Getting the vendor app
const app = require("../Vendor-Backend/index");

/*

Test Suite for testing the van opening and closing functionality

*/

describe("Integration Test: Van unfulfilled order", () => {
  // Store the auth token
  let token = "73bahsbwy4";
  let agent = request.agent(app);

  test("Test 1 (Getting the list of orders)", () => {
    return agent
      .get("/api/vendor/orders")
      .set("Authorization", `Bearer ${token}`)
      .then((response) => {
        // Check HTTP Status
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeTruthy();
      });
  });
});

describe("Integration test: Van status update", () => {
  // Test case 1: Opening the van

  // Store the auth token
  token = "73bahsbwy4";

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
});
