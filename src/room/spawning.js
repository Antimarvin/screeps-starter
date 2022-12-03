//let creepLogic = require("../creeps/index");
//let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let spawns = room.find(FIND_MY_SPAWNS)
    for (let s of spawns){
        let creepsInRoom = room.find(FIND_MY_CREEPS)
        let hrPlan = room.memory.hrPlan
        for(let r in hrPlan) {
            let numInRole = _.sum(creepsInRoom, c => c.memory.role === hrPlan[r].role)
            console.log ("Found " + numInRole + " of " +hrPlan[r].minQty + " " + hrPlan[r].role )
            if(numInRole < hrPlan[r].minQty){
                console.log ("Attempting spawn of " + hrPlan[r].role + " with " + s.room.energyCapacityAvailable)
                let result = s.createScalingWorker(hrPlan[r].role, s.room.energyCapacityAvailable)
                console.log(result)
            }
        }
    }
}

module.exports = spawnCreeps;