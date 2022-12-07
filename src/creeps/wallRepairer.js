const repairer = require("./repairer");

var roleWallRepairer = {
    /** @param {Creep} creep **/
    run: function(creep) {

        // if the creep has 0 free capacity set working to true
        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }

        // if creep has no energy available set working to false to go get more
        if (creep.store.energy === 0) {
            creep.memory.working = false
        }

        // if working is false, go find energy
        if(!creep.memory.working) {
            //find the closest container that has enough energy to fill capacity
            let availableContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
                    && s.store.energy >= creep.store.getFreeCapacity()
            })
            // find the closest dropped resources that are enough to fill capacity
            let droppedResources = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES,  {
                filter: r => r.amount >= creep.store.getFreeCapacity()
            })
            //if we dont have a valid container, use dropped resources, otherwise use the container
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
        // if working is true go repair stuff
        else if (creep.memory.working) {
            // grab all the walls and ramparts
            let walls = creep.room.find(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_WALL
            });

            let target = undefined

            // loop through all walls comparing current hits / max hits to get percentage health, if less than loop
            // percentage set target to that wall/rampart.
            for(let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001){
                for (let wall of walls) {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall;
                        break
                    }
                }
                // break the loop early if you find a valid target
                if(target !== undefined){
                    break
                }
            }
            //if we found a target, go repair it
            if(target !== undefined) {
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            // if nothing to do, go repair stuff
            else {
                repairer.run(creep)
            }
        }
    }
}

module.exports = roleWallRepairer;