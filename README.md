## Server for Founding-Speeches
This is the server for the app "Founding-Speeches". Part of a MERN stack - the database uses MongoDB and the server is coded with Node.js and Express framework.

Please visit this git for more details of the app: https://github.com/anhhtle/founding-speeches-server.

The live server is hosted on heroku: https://founding-speeches-server.herokuapp.com/

## Endpoints
This is a REST API.

Base url: https://founding-speeches-server.herokuapp.com/api/v1/

### List of all presidents: 
GET /presidents/

### Add new president
POST /presidents/

### Update president
PUT /presidents/:presId

### Delete president
DELETE /presidents/:presId

### Get transcripts of a president:
GET /transcripts/:presId

### Add new transcript
POST /transcripts/

### Delete a transcript
DELETE /transcripts/:transcriptId

### Get Watson analysis
POST /watson