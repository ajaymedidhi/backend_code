const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const cors = require("cors");

const databasePath = path.join(__dirname, "tracking.db");

const app = express();

app.use(express.json());
app.use(cors());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3001, () =>
      console.log("Server Running at http://localhost:3001/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertStateDbObjectToResponseObject = (dbObject) => {
  return {
    refId: dbObject.ref_id,
    location: dbObject.location,
    status: dbObject.status,
    orderDate: dbObject.order_date,
    time: dbObject.time,
  };
};

app.get("/details/", async (request, response) => {
  const getStatesQuery = `
    SELECT
      *
    FROM
      order_status;`;
  const statesArray = await database.all(getStatesQuery);
  response.send(
    statesArray.map((eachState) =>
      convertStateDbObjectToResponseObject(eachState)
    )
  );
});
