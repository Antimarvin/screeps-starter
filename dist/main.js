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
    room: __require(6,1)
}
return module.exports;
}
/********** End of module 1: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\index.js **********/
/********** Start module 2: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\index.js **********/
__modules[2] = function(module, exports) {
let creepLogic = {
    harvester:     __require(7,2),
    upgrader:      __require(8,2),
}

module.exports = creepLogic;
return module.exports;
}
/********** End of module 2: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\index.js **********/
/********** Start module 3: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\room\index.js **********/
__modules[3] = function(module, exports) {
let roomLogic = {
    spawning:     __require(9,3)
}

module.exports = roomLogic;
return module.exports;
}
/********** End of module 3: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\room\index.js **********/
/********** Start module 4: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\.screeps.json **********/
__modules[4] = function(module, exports) {
module.exports = {
  "email": "Antimarvin@gmail.com",
  "password": "Amarvin2",
  "branch": "default",
  "ptr": false,
  "local_test_address": "C:\\Users\\Antimarvin\\AppData\\Local\\Screeps\\scripts\\127_0_0_1___21025\\default",
  "debug": true
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
let creepLogic = __require(2,6);
function findOptimumSourcePlan(storageLocation, source) {
    let creepList = []
    let sourcePlan = {};
    sourcePlan.quantity = 2;
    sourcePlan.bodyType = "speed";
    sourcePlan.target = source.id;

    for(let i=0; i < sourcePlan.quantity; i++){
        let spawnData = creepLogic.harvester.spawnData(sourcePlan.bodyType);
        spawnData.memory.target = sourcePlan.target;
        spawnData.name = spawnData.name + "S" + source.id + "_" + i;
        creepList.push(spawnData)
    }
    return creepList;
}

Room.prototype.creepNotInQueue = function creepNotInQueue(creep){
    for(let c of this.memory.buildQueue){
        if(c.name === creep.name){
            return false
        }
    }
    return true
}

Room.prototype.creepNotExist = function creepNotExist(creep){
    for(let c in Game.creeps){
        if(c.name === creep.name){
            return false
        }
    }
    return true

}

Room.prototype.resourcePlanning = function resourcePlanning(){
    console.log("Creating resource plan for  "+ this.name);
    this.memory.resourcePlan = {};

    let roomSources = this.find(FIND_SOURCES);

    for(let source of roomSources){
        this.memory.resourcePlan[source.id] = findOptimumSourcePlan(this.find(FIND_MY_SPAWNS)[0], source);
    }
}
Room.prototype.init = function init(){
    console.log("Running init.")
    if(!this.memory.buildQueue) {
        this.memory.buildQueue = [];
    }
    this.resourcePlanning();

}

/** @param {Boolean} debug_status **/
Room.prototype.update = function update(debug_status) {
    if (!this.memory || debug_status) {
        this.init();
    }
    console.log("Updating " + this.name);
    let rp = this.memory.resourcePlan;
    if (!rp) {
        this.resourcePlanning();
    }
    if (rp) {
        for (let source in rp) {

            let creeps = _.filter(Game.creeps, c => c.room.name === this.name &&
                c.memory.target === source &&
                c.memory.bodyType === rp[source].bodyType);

            let creepNames = []
            _.forEach(creeps, c => creepNames.push(c.name))

            console.log("The # of creeps that match the plan: " + creeps.length);
            console.log(rp[source][0])

            for(let i in rp[source]) {
                console.log("Checking" + i)
                if (this.creepNotInQueue(rp[source][i]) && this.creepNotExist(rp[source][i])) {
                    this.memory.buildQueue.push(rp[source][i])

                }
            }
        }
    }
}
return module.exports;
}
/********** End of module 6: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\prototypes\room.js **********/
/********** Start module 7: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\harvester.js **********/
__modules[7] = function(module, exports) {
const HARVESTER_TYPES = {
    speed: [WORK, CARRY, MOVE, MOVE],
    capacity: [WORK, CARRY, CARRY, MOVE],
    efficiency: [WORK, WORK, CARRY, MOVE]
}

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
    /** *
     * @param {string} type
     */
    spawnData: function(type) {
            let body = HARVESTER_TYPES[type];
            let memory = {role: 'harvester', busy: false};
            let name = type + " Harvester ";

            return {body: body, name: name, memory: memory};
    }
};

module.exports =  harvester;
return module.exports;
}
/********** End of module 7: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\harvester.js **********/
/********** Start module 8: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\upgrader.js **********/
__modules[8] = function(module, exports) {
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
/********** End of module 8: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\creeps\upgrader.js **********/
/********** Start module 9: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\room\spawning.js **********/
__modules[9] = function(module, exports) {
//let creepLogic = __require(2,9);

function spawnCreeps(room) {
    let bq = room.memory.buildQueue
    console.log("Trying to spawn from build queue: " + bq[0].name)
    if (bq.length > 0) {
        let creepSpawnData = room.memory.buildQueue[0]

        if (creepSpawnData) {
            let spawn = room.find(FIND_MY_SPAWNS)[0];
            let result = spawn.spawnCreep(creepSpawnData.body,
                                          creepSpawnData.name,
                {memory: creepSpawnData.memory})
            if(result === 0) {
                room.memory.buildQueue.shift()
            }
            console.log("Tried to Spawn:", creepSpawnData.name, result)
        }
    }
}

module.exports = spawnCreeps;
return module.exports;
}
/********** End of module 9: C:\Users\Antimarvin\Documents\GitHub\screeps-starter\src\room\spawning.js **********/
/********** Footer **********/
if(typeof module === "object")
	module.exports = __require(0);
else
	return __require(0);
})();
/********** End of footer **********/
