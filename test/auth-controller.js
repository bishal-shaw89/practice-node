const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth controller - Login", function () {

  before(function (done) { //it will once before any test case will run
    mongoose
      .connect("mongodb://127.0.0.1:27017/test-message")
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "test",
          name: "test",
          posts: [],
          _id: "649ec55cf27b013570e255fe",
        });
        return user.save().then(() => {
          done();
        })
      })
  });

  beforeEach(function () { })

  afterEach(function () { })

  it("should send an error with code 500 if accessing the database fails", function () {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "123456",
      },
    };
    AuthController.login(req, {}, () => { }).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    User.findOne.restore();
  });

  it("should send a response with a valid user status for an exsisting user", function (done) {

    const req = { userId: "649ec55cf27b013570e255fe" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    AuthController.getUserStatus(req, res, () => { }).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.statusCode).to.be.equal("I am new!");
      done();
    });
  });

  after(function (done) { //it will once after every test case runs
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  })
});
