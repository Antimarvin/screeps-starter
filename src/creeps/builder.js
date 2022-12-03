const upgrader = require("./upgrader");
var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            creep.say('Mining!')
            if(creep.harvest(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE));
            }
        }
        else {
            creep.say('Constructing');
            if(creep.build(creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES));
            }
            else {
                upgrader.run(creep)
            }
        }
    }
};

module.exports = roleBuilder;