const repairer = require("./repairer");

var roleWallRepairer = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }
        if (creep.store.energy === 0) {
            creep.memory.working = false
        }

        if(!creep.memory.working) {
            //creep.say("Refuel")
            let availableContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
                    && s.store.energy >= creep.store.getFreeCapacity()
            })
            let droppedResources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,  {
                filter: r => r.amount >= creep.store.getFreeCapacity()
            })
            if(!availableContainer) {
                if (creep.pickup(droppedResources) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedResources);
                }
            }
            else if (availableContainer) {
                if (creep.withdraw(availableContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(availableContainer);
                }
            }
        }
        else if (creep.memory.working) {
            //creep.say('Repairing');

            let walls = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_WALL
            });

            let target = undefined

            for(let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){
                for (let wall of walls) {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall;
                        break
                    }
                }
                if(target !== undefined){
                    break
                }
            }

            if(target !== undefined) {
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {

                repairer.run(creep)
            }
        }
    }
}

module.exports = roleWallRepairer;