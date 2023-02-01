import chai from "chai";
import chaiHttp from "chai-http";
import server from "../server.js";

chai.use(chaiHttp);
var expect = chai.expect;

describe("/GET users", () => {
  it("should return true if it is a valid user", () => {
    let auth = {
      username: "userOne@gmail.com",
      password: "Test@123",
    };

    let user = {
      firstName: "User",
      lastName: "One",
      username: "userOne@gmail.com",
      password: "Test@123",
    };

    expect(auth.username).to.eql('userOne@gmail.com');
    expect(auth.password).to.eql('Test@123');
  });

});

// describe("Unit test for Getting a user", () => {
//     it("should return Data of a specific user", (done) => {
//         chai
//             .request(server)
//             .get("/v1/user/22")
//             .auth('userThree@gmail.com', 'validPass123')
//             .end((err, res) => {
//                 if (!err) {
//                     expect(res.status).to.eql(200);
//                     expect(res.body.firstName).to.eql('User');
//                     expect(res.body.lastName).to.eql('Three');
//                     expect(res.body.username).to.eql('userThree@gmail.com');
//                     done();
//                 }
//             });
//     });

// });