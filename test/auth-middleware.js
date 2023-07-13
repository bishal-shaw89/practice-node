const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middleware/is-auth");

describe("Auth middleware", function () {
  it("should an error if authorization header is not present", function () {
    // we created a 'req' variable with 'get function' because we need to test middleware function.
    // it is equivalent to req.get()
    const req = {
      get: function (headerName) {
        return null;
      },
    };

    // we call bind because we want to call the function by mocha and chai.
    // 'this' keyword is used as the 1st parameter if we use bind method.
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated." // need to pass the same message which we use in middleware, in order to pass test.
    );
  });

  it("should an error if only single string is passed in header", function () {
    const req = {
      get: function (headerName) {
        return "test";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield an userId after decoding the token", function () {
    const req = {
      get: function (headerName) {
        return "Bearer dfhkdsfkdsfdskdskfd";
      },
    };
    sinon.stub(jwt, "verify"); // sinon.stub is used to replace the method. accept 2 params, 1st object that has method and 2nd actual method.
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });

  it("should an error if the token cannot be verified", function () {
    const req = {
      get: function (headerName) {
        return "Bearer test";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});
