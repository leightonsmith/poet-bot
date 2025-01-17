const axios = require("axios");

const config = {
  headers: {
    Authorization: process.env.JENKINS_AUTHORISATION_HEADER
  }
};

const jenkinsUrl = process.env.JENKINS_URL;
const jobPath = process.env.JENKINS_DEPLOY_JOB_PATH

/**
 * Check the state of the deploy job
 */
module.exports.isUnlocked = () => {
  return axios
    .get(`${jenkinsUrl}/${jobPath}/api/json?pretty=true`, config)
    .then(function(response) {
      return response.data.buildable;
    })
    .catch(function(error) {
      console.log(error);
      return error.response.data;
    });
};

/**
 * Attempt to enable the deploy job
 */
module.exports.unlock = () => {
  return axios
    .post(`${jenkinsUrl}/${jobPath}/enable`, null, config)
    .then(function(response) {
      return "OK";
    })
    .catch(function(error) {
      console.log(error);
      return error.response.data;
    });
};

/**
 * Attempt to disable the deploy job
 */
module.exports.lock = () => {
  return axios
    .post(`${jenkinsUrl}/${jobPath}/disable`, null, config)
    .then(function(response) {
      return "OK";
    })
    .catch(function(error) {
      console.log(error);
      return error.response.data;
    });
};
