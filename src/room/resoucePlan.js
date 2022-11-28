creep.memory.role = undefined;

function getCreepsOfRole (role, room) {
    return _.filter(Game.creeps, creep => creep.memory.role === role && creep.room.name === room.name);
}

creep.memory.target = undefined;

function creepNeedsToBeMade(source, room){
    for(var creep of getCreepsOfRole('harvester', room)) {
        if (creep.memory.target === source) {
            return false
        }
    }
    for (var i of room.memory.buildQueue){
        if (i.target === source){
            return false
        }
    }
    return true
}

function resourcePlan (room) {

    //console.log('Planning room ', room.name);
    if (!room.memory.buildQueue) {
        room.memory.buildQueue = [];
    }

    for (var source of room.find(FIND_SOURCES_ACTIVE)){
        if(creepNeedsToBeMade(source, room)){
            room.memory.buildQueue.push({name: 'Miner ' + source, instructions: {target: source}, role: 'harvester'})
        }
    }

}

module.exports = resourcePlan;