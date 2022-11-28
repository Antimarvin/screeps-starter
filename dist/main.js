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
let creepLogic = __require(1,0);
let roomLogic = __require(2,0);
let prototypes = __require(3,0);


module.exports.loop = function () {
    var myRooms = _.filter(Game.rooms, r => r.controller && r.controller.level > 0 && r.controller.my);
    _.forEach(myRooms, r => roomLogic.resourcePlan(r));
    _.forEach(myRooms, r => roomLogic.spawning(r));
    for(var n in Game.creeps) {
        var creep = Game.creeps[n];

        let role = creep.memory.role;
        if (creepLogic[role]) {
            creepLogic[role].run(creep);
        }
    }
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}
return module.exports;
}
/********** End of module 0: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\main.js **********/
/********** Start module 1: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\index.js **********/
__modules[1] = function(module, exports) {
let creepLogic = {
    harvester:     __require(4,1),
    upgrader:      __require(5,1),
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 1: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\index.js **********/
/********** Start module 2: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\index.js **********/
__modules[2] = function(module, exports) {
let roomLogic = {
    spawning:     __require(6,2),
    resourcePlan: __require(7,2)
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 2: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\index.js **********/
/********** Start module 3: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\index.js **********/
__modules[3] = function(module, exports) {
let files = {
    creep: __require(8,3)
}
return module.exports;
}
/********** End of module 3: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\index.js **********/
/********** Start module 4: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\harvester.js **********/
__modules[4] = function(module, exports) {
var harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            creep.say('Mining!')
            if(creep.harvest(creep.memory.target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.target);
            }
        }
        else {
            creep.say('Full');
            
            if(creep.transfer(Game.spawns['Spawn1'], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns['Spawn1']);
            }
        }
    },
    spawnData: function(room, instruction) {
            let body = [WORK, CARRY, MOVE];
            let memory = {role: 'harvester', busy: false};
        
            return {body, memory};
    }
};

module.exports = harvester;
return module.exports;
}
/********** End of module 4: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\harvester.js **********/
/********** Start module 5: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\upgrader.js **********/
__modules[5] = function(module, exports) {
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store[RESOURCE_ENERGY] == 0) {
            if(creep.room.energyAvailable > 0) {
                var storage = creep.room.find(FIND_MY_STRUCTURES).find(structure => structure.store[RESOURCE_ENERGY] > 0);
                if (creep.withdraw(storage, RESOURCE_ENERGY)) {
                    creep.moveTo(storage);
                }
            }
        }
        else {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    },
    spawn: function(room) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.room.name == room.name);
        console.log('Upgraders: ' + upgraders.length, room.name);

        if (upgraders.length < 2) {
            return true;
        }
    },
    spawnData: function(room) {
            let name = 'Upgrader' + Game.time;
            let body = [WORK, CARRY, MOVE];
            let memory = {role: 'upgrader', status: false};
        
            return {name, body, memory};
    }
};

module.exports = roleUpgrader;
return module.exports;
}
/********** End of module 5: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\creeps\upgrader.js **********/
/********** Start module 6: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\spawning.js **********/
__modules[6] = function(module, exports) {
let creepLogic = __require(1,6);
let creepTypes = _.keys(creepLogic);

function spawnCreeps(room) {
    BQ = room.memory.buildQueue
    if (BQ) {
        let creepSpawnData = creepLogic[BQ[0].role] && creepLogic[BQ[0].role].spawnData(room, BQ[0].instruction);
        console.log(room, JSON.stringify(creepSpawnData));

        if (creepSpawnData) {
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            let result = spawn.spawnCreep(creepSpawnData.body, BQ[0].name, {memory: creepSpawnData.memory});

            console.log("Tried to Spawn:", creepTypeNeeded, result)
        }
    }
}

module.exports = spawnCreeps;
return module.exports;
}
/********** End of module 6: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\spawning.js **********/
/********** Start module 7: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\resoucePlan.js **********/
__modules[7] = function(module, exports) {

function getCreepsOfRole (role, room) {
    return _.filter(Game.creeps, creep => creep.memory.role == role && creep.room.name == room.name);
}

function creepNeedsToBeMade(source, room){
    for(var creep of getCreepsOfRole('harvester', room)) {
        if (creep.memory.target == source) {
            return false
        }
    }
    for (var i of room.memory.buildQueue){
        if (i.target == source){
            return false
        }
    }
    return true
}

function resourcePlan (room) {
    if (!room.memory.buildQueue) {
        room.memory.buildQueue = [];
    }

    for (var source of room.find(FIND_SOURCES_ACTIVE)){
        if(creepNeedsToBeMade(source, room)){
            room.memory.buildQueue.push({name: 'Miner ' + source, instructions: {target: source}, role: 'harvester'})
        }
    }

}

module.exports = resourcePlan;
return module.exports;
}
/********** End of module 7: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\room\resoucePlan.js **********/
/********** Start module 8: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\creep.js **********/
__modules[8] = function(module, exports) {
Creep.prototype.sayHello = function sayHello() {
    this.say("Hello", true);
}
return module.exports;
}
/********** End of module 8: S:\Employee Folders\Ricky Sweat\Projects\screeps-starter\src\prototypes\creep.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
