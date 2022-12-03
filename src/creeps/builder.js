const upgrader = require("./upgrader");
var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(!creep.memory.working) {
            creep.say("Refuel")
            if(creep.pickup(creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES));
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
            if (creep.store.energy === 0) {
                creep.memory.working = false
            }
        }
    }
}

module.exports = roleBuilder;