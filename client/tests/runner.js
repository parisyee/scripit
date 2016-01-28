// chai-dom requires that chai is exposed globally
// https://github.com/domenic/sinon-chai/blob/master/lib/sinon-chai.js#L17
var chai = require("chai");
window.chai = chai;

var chaiDom = require("chai-dom");
chai.use(chaiDom);

var sinon = require("sinon/pkg/sinon");
window.sinon = sinon;

// sinon-chai requires that sinon is exposed globally
require("sinon-chai");

// var helpers = require.context("./helpers", true);
// helpers.keys().forEach(helpers);

var bundleTests = require.context("./bundles", true, /-test$/);
bundleTests.keys().forEach(bundleTests);

// Cleanup stubs after every test
require("mocha-sinon");
