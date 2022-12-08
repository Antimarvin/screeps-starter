const upgrader = require("./upgrader");
var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.store.energy === 0) {
            creep.memory.working = false
        }
        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }


        if(!creep.memory.working) {

            let availableContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE)
                    && s.store.energy >= creep.store.getFreeCapacity()
            })

            if (availableContainer) {
                if (creep.withdraw(availableContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(availableContainer);
                }
            }
        }
        else if (creep.memory.working) {

            let structure = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)

            if(structure){
                if(creep.build(structure) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                upgrader.run(creep)
            }
        }
    },
    defaultSettings: function (serialNumber){
        return {
            name: `Truck_${serialNumber}`,
            baseBody: [],
            scalingBody: [CARRY, CARRY, MOVE],
            memory: {
                role: 'truck',
                job : undefined,
                jobTarget: undefined,
                working: false
            },
        }
    }
}

module.exports = roleBuilder;