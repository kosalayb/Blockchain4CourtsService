const Instructors = artifacts.require("Instructor");

module.exports = function(deployer) {
  deployer.deploy(Instructors);
};
