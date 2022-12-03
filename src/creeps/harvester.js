var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            creep.say('Mining!')
            if(creep.harvest(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE));
            }
        }
        else {
            creep.say('Full');
            let closestDest = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.energyCapacity && (s.energy < s.energyCapacity)
            })
            if(creep.transfer(closestDest, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDest);
            }
        }
    }
};

module.exports =  harvester;