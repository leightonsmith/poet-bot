# Poet-bot


Project Oriented Enlightenment Tool (Poet) is a serverless natural language processing Slack bot that responds to questions regarding JIRA.

## Configuration

* Clone this repository and change to that directory by running:

    ```
    git clone https://github.com/PouriaSterling/poet-bot.git
    cd poet-bot
    ```

* run `npm install`
* [Create an AWS account](https://aws.amazon.com/free/) if haven't got one already
* [Install Serverless](https://serverless.com/framework/docs/providers/aws/guide/installation/) and [configure your AWS credentials](https://www.youtube.com/watch?v=mRkUnA3mEt4).
* [Create a Luis app](https://www.luis.ai/home) for the bot
* At Luis -> Settings, import training data from the file poet-bot/data/LuisTrainingData.json, and then Train on that data
* [Create your Slack app](https://api.slack.com/slack-apps#create-app) and configure its credentials as well as those for Luis and JIRA by creating a `local.yml` file:

	```
	# Local variables -- DO NOT COMMIT!

	dev:
	  slack:
	    clientId: "<Your Dev Slack App Client ID>"
	    clientSecret: <Your Dev Slack App Client Secret>
	    botId: "<Your Dev Slack Bot ID>"

      luis:
        url: <Your Dev Luis Endpoint URL>

      jira:
        name: "<Your Dev JIRA Username>"
        password: "<Your Dev JIRA Password>"
        url: "<Your Dev JIRA Base URL>"
        storypointsfieldID: "<Your Dev JIRA storypoints field name>"
      
      jenkins:
        authorisationHeader: "<Your Dev Jenkins auth header>
        url: "<Your Dev Jenkins Base URL>"
        deployJobPath: "<Your Dev Jenkins deploy job path>"

	prod:
	  slack:
	    clientId: "<Your Production Slack App Client ID>"
	    clientSecret: <Your Production Slack App Client Secret>
	    botId: "<Your Production Slack Bot ID>"

	  luis:
        url: <Your Production Luis Endpoint URL>

      jira:
        name: "<Your Production JIRA Username>"
        password: "<Your Production JIRA Password>"
        url: "<Your Production JIRA Base URL>"
        storypointsfieldID: "<Your Production JIRA storypoints field name>"
        
      jenkins:
        authorisationHeader: "<Your Production Jenkins auth header>
        url: "<Your Production Jenkins Base URL>"
        deployJobPath: "<Your Production Jenkins deploy job path>"
	```

  Notes:
  * 'clientid' must be quoted otherwise it is interpreted as a number.
  * Leave your 'botId' fields empty for now, we will configure them after you've created your bot.
  * storypointsfieldID is the custom ID for your storypoints field. i.e. customfield_10054
  * The Jenkins authorisationHeader is in the form of `Basic <credentials>`, where credentials is the base64 encoding of a Jenkins username and password (or API token) joined by a single colon `:`.
  * The Jenkins deploy job path can be found by navigating to your deployment job on Jenkins and extracting all parts of your URL that doesn't contain your Jenkins base URL (avoiding the leading slash). e.g. <Base Jenkins URL>path/to/your/deployment
  * Avoid trailing slashes `/` at the end of URLs
  * Do not commit this file. It is already Git ignored.

* Deploy the server to AWS Lambda `serverless deploy` or a shorter form `sls deploy`

  Make a note of the endpoints output once it has deployed, e.g.:

	```
	endpoints:
	  GET - https://ab12cd34ef.execute-api.ap-southeast-2.amazonaws.com/dev/install
	  GET - https://ab12cd34ef.execute-api.ap-southeast-2.amazonaws.com/dev/authorized
	  POST - https://ab12cd34ef.execute-api.ap-southeast-2.amazonaws.com/dev/receptionist
	```

* Go to your [Slack app](https://api.slack.com/apps) and:
  * Select **OAuth & Permissions** and 
    * In the 'Redirect URL(s)' box paste the `authorized` endpoint
    * Under **Scopes**, select the following permission scopes:
      * channels:history
      * chat:write:bot
      * users:read
      * users.profile:read
  * Select **Bot Users** and then 'Add a Bot User' to create a bot for your application
    * Set 'Always Show My Bot as Online' to on
  * Select **Event Subscriptions** and:
    * Switch 'Enable Events' to on
    * In the 'Request URL' box paste the `receptionist` endpoint and wait for it to verify
    * Once verified, under 'Subscribe to Bot Events' select 'Add Bot User Event' and choose 'message.channels'
    * Save changes
  * Select **Interactive Components**
    * Toggle *Interactivity* to on
    * In the 'Request URL' box paste the `receptionist` endpoint
    * Save changes

* Navigate to your `install` endpoint using your browser and choose 'Add to Slack'
  * Choose your workspace in the top right
  * Authorize the application

* Go to your Slack workspace and invite the bot you just added to a desired channel

* In Slack, click on the 'More Items' button in the top right (3 vertical dots) and choose 'Workspace Directory'. Find and click on the profile of the bot you just added. Click the 'More Info' button (down-caret symbol) and 'Copy member ID'. Use this to populate the botId field of your local.yml file.
  * *Note:* Deleting or re-adding the bot will cause this ID to change. Update the local.yml file if you do this.

* Deploy your changes using `sls deploy`

* You're all set to start asking your bot about JIRA! Start by greeting the bot or asking for help.


## Development

If you are making changes to only a single Lambda function and would like to deploy your changes, you can use,

```
sls deploy function -f <FUNCTION_NAME>
```

You can run a local offline version of your Lambdas using,

```
sls offline start
```

You can then send requests to `localhost:3000/<FUNCTION_NAME>`

## Adding Functionality

To add new intent functionality, train Luis for the intent and create a new handler in the [/intentHandlers](https://github.com/PouriaSterling/poet-bot/tree/master/src/intentHandlers) folder (making sure to use the exact same name for Luis and the file). Put all your logic in that file. You can use an existing intent handler as a template to get you started.