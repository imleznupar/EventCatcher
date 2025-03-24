# Event Catcher

This is a Chrome extension that scans emails and generate calendar links automatically, so there's no more need to manually enter event details like time and location.

## Requirements

The following is required:
* Chrome

## Usage
1. Go to [Event Catcher](https://chromewebstore.google.com/detail/event-catcher/nficchcpfpcicibcpfblpoaieajbhjll)
2. Click "Add to Chrome"
> **_NOTE:_**
> * If you don't see the add-event icon in Gmail, try reopening Gmail with [this link](https://mail.google.com/mail/u/0/#inbox)
> * Currently, only works when Gmail's "Reading Panel" is set to "No Split"

## How it works
#### Read Email
First, it has to be able to read the content of the email to detect events. When the user, opens an email, it uses HTML parsing to get the body of the email, along with other metadata such as the email title and timestamp.
#### Detect Events
The content of the email is sent to the backend, where it utilizes the power of LLM to detect events. Each event is output in a [structured way](https://ai.google.dev/gemini-api/docs/structured-output) in JSON. This make our lives easier when we are generating calendar links in the next step.
#### Generate Calendar Link
Finally, using the JSON response, we can easily generate a Google Calendar event with an URL that contains the title, start/end time, and other details about the event. 

## Acknowledgements
* [Chrome Extensions](https://developer.chrome.com/docs/extensions)

For further inquiries, please contact leznuparutube@gmail.com
