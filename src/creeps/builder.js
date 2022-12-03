const upgrader = require("./upgrader");
var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.working) {
            creep.say("Mining!")
            if(creep.harvest(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE));
            }
            if(creep.store.getFreeCapacity() === 0){
                creep.memory.working = true
            }
        }
        else if (creep.memory.working) {
            creep.say('Building');
            if(creep.build(creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES));
            }
            else {
                upgrader.run(creep)
            }
        }
    }
}

module.exports = roleBuilder;