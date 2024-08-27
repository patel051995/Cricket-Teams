const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(_dirname, "cricketTeam.db");

const app = express();

app.use(express.json());

let database = null;

const intializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
  );
 } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

intializeDbAndServer();

const convertDbObjectToResponseObject = databaseObject => {
  return {
    playerId: databaseObject.player_id,
    playerName: databaseObject.player_name,
    jerseyNumber: databaseObject.jersey_number,
    role: databaseObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      cricket_team;`;
  const playersArray = await database.all(getPlayersQuery);
  response.send(
    playersArray.map(eachPlayer => 
    convertDbObjectToResponseObject(eachPlayer)
    )
  );
});

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerWithId = `
    SELECT 
      *
    FROM
      cricket_team
    WHERE 
      player_id = ${playerId};`
  const idOfPlayer = await db.get(playerWithId)
  response.send(dbObjecttoresponse(idOfPlayer))
});



app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = playerDetails;
  const getPlayersQuery = `
     INSERT INTO
       cricket_team (player_name,jersey_number,role)
       VALUES
       (
        '${playerName}', ${jerseyNumber},'${role}');`;
        const player = await database.run(postPlayerQuery);
        response.send("Player Added to Team");
});

app.put('/players/:playerId/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const {playerId} = request.params
  const updatePlayerQuery = `
    UPDATE
      cricket_team
    SET
     player_name = '${playerName}',
     jersey_number=${jerseyNumber},
     role='${role}'
    WHERE
     player_id=${playerId};`

  await database.run(updatePlayerQuery)
  response.send('Player Details Updated')
})
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params;
  const deletePlayerQuery = `
    DELETE FROM 
    cricket_team
    WHERE
    player_id = ${playerId};`;
  await database.run(deletePlayerQuery);
  response.send("Player Removed");
});
module.exports = app;
