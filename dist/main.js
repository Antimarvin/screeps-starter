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
/********** Start module 0: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\main.js **********/
__modules[0] = function(module, exports) {
let prototypes = __require(1,0); //needs to be called to update prototypes. otherwise unused
let creepLogic = __require(2,0);
let roomLogic = __require(3,0);
let config = __require(4,0);


module.exports.loop = function () {
    let debug_status = config.debug
    let myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    _.forEach(myRooms, r => r.update(debug_status));

    _.forEach(myRooms, r => roomLogic.spawning(r));
    for(let n in Game.creeps) {
        let creep = Game.creeps[n];


        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
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
/********** End of module 0: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\main.js **********/
/********** Start module 1: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\index.js **********/
__modules[1] = function(module, exports) {
let files = {
    creep: __require(5,1),
    room: __require(6,1),
    structureSpawn: __require(7,1)
}
return module.exports;
}
/********** End of module 1: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\index.js **********/
/********** Start module 2: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\index.js **********/
__modules[2] = function(module, exports) {
let creepLogic = {
    harvester:     __require(8,2),
    upgrader:      __require(9,2),
    builder:       __require(10,2)
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 2: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\index.js **********/
/********** Start module 3: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\room\index.js **********/
__modules[3] = function(module, exports) {
let roomLogic = {
    spawning:     __require(11,3)
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 3: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\room\index.js **********/
/********** Start module 4: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\.screeps.json **********/
__modules[4] = function(module, exports) {
module.exports = {
  "email": "antimarvin@gmail.com",
  "password": "Amarvin2",
  "branch": "main",
  "ptr": false,
  "local_test_address": "",
  "debug": false
}
return module.exports;
}
/********** End of module 4: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\.screeps.json **********/
/********** Start module 5: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\creep.js **********/
__modules[5] = function(module, exports) {
Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}

return module.exports;
}
/********** End of module 5: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\creep.js **********/
/********** Start module 6: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\room.js **********/
__modules[6] = function(module, exports) {
//Initialize rooms with data
Room.prototype.init = function init(){
    console.log("Running init for ." + this.name)
    this.memory.hrPlan = {
        harvester: {
            role: 'harvester',
            minQty: 2
        },
        upgrader: {
            role: 'upgrader',
            minQty: 2
        },
        builder: {
            role: 'builder',
            minQty: 5
        }
    }

}

/** @param {Boolean} debug_status **/
Room.prototype.update = function update(debug_status) {
    if (!this.memory.hrPlan || debug_status) {
        this.init();
    }
}

return module.exports;
}
/********** End of module 6: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\room.js **********/
/********** Start module 7: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\structureSpawn.js **********/
__modules[7] = function(module, exports) {


StructureSpawn.prototype.createScalingWorker = function (role, energy){
    let baseBodyCost = BODYPART_COST.work + 2 * ( BODYPART_COST.move) + BODYPART_COST.carry;
    let bodyStacks = Math.floor(energy/baseBodyCost);
    let workerBaseBodyDefinition = [WORK,MOVE,MOVE,CARRY];
    let body = [];

    for(let part of workerBaseBodyDefinition){
        for(let i = 0; i < bodyStacks; i ++ ){
            body.push(part);
        }
    }
    let name = Game.time.toString();
    return this.spawnCreep(body, name, {memory: {role: role, working: false}});
}
return module.exports;
}
/********** End of module 7: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\structureSpawn.js **********/
/********** Start module 8: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\harvester.js **********/
__modules[8] = function(module, exports) {
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
return module.exports;
}
/********** End of module 8: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\harvester.js **********/
/********** Start module 9: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\upgrader.js **********/
__modules[9] = function(module, exports) {
let harvester = __require(8,9)

var roleUpgrader = {

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
            creep.say('Upgrading');
            if(creep.transfer(creep.room.controller, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if (creep.store.energy === 0) {
                creep.memory.working = false
            }
        }
    }
};

module.exports = roleUpgrader;
return module.exports;
}
/********** End of module 9: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\upgrader.js **********/
/********** Start module 10: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\builder.js **********/
__modules[10] = function(module, exports) {
const upgrader = __require(9,10);
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
return module.exports;
}
/********** End of module 10: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\builder.js **********/
/********** Start module 11: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\room\spawning.js **********/
__modules[11] = function(module, exports) {
//let creepLogic = __require(2,11);

function spawnCreeps(room) {
    let spawns = room.find(FIND_MY_SPAWNS)
    for (let s of spawns){
        let creepsInRoom = room.find(FIND_MY_CREEPS)
        let hrPlan = room.memory.hrPlan
        for(let r in hrPlan) {
            let numInRole = _.sum(creepsInRoom, c => c.memory.role === hrPlan[r].role)
            if(numInRole < hrPlan[r].minQty){
                console.log ("Attempting spawn of " + hrPlan[r].role + " with " + s.room.energyCapacityAvailable)
                let result = s.createScalingWorker(hrPlan[r].role, s.room.energyCapacityAvailable)
            }
        }
    }
}

module.exports = spawnCreeps;
return module.exports;
}
/********** End of module 11: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\room\spawning.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
