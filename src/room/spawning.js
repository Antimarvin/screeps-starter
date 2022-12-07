//let creepLogic = require("../creeps/index");
//let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let spawns = room.find(FIND_MY_SPAWNS)

    //loop through all spawns
    for (let s of spawns) {
        let creepsInRoom = room.find(FIND_MY_CREEPS)
        let hrPlan = room.memory.hrPlan

        for(let r in hrPlan) {
            let numInRole = _.sum(creepsInRoom, c => c.memory.role === hrPlan[r].role)

            //if harvesters are 0 spawn one with available energy rather than max
            if(_.sum(creepsInRoom, c => c.memory.role === 'harvester') === 0 ){
                s.createHarvester(hrPlan[r].role, s.room.energyAvailable)
            }

            //loop through roles checking current quantity against max qty and spawn if needed.
            if(numInRole < hrPlan[r].minQty){
                if(hrPlan[r].role === 'harvester'){
                    //console.log ("Attempting Harvester spawn of " + hrPlan[r].role + " with " + s.room.energyCapacityAvailable)
                    s.createHarvester(hrPlan[r].role, s.room.energyCapacityAvailable)
                }
                else if(hrPlan[r].role === 'truck'){
                    //console.log ("Attempting Harvester spawn of " + hrPlan[r].role + " with " + s.room.energyCapacityAvailable)
                    s.createTruck(hrPlan[r].role, s.room.energyCapacityAvailable)
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