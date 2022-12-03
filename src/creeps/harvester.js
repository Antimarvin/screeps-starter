var harvester = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.working) {
            creep.say('Mining!')

            if(creep.harvest(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)) === ERR_NOT_IN_RANGE) {

                creep.moveTo(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE));
            }
            if(creep.store.getFreeCapacity() === 0){
                creep.memory.working = true
            }
        }
        else if (creep.memory.working) {
            creep.say('Upgrading');
            let closestDest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.energyCapacity && (s.energy < s.energyCapacity)
            })
            if(creep.transfer(closestDest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {

                creep.moveTo(closestDest);
            }
            if (creep.store.energy === 0) {
                creep.memory.working = false
            }
        }
    }
}

module.exports =  harvester;