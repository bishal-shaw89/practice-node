const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/post");
const FeedController = require("../controllers/feed");

describe("Feed controller - Login", function () {

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
