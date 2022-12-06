var harvester = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.working) {
            if (creep.harvest(creep.pos.findClosestByPath(FIND_SOURCES)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_SOURCES));
            }
        }
        else if (creep.memory.working) {
            creep.memory.working = false
        }
    }
}

module.exports =  harvester;