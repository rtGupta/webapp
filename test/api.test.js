import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";

chai.use(chaiHttp);
var expect = chai.expect;

describe("Test Suite", () => {
  it("should return ok when hitting /healthz api", (done) => {
    chai
      .request(server)
      .get("/healthz")
      .end((err, res) => {
        if (!err) {
          expect(res.status).to.eql(400);
          done();
        }
      });
  });
});
