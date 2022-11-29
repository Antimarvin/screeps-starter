//let creepLogic = require("../creeps/index");
//let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let bq = room.memory.buildQueue
    console.log("Trying to spawn from build queue: " + bq[0].name)
    if (bq.length > 0) {
        // get the data for spawning a new creep of creepTypeNeeded
        let creepSpawnData = room.memory.buildQueue[0]

        if (creepSpawnData) {
            // find the first or 0th spawn in the room
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            let result = spawn.spawnCreep(creepSpawnData.body,
                                          creepSpawnData.name,
                {memory: creepSpawnData.memory})
            if(result === 0) {
                room.memory.buildQueue.shift()
            }
            console.log("Tried to Spawn:", creepSpawnData.name, result)
        }
    }
}

module.exports = spawnCreeps;