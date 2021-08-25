var express = require('express');
var router = express.Router();
const {v4: uuidv4} = require('uuid');
const db = require("../db/client");

/* GET home page. */
router.get('/', function(req, res) {
  res.jsonp({"data": "Hello world!"});
});

router.post('/session', async (req, res) => {
  /**
   * POST pomodoro session
   * Expected body: {"id": timestamp, "time": "MM:SS", "email": "example@abc.com"}
   */

  console.log("Request body:");
  console.log(req.body);
  const insertPomodoro = `INSERT INTO pomodoro VALUES('${req.body.id}', '${req.body.email}', '${req.body.time}')`;
  
  try{
    const queryPromise = db.executeSQL(insertPomodoro);
    const result = await queryPromise;
    console.log('DB result:');
    console.log(result);
    return res.status(200).jsonp({info: "Session created", data: result});
  }
  catch(err){
    console.error(err);
    return res.status(500).jsonp({info: "Something went wrong"});
  }
});

router.get("/session", async (req, res)=>{
  const selectAllSession = "SELECT * FROM pomodoro";
  try{
    const result = await db.executeSQL(selectAllSession);
    console.log('DB result:');
    console.log(result);
    return res.status(200).jsonp({info: "Fetched all sessions", data: result});
  }
  catch(err){
    console.error(err);
    return res.status(500).jsonp({info: "Something went wrong"});
  }
});

router.get("/session/:email", async (req, res)=>{
  console.log(`Email: ${req.params.email}`);
  const selectByMail = `SELECT * FROM pomodoro WHERE email='${req.params.email}'`;
  try {
    const result = await db.executeSQL(selectByMail);
    console.log('DB result:');
    console.log(result);
    if (result.data.length === 0)
      return res.status(404).jsonp({error: `No entries found for ${req.params.email}`});
    return res.status(200).jsonp({info: `Fetched all sessions by ${req.params.email}`, data: result});
  }
  catch (err) {
    console.error(err);
    return res.status(500).jsonp({error: "Something went wrong"});
  }
});

module.exports = router;
