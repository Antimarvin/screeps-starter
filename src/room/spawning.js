//let creepLogic = require("../creeps/index");
//let creepTypes = _.keys(creepLogic);
function spawnCreeps(room) {
    let spawns = room.find(FIND_MY_SPAWNS)

    //loop through all spawns
    for (let s of spawns) {

        if(room.memory.buildQueue.high.length > 0){
            let energy = room.energyAvailable
            let creep = room.memory.buildQueue.high[0]
            if(creep.energyLimit){
                energy = Math.min(creep.energyLimit, room.energyAvailable)
            }
            if(s.createScalingCreep(creep.name,creep.baseBody, creep.scalingBody, creep.memory, energy) === OK){
                room.memory.buildQueue.high.pop()
            }
        }
        else if(room.memory.buildQueue.medium.length > 0){
            let energy = room.energyAvailable
            let creep = room.memory.buildQueue.medium[0]
            if(creep.energyLimit){
                energy = Math.min(creep.energyLimit, room.energyCapacityAvailable)
            }
            if(s.createScalingCreep(creep.name,creep.baseBody, creep.scalingBody, creep.memory, energy) === OK){
                room.memory.buildQueue.medium.pop()
            }
        }
        else if(room.memory.buildQueue.low.length > 0){
            let energy = room.energyAvailable
            let creep = room.memory.buildQueue.low[0]
            if(creep.energyLimit){
                energy = Math.min(creep.energyLimit, room.energyCapacityAvailable)
            }
            if(s.createScalingCreep(creep.name,creep.baseBody, creep.scalingBody, creep.memory, energy) === OK){
                room.memory.buildQueue.low.pop()
            }
        }
    }
}


module.exports = spawnCreeps;