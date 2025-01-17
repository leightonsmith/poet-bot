const { WebClient } = require("@slack/web-api");
const toTitleCase = require("titlecase");

// post a message to Slack
module.exports.postMessage = async (channel, text, attachments, token) => {
  const web = new WebClient(token);
  try {
      const result = await web.chat.postMessage({
          channel: channel,
          text: text,
          attachments: JSON.stringify(attachments)
      });

      console.log(`Successfully sent message ${result.ts} to channel ${channel}`);
  } catch(error) {
      console.log(`Error posting Slack message: ${error}`);
  }
};

// post an error message to Slack. Function provides consistent error reporting
module.exports.postError = (errorMessage, channel, token) => {
  return module.exports.postMessage(
    channel,
    "Whoops :cry:",
    [
      {
        text: errorMessage,
        color: "danger",
        mrkdwn_in: ["text"]
      }
    ],
    token
  );
};

module.exports.updateMessage = async (
  channel,
  text,
  attachments,
  token,
  timestamp
) => {
  const web = new WebClient(token);
  try {
    const result = await web.chat.update({
      channel: channel,
      text: text,
      ts: timestamp,
      attachments: JSON.stringify(attachments)
    });

    console.log(
      `Successfully updated message ${result.ts} in channel ${channel}`
    );
  } catch (error) {
    console.log(`Error updating Slack message: ${error}`);
  }
};

// Query Slack for list of users, search for the 'target' and return their
// fullname and display name (if they exist)
module.exports.GetFullName = async (target, targetType, token) => {
  const web = new WebClient(token);
  try {
    const userList = await web.users.list();
    console.log(`User List: ${JSON.stringify(userList)}`);

    var fullName = null;
    var jiraUsername = null;

    // search depends on the type of the target
    switch (targetType) {
      case "Self":
      case "Mention":
        for (i = 0; i < userList.members.length; i++) {
          if (userList.members[i].id == target) {
            fullName = JSON.stringify(userList.members[i].real_name);
            jiraUsername = JSON.stringify(userList.members[i].name);
            break;
          }
        }
        break;
      case "JiraUsername":
        for (i = 0; i < userList.members.length; i++) {
          if (userList.members[i].name == target) {
            fullName = JSON.stringify(userList.members[i].real_name);
            break;
          }
        }
        jiraUsername = target;
        break;
      case "FullName":
        for (i = 0; i < userList.members.length; i++) {
          if (userList.members[i].name == target) {
            jiraUsername = JSON.stringify(userList.members[i].name);
            break;
          }
        }
        fullName = JSON.stringify(toTitleCase(target));
        break;
    }

    console.log(
      "Found fullname: " + fullName + ", jirausername: " + jiraUsername
    );
    return { fullName: fullName, jiraUsername: jiraUsername };
  } catch (error) {
    console.log(`Error getting user list: ${err}`);
  }
};
