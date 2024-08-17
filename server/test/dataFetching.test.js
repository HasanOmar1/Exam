import { expect } from "chai";
import request from "supertest";
import server from "../server.js";
import STATUS_CODE from "../constants/statusCodes.js";

const app = request.agent(server);

describe("Data fetching requests", () => {
  describe("GET Request", () => {
    it('Testing with no query  - Should return "You must provide atleast three URLs"', (done) => {
      app.get("/fetch-metadata").end((err, res) => {
        if (err) done(err);
        expect(res.status).to.equal(STATUS_CODE.BAD_REQUEST);
        expect(res.body).to.be.an("object");
        done();
      });
    });

    it('Testing with one query,  Should return "You must provide atleast three URLs"', (done) => {
      app
        .get(`/fetch-metadata?urls=https://www.facebook.com/`)
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(STATUS_CODE.BAD_REQUEST);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it('Testing with two queries, Should return "You must provide atleast three URLs"', (done) => {
      app
        .get(
          `/fetch-metadata?urls=https://www.facebook.com/&urls=https://www.google.com`
        )
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(STATUS_CODE.BAD_REQUEST);
          expect(res.body).to.be.an("object");
          done();
        });
    });

    it("Testing with three queries, Should return an array of objects", (done) => {
      app
        .get(
          `/fetch-metadata?urls=https://www.facebook.com/&urls=https://www.google.com&urls=https://www.youtube.com/`
        )
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(STATUS_CODE.OK);
          expect(res.body).to.be.an("array");

          res.body.forEach((item) => {
            expect(item).to.be.an("object");
            expect(item).to.have.all.keys("title", "img", "description", "url");
          });
          done();
        });
    });

    it("Should not return an object", (done) => {
      app
        .get(
          `/fetch-metadata?urls=https://www.facebook.com/&urls=https://www.google.com&urls=https://www.youtube.com/`
        )
        .end((err, res) => {
          if (err) done(err);
          expect(res.status).to.equal(STATUS_CODE.OK);
          expect(res.body).to.not.be.an("object");
          done();
        });
    });

    it("Should return array of objects with Error as values for providing wrong urls", (done) => {
      app
        .get(`/fetch-metadata?urls=facebook&urls=google&urls=youtube`)
        .end((err, res) => {
          if (err) done(err);
          res.body.forEach((item) => {
            expect(item).to.be.an("object");
            expect(item).to.have.property(
              "title",
              "This site is not available"
            );
            expect(item).to.have.property(
              "description",
              "This site is not available"
            );
            expect(item).to.have.property("img", "This site is not available");
          });
          done();
        });
    });
  });
});
