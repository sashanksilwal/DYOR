const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const app = require("../app");

describe("sentimentAnalysis", () => {
    describe("GET /sentimentAnalysis", () => {
        it("Should return status=500 and approprite error message for GET /sentimentAnalysis", async () => {
            const res = await request(app).get("/sentimentAnalysis");
            expect(res.status).to.equal(500);
            expect(res.body).to.be.an("object");
            expect(res.body).to.be.deep.equal({
                message: `INVALID GET REQUEST`
            });
        });
        
        it("Should return status=200 for GET /sentimentAnalysis with an object wordcloud", async () => {
            const res = await request(app).get("/sentimentAnalysis");
            expect(res.body).to.be.an("object");
            expect(res.status).to.equal(200);
            expect(res.body).have.property("data");
        });

        it("Should return status=404 for GET /sentimentAnalysis when API is down or not found", async () => {
            const res = await request(app).get("/sentimentAnalysis");
            expect(res.body).to.be.an("object");
            expect(res.status).to.equal(404);
            expect(res.body).to.be.deep.equal({
                message: `API NOT FOUND`
            });
        });
    })
})