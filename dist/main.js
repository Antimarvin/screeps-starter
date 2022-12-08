/* This header is placed at the beginning of the output file and defines the
	special `__require`, `__getFilename`, and `__getDirname` functions.
*/
(function() {
	/* __modules is an Array of functions; each function is a module added
		to the project */
var __modules = {},
	/* __modulesCache is an Array of cached modules, much like
		`require.cache`.  Once a module is executed, it is cached. */
	__modulesCache = {},
	/* __moduleIsCached - an Array of booleans, `true` if module is cached. */
	__moduleIsCached = {};
/* If the module with the specified `uid` is cached, return it;
	otherwise, execute and cache it first. */
function __require(uid, parentUid) {
	if(!__moduleIsCached[uid]) {
		// Populate the cache initially with an empty `exports` Object
		__modulesCache[uid] = {"exports": {}, "loaded": false};
		__moduleIsCached[uid] = true;
		if(uid === 0 && typeof require === "function") {
			require.main = __modulesCache[0];
		} else {
			__modulesCache[uid].parent = __modulesCache[parentUid];
		}
		/* Note: if this module requires itself, or if its depenedencies
			require it, they will only see an empty Object for now */
		// Now load the module
		__modules[uid].call(this, __modulesCache[uid], __modulesCache[uid].exports);
		__modulesCache[uid].loaded = true;
	}
	return __modulesCache[uid].exports;
}
/* This function is the replacement for all `__filename` references within a
	project file.  The idea is to return the correct `__filename` as if the
	file was not concatenated at all.  Therefore, we should return the
	filename relative to the output file's path.

	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getFilename(path) {
	return require("path").resolve(__dirname + "/" + path);
}
/* Same deal as __getFilename.
	`path` is the path relative to the output file's path at the time the
	project file was concatenated and added to the output file.
*/
function __getDirname(path) {
	return require("path").resolve(__dirname + "/" + path + "/../");
}
/********** End of header **********/
/********** Start module 0: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\main.js **********/
__modules[0] = function(module, exports) {
let prototypes = __require(1,0); //needs to be called to update prototypes. otherwise unused
let creepLogic = __require(2,0);
let roomLogic = __require(3,0);
let resourcingManager = __require(4,0)
let config = __require(5,0);


module.exports.loop = function () {
    let debug_status = config.debug
    let myCastles = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    _.forEach(Game.rooms, r => r.update(debug_status));
    _.forEach(myCastles, r => resourcingManager(r));

    _.forEach(myCastles, r => roomLogic.spawning(r));
    for(let n in Game.creeps) {
        let creep = Game.creeps[n];

        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }
    let towers = _.filter(Game.structures, s => s.structureType === STRUCTURE_TOWER);
    for (let tower of towers) {
        tower.defend();
    }
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}
return module.exports;
}
/********** End of module 0: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\main.js **********/
/********** Start module 1: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\index.js **********/
__modules[1] = function(module, exports) {
let files = {
    creep: __require(6,1),
    room: __require(7,1),
    structureSpawn: __require(8,1),
    tower:          __require(9,1)
}
return module.exports;
}
/********** End of module 1: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\index.js **********/
/********** Start module 2: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\index.js **********/
__modules[2] = function(module, exports) {
let creepLogic = {
    harvester:     __require(10,2),
    upgrader:      __require(11,2),
    builder:       __require(12,2),
    repairer:      __require(13,2),
    truck:         __require(14,2),
    wallRepairer:  __require(15,2),
    miningTruck:   __require(16,2)
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 2: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\index.js **********/
/********** Start module 3: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\index.js **********/
__modules[3] = function(module, exports) {
let roomLogic = {
    spawning:     __require(17,3)
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 3: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\index.js **********/
/********** Start module 4: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\Managers\resourcingManager.js **********/
__modules[4] = function(module, exports) {
let creepLogic = __require(2,4);
function getEmpireSources() {

    let empireSources = []

    for(let r in Memory.rooms) {
        if(Memory.rooms[r].sources){
            for(let s in Memory.rooms[r].sources) {
                empireSources.push(Memory.rooms[r].sources[s])
            }
        }
    }
    return empireSources
}


 function resourcingManager(castleRoom){
    Memory.resourcingManager = {}


    let allSources = getEmpireSources()
    for(let s of allSources){
        if(s !== undefined){
            let sourceObject = Game.getObjectById(s.id)
            let creeps = []
            creeps.push(creepLogic.harvester.defaultSettings(sourceObject.id,1))
            creeps.push(creepLogic.miningTruck.defaultSettings(sourceObject.id, s.miningLocations[0],castleRoom.name, 1))

            Memory.resourcingManager[s.id] = {
                source: Game.getObjectById(s.id),
                miningLocations: s.miningLocations,
                distance: 0,
                creeps: creeps
            }
        }
    }

    console.log(JSON.stringify(castleRoom.memory.buildQueue.high))
    for(let source in Memory.resourcingManager){
        for(let i = 0; i < Memory.resourcingManager[source].creeps.length; i++) {
            if(!(Memory.resourcingManager[source].creeps[i].name in Game.creeps)){
                console.log(`${Memory.resourcingManager[source].creeps[i].name} was not in game creeps`)
                castleRoom.memory.buildQueue.high.push(Memory.resourcingManager[source].creeps[i])
            }
        }
    }
     console.log(JSON.stringify(castleRoom.memory.buildQueue.high))
 }
 module.exports = resourcingManager
return module.exports;
}
/********** End of module 4: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\Managers\resourcingManager.js **********/
/********** Start module 5: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\.screeps.json **********/
__modules[5] = function(module, exports) {
module.exports = {
  "email": "Antimarvin@gmail.com",
  "password": "Amarvin2",
  "branch": "main",
  "ptr": false,
  "local_test_location": "",
  "debug": false
}
return module.exports;
}
/********** End of module 5: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\.screeps.json **********/
/********** Start module 6: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\creep.js **********/
__modules[6] = function(module, exports) {
Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}

return module.exports;
}
/********** End of module 6: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\creep.js **********/
/********** Start module 7: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\room.js **********/
__modules[7] = function(module, exports) {
let roomScout = __require(18,7);

Room.prototype.validateMemory = function () {
    roomScout(this)
    if(this.controller.level > 0){
        this.memory.spawnQueue = {
            high: [],
            medium:[],
            low:[]
        }
        this.memory.buildQueue = {
                high: [],
                medium: [],
                low:[]
        }
    }

}

/** @param {Boolean} debug_status **/
Room.prototype.update = function update(debug_status) {
    this.validateMemory()


}

return module.exports;
}
/********** End of module 7: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\room.js **********/
/********** Start module 8: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\structureSpawn.js **********/
__modules[8] = function(module, exports) {
StructureSpawn.prototype.createScalingCreep = function (name, baseBody, scalableBody, memory, maxEnergy = this.room.energyCapacityAvailable) {
    let baseBodyCost = getBodyCost(baseBody)
    let scaleableBodyCost = getBodyCost(scalableBody)
    let bodyStacks = Math.floor((maxEnergy - baseBodyCost) / scaleableBodyCost);

    for (let part of scalableBody) {
        for (let i = 0; i < bodyStacks; i++) {
            baseBody.push(part);
        }
    }
    return this.spawnCreep(baseBody, name, {memory: memory});
}

function getBodyCost(body) {
    let cost = 0
    for(let part of body) {
        cost = cost + BODYPART_COST[part.toLowerCase()]
    }
    return cost
}
return module.exports;
}
/********** End of module 8: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\structureSpawn.js **********/
/********** Start module 9: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\tower.js **********/
__modules[9] = function(module, exports) {
// create a new function for StructureTower
StructureTower.prototype.defend =
    function () {
        let target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target !== undefined) {
            this.attack(target);
        }
    };
return module.exports;
}
/********** End of module 9: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\tower.js **********/
/********** Start module 10: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\harvester.js **********/
__modules[10] = function(module, exports) {
var harvester = {
    /** @param {Creep} creep **/
    run: function(creep) {

        let target = Game.getObjectById(creep.memory.targetSourceID)

        if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    },
    defaultSettings: function (targetSourceID, serialNumber){
        return {
            name: `Harvester_${targetSourceID}_${serialNumber}`,
            baseBody: [],
            scalingBody: [WORK,WORK,MOVE],
            memory: {
                role: 'harvester',
                targetSourceID: targetSourceID
            },
            energyLimit: 750
        }
    }
}

module.exports =  harvester;
return module.exports;
}
/********** End of module 10: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\harvester.js **********/
/********** Start module 11: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\upgrader.js **********/
__modules[11] = function(module, exports) {
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }

        if (creep.store.energy === 0) {
            creep.memory.working = false
        }

        if(!creep.memory.working) {
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
            if(creep.transfer(creep.room.controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;
return module.exports;
}
/********** End of module 11: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\upgrader.js **********/
/********** Start module 12: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\builder.js **********/
__modules[12] = function(module, exports) {
const upgrader = __require(11,12);
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
    }
}

module.exports = roleBuilder;
return module.exports;
}
/********** End of module 12: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\builder.js **********/
/********** Start module 13: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\repairer.js **********/
__modules[13] = function(module, exports) {
const wallRepairer = __require(15,13);
var roleRepairer = {
    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }
        if (creep.store.energy === 0) {
            creep.memory.working = false
        }

        if(!creep.memory.working) {
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
            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax
                                              && s.structureType !== STRUCTURE_WALL})

            if(structure) {
                if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {

                wallRepairer.run(creep)
            }
        }
    }
}

module.exports = roleRepairer;
return module.exports;
}
/********** End of module 13: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\repairer.js **********/
/********** Start module 14: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\Truck.js **********/
__modules[14] = function(module, exports) {
var roleTruck = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }

        if (creep.store.energy === 0) {
            creep.memory.working = false
        }

        if(!creep.memory.working) {
            let availableContainer = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.structureType === STRUCTURE_CONTAINER
                    && s.store.energy > 0
                    && s.room.memory.containers[s.id].mine === true
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
            let primaryStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType === STRUCTURE_SPAWN
                           || s.structureType === STRUCTURE_EXTENSION
                           || s.structureType === STRUCTURE_TOWER)
                           && s.energy < s.energyCapacity
            });

            if(primaryStructure) {
                if (creep.transfer(primaryStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(primaryStructure)
                }
            }
            else {
                creep.say("Stalled")
            }
        }
    },
    defaultSettings: function (targetSource, depositTarget, serialNumber){
        return {
            name: `Truck_${targetSource.id}_${serialNumber}`,
            baseBody: [],
            scalingBody: [CARRY, CARRY, MOVE],
            memory: {
                role: 'truck',
                targetSource: targetSource,
                targetDeposit: depositTarget
            },
            energyLimit: 750
        }
    }
}

