//let creepLogic = require("../creeps/index");
//let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let bq = room.memory.buildQueue
    if (bq) {
        // get the data for spawning a new creep of creepTypeNeeded
        let creepSpawnData = creepLogic[bq[0].role] && creepLogic[bq[0].role].spawnData(room, bq[0].instruction);
        console.log(room, JSON.stringify(creepSpawnData));

        if (creepSpawnData) {
            // find the first or 0th spawn in the room
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            let result = spawn.spawnCreep(creepSpawnData.body, BQ[0].name, {memory: creepSpawnData.memory});

            console.log("Tried to Spawn:", creepTypeNeeded, result)
        }
    }
}

module.exports = spawnCreeps;