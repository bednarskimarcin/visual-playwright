Prepare the script (or scripts) in Playwright which enables me to do the visual tests of the application.
Application sends the emails from the templates. We need to compare those emails. State required vs. state current.
Let's begin with comparing the screenshots of the email messages. Screenshots are located in some directory (provided in configuration).
So we have for every email template the pair: fileExpected and fileCurrent.
In first version screenshots are put in the directory manually by the QA.
Then the scripts are run. And as a result the proper Playwright report is displayed.