module.exports = roleTruck;
return module.exports;
}
/********** End of module 14: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\Truck.js **********/
/********** Start module 15: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\wallRepairer.js **********/
__modules[15] = function(module, exports) {
const repairer = __require(13,15);

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
return module.exports;
}
/********** End of module 15: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\wallRepairer.js **********/
/********** Start module 16: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\miningTruck.js **********/
__modules[16] = function(module, exports) {
var roleMiningTruck = {
    /** @param {Creep} creep **/
    run: function(creep) {


        if(creep.store.getFreeCapacity() === 0){
            creep.memory.working = true
        }

        if (creep.store.energy === 0) {
            creep.memory.working = false
        }

        if(!creep.memory.working) {
            let mine = new RoomPosition(
                creep.memory.targetMiningPosition.x,
                creep.memory.targetMiningPosition.y,
                creep.memory.targetMiningPosition.roomName
            )

            if (creep.pos.isNearTo(mine)){
                if(creep.room.lookForAt(LOOK_RESOURCES,mine)){
                    creep.pickup(creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES))
                }
                else if(creep.room.lookForAt(LOOK_STRUCTURES,mine)) {
                    creep.withdraw(creep.pos.findClosestByRange(STRUCTURE_CONTAINER), RESOURCE_ENERGY)
                }
            }
            else{
                creep.moveTo(mine);
            }
        }
        else if (creep.memory.working) {

            if (creep.room.name !== creep.memory.depositRoom) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.depositRoom))
            } else {
                let primaryStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: s => (s.structureType === STRUCTURE_SPAWN
                            || s.structureType === STRUCTURE_EXTENSION
                            || s.structureType === STRUCTURE_TOWER)
                        && s.energy < s.energyCapacity
                });

                if (primaryStructure) {
                    if (creep.transfer(primaryStructure, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(primaryStructure)
                    }
                }
                else {
                    creep.say("Stalled")
                }
            }
        }
    },
    defaultSettings: function (targetSourceID, targetMiningPosition, depositRoom, serialNumber){
        return {
            name: `MiningTruck_${targetSourceID}_${serialNumber}`,
            baseBody: [],
            scalingBody: [CARRY, CARRY, MOVE],
            memory: {
                role: 'miningTruck',
                targetMiningPosition: targetMiningPosition,
                depositRoom: depositRoom
            }
        }
    }
}

