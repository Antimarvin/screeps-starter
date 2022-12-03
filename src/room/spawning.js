//let creepLogic = require("../creeps/index");
//let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let spawns = room.find(FIND_MY_SPAWNS)
    for (let s of spawns){
        let creepsInRoom = room.find(FIND_MY_CREEPS)
        let hrPlan = room.memory.hrPlan

        let spawningPriority = ['harvester', 'builder', 'upgrader']


        for(let r in hrPlan) {
            let numInRole = _.sum(creepsInRoom, c => c.memory.role === hrPlan[r].role)
            if(numInRole < hrPlan[r].minQty){
                if(hrPlan[r].role === 'harvester'){
                    //console.log ("Attempting Harvester spawn of " + hrPlan[r].role + " with " + s.room.energyCapacityAvailable)
                    s.createHarvester(hrPlan[r].role, s.room.energyCapacityAvailable)
                }
                else {
                    //console.log ("Attempting Scaling spawn of " + hrPlan[r].role + " with " + s.room.energyCapacityAvailable)
                    s.createScalingWorker(hrPlan[r].role, s.room.energyCapacityAvailable)
                }
            }
        }
    }
}

module.exports = spawnCreeps;