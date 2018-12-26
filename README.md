# slim-person-page

Inspired by FamilySearch's person page https://www.familysearch.org/tree/person/details/{PID}

I wanted to see if I could recreate the same look of the page without making nearly as many network requests.

This project is intended to demo how many requests are actually needed to paint the page.
This is not intended to be feature complete or production ready.

In this basic app, the PID will be passed in as the path and the sessionId as a query param.
You'll need to generate your own integration sessionid and find a valid PID.
http://localhost:8080/{PID}?sessionId={sessionId}