module.exports = roleMiningTruck;
return module.exports;
}
/********** End of module 16: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\miningTruck.js **********/
/********** Start module 17: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\spawning.js **********/
__modules[17] = function(module, exports) {
let creepLogic = __require(2,17);
function spawnCreeps(room) {
    let spawns = room.find(FIND_MY_SPAWNS)
    for (let s of spawns) {

        if(room.memory.buildQueue.high.length > 0){
            let energy = room.energyAvailable
            let creep = room.memory.buildQueue.high[0]
            if(creep.energyLimit){
                energy = Math.min(creep.energyLimit, room.energyAvailable)
            }
            if(s.createScalingCreep(creep.name,creep.baseBody, creep.scalingBody, creep.memory, energy) === OK){
                room.memory.buildQueue.high.pop()
            }
        }
        else if(room.memory.buildQueue.medium.length > 0){
            let energy = room.energyAvailable
            let creep = room.memory.buildQueue.medium[0]
            if(creep.energyLimit){
                energy = Math.min(creep.energyLimit, room.energyAvailable)
            }
            if(s.createScalingCreep(creep.name,creep.baseBody, creep.scalingBody, creep.memory, energy) === OK){
                room.memory.buildQueue.medium.pop()
            }
        }
        else if(room.memory.buildQueue.low.length > 0){
            let energy = room.energyAvailable
            let creep = room.memory.buildQueue.low[0]
            if(creep.energyLimit){
                energy = Math.min(creep.energyLimit, room.energyAvailable)
            }
            if(s.createScalingCreep(creep.name,creep.baseBody, creep.scalingBody, creep.memory, energy) === OK){
                room.memory.buildQueue.low.pop()
            }
        }
    }
}


module.exports = spawnCreeps;
return module.exports;
}
/********** End of module 17: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\spawning.js **********/
/********** Start module 18: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\utils\roomScout.js **********/
__modules[18] = function(module, exports) {

function getMiningLocations (source) {
    let miningLocations = []

    let verticalRange = 3
    let horizontalRange = 3

    let terrain = Game.map.getRoomTerrain(source.room.name)

    let yIndex = source.pos.y - (Math.floor(verticalRange / 2))
    let xIndex = source.pos.x - (Math.floor(horizontalRange / 2))
    for(let i = yIndex ; i < (yIndex + verticalRange); i++){
        for(let j = xIndex; j < (xIndex + horizontalRange); j++){
            if(terrain.get(j, i) !== TERRAIN_MASK_WALL){
                console.log("Identified new mining spot at " + j + "," + i )
                miningLocations.push(source.room.getPositionAt(j, i))
            }
        }
    }
    return miningLocations
}

function roomScout(room) {
    if(!room.memory.adjacentRooms){
        room.memory.adjacentRooms = Game.map.describeExits(room.name)
    }

    if(!room.memory.sources) {
        room.memory.sources = {}
        for(let s of room.find(FIND_SOURCES)){
            if(!room.memory.sources[s.id]) {
                room.memory.sources[s.id] = {}
                room.memory.sources[s.id].id = s.id
                room.memory.sources[s.id].x = s.pos.x
                room.memory.sources[s.id].y = s.pos.y
                room.memory.sources[s.id].miningLocations = getMiningLocations(s)
            }
        }
    }

    if(!room.memory.controller){
        room.memory.controller = room.controller.id
    }

}

module.exports = roomScout
return module.exports;
}
/********** End of module 18: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\utils\roomScout.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
