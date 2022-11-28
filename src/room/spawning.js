//let creepLogic = require("../creeps/index");
//let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let bq = room.memory.buildQueue
    if (bq) {
        // get the data for spawning a new creep of creepTypeNeeded
        let creepSpawnData = room.memory.buildQueue[0]

        if (creepSpawnData) {
            // find the first or 0th spawn in the room
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            let result = spawn.spawnCreep(creepSpawnData)
            console.log("Tried to Spawn:", creepSpawnData, result)
        }
    }
}

module.exports = spawnCreeps;