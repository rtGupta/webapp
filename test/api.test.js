import chai from "chai";
import chaiHttp from "chai-http";
import server from '../server.js';

chai.use(chaiHttp);
var expect = chai.expect;

describe("Unit test for Getting a user", () => {
    it("should return Data of a specific user", (done) => {
        chai
            .request(server)
            .get("/v1/user/22")
            .auth('userThree@gmail.com', 'validPass123')
            .end((err, res) => {
                if (!err) {
                    expect(res.status).to.eql(200);
                    expect(res.body.firstName).to.eql('User');
                    expect(res.body.lastName).to.eql('Three');
                    expect(res.body.username).to.eql('userThree@gmail.com');
                    done();
                }
            });
    });

});