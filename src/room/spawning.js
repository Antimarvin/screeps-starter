//let creepLogic = require("../creeps/index");
//let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    let spawns = room.find(FIND_MY_SPAWNS)

    //loop through all spawns
    for (let s of spawns) {
        let creepsInRoom = room.find(FIND_MY_CREEPS)
        let hrPlan = room.memory.hrPlan


        //if harvesters are 0 spawn one with available energy rather than max
        if(_.sum(creepsInRoom, c => c.memory.role === 'harvester') === 0 ){
            let creepMemory = {role: 'harvester', working: false}
            s.createScalingCreep([],[MOVE, WORK, WORK], creepMemory, s.room.energyAvailable)
        }
        else {
            for (let r in hrPlan) {
                let numInRole = _.sum(creepsInRoom, c => c.memory.role === hrPlan[r].role)

                //loop through roles checking current quantity against max qty and spawn if needed.
                if (numInRole < hrPlan[r].minQty) {
                    if (hrPlan[r].role === 'harvester') {

                        let creepMemory = {role: hrPlan[r].role, working: false}
                        // this limits the stack to 3 which is 750
                        let harvesterEnergyLimit = Math.min(s.room.energyCapacityAvailable, 750)
                        s.createScalingCreep([], [MOVE, WORK, WORK], creepMemory, harvesterEnergyLimit)

                    } else if (hrPlan[r].role === 'truck') {

                        let creepMemory = {role: hrPlan[r].role, working: false}
                        s.createScalingCreep([], [MOVE, CARRY], creepMemory, s.room.energyCapacityAvailable)

                    } else {

                        let creepMemory = {role: hrPlan[r].role, working: false}
                        s.createScalingCreep([], [WORK, MOVE, CARRY], creepMemory, s.room.energyCapacityAvailable)
                    }
                }
            }
        }
    }
}

module.exports = spawnCreeps;