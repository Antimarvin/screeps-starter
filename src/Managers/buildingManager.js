let creepLogic = require('.././creeps/index');

function buildingManager(castleRoom){

    //initialize creep list
    Memory.buildingManager = {
        creeps: [creepLogic.builder.defaultSettings(castleRoom.name,1),
                 creepLogic.builder.defaultSettings(castleRoom.name,2),
                 creepLogic.builder.defaultSettings(castleRoom.name,3),
                 creepLogic.builder.defaultSettings(castleRoom.name,4),
                 creepLogic.builder.defaultSettings(castleRoom.name,5)
        ]
    }

    // get all constructions sites into a list
    let constructionSites = Object.values(Game.constructionSites)
    Memory.buildingManager.constructionSites = constructionSites

    //get a list of all structures in my rooms to see if they need repair.
    let mystructures = []
    for(let roomKey in Game.rooms){
        let room = Game.rooms[roomKey]
        //console.log(room.find(FIND_STRUCTURES, {filter: s => s.my}))
        let myRoomStructures = room.find(FIND_STRUCTURES)
        for(let structure of myRoomStructures){
            mystructures.push(structure)
        }
    }


    //filter myStructures first to see if they need to be repaired, then by structure type to prioritize economic buildings.
    let highPriorityRepair = _.filter(mystructures, i => i.hits < i.hitsMax
        && (i.structureType === STRUCTURE_SPAWN
        || i.structureType === STRUCTURE_STORAGE
        || i.structureType === STRUCTURE_EXTENSION))
    Memory.buildingManager.highPriorityRepair = highPriorityRepair

    let mediumPriorityRepair = _.filter(mystructures, i => i.hits < i.hitsMax
        && (i.structureType === STRUCTURE_LAB
            || i.structureType === STRUCTURE_CONTAINER
            || i.structureType === STRUCTURE_LINK))
    Memory.buildingManager.mediumPriorityRepair = mediumPriorityRepair

    let lowPriorityRepair = _.filter(mystructures, i => i.hits < i.hitsMax)
    Memory.buildingManager.lowPriorityRepair = lowPriorityRepair

    console.log(`The length of constructionSites is ${constructionSites.length}`)
    console.log(`The length of high repair is ${highPriorityRepair.length}`)
    console.log(`The length of medium repair is ${mediumPriorityRepair.length}`)
    console.log(`The length of low repair is ${lowPriorityRepair.length}`)



    // Check to make sure all your creeps are spawned, if not add them to build queue
    for(let i = 0; i < Memory.buildingManager.creeps.length; i++) {
        if(!(Memory.buildingManager.creeps[i].name in Game.creeps)){
            console.log(`${Memory.buildingManager.creeps[i].name} was not in game creeps`)
            castleRoom.memory.buildQueue.medium.push(Memory.buildingManager.creeps[i])
        }
    }


    //loop through all builder creeps and assign them a target and an action to perform on that target
    let builders = _.filter(Game.creeps, c => c.memory.role === 'builder')

    if(Object.keys(builders).length > 0){
        for(let b in builders){
            let builder = builders[b]


            //If construction sites, then assign them out. TOP PRIORITY
            if(constructionSites.length > 0){
                //console.log(JSON.stringify(constructionSite))
                let target = builder.pos.findClosestByPath(constructionSites)
                if(target){
                    constructionSites.splice(constructionSites.indexOf(target), 1)
                }
                builder.memory.job = "Build"
                builder.memory.jobTarget = target
            }

            else if (highPriorityRepair.length > 0){
                let target = builder.pos.findClosestByPath(highPriorityRepair)
                if(target){
                    highPriorityRepair.splice(highPriorityRepair.indexOf(target), 1)
                }
                builder.memory.job = "Repair"
                builder.memory.jobTarget = target
            }
            else if (mediumPriorityRepair.length > 0){
                let target = builder.pos.findClosestByPath(mediumPriorityRepair)
                if(target){
                    mediumPriorityRepair.splice(mediumPriorityRepair.indexOf(target), 1)
                }

                builder.memory.job = "Repair"
                builder.memory.jobTarget = target
            }
            else if (lowPriorityRepair.length > 0){
                let target = builder.pos.findClosestByPath(lowPriorityRepair)
                if(target){
                    lowPriorityRepair.splice(lowPriorityRepair.indexOf(target), 1)
                }
                builder.memory.job = "Repair"
                builder.memory.jobTarget = target
            }
            else {
                builder.memory.job = "Upgrade"
                builder.memory.jobTarget = builder.room.controller
            }
        }
    }


}
module.exports = buildingManager