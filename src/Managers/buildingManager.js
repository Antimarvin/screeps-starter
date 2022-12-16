let creepLogic = require('.././creeps/index');

function buildingManager(castleRoom){

    //initialize creep list
    Memory.buildingManager = {
        creeps: [creepLogic.builder.defaultSettings(castleRoom.name,1),
                 creepLogic.builder.defaultSettings(castleRoom.name,2),
                 creepLogic.builder.defaultSettings(castleRoom.name,3)
        ]
    }

    // get all constructions sites into a list
    let constructionSites = Object.values(Game.constructionSites)
    Memory.buildingManager.constructionSites = constructionSites

    //get a list of all structures in my rooms to see if they need repair.
    let myStructures = []
    for(let roomKey in Game.rooms){
        let room = Game.rooms[roomKey]
        //console.log(room.find(FIND_STRUCTURES, {filter: s => s.my}))
        let myRoomStructures = room.find(FIND_STRUCTURES)
        for(let structure of myRoomStructures){
            myStructures.push(structure)
        }
    }


    //filter myStructures first to see if they need to be repaired, then by structure type to prioritize economic buildings.
    let highPriorityRepair = _.filter(myStructures, i => i.hits < i.hitsMax
        && (i.structureType === STRUCTURE_SPAWN
        || i.structureType === STRUCTURE_STORAGE
        || i.structureType === STRUCTURE_EXTENSION
        || i.structureType === STRUCTURE_LAB
        || i.structureType === STRUCTURE_CONTAINER
        || i.structureType === STRUCTURE_LINK))
    Memory.buildingManager.highPriorityRepair = highPriorityRepair

    let Repair = _.filter(myStructures, i => i.hits < i.hitsMax
        && (i.structureType !== STRUCTURE_WALL))
    Memory.buildingManager.repair = Repair

    let wallRepair = _.filter(myStructures, i => i.hits < i.hitsMax
        && i.structureType === STRUCTURE_WALL)
    Memory.buildingManager.wallRepair = wallRepair

    console.log(`The length of constructionSites is ${constructionSites.length}`)
    console.log(`The length of high priority repair is ${highPriorityRepair.length}`)
    console.log(`The length of normal repair is ${Repair.length}`)
    console.log(`The length of wall repair is ${wallRepair.length}`)



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
                let target
                let currentRoomSites = _.filter(constructionSites, s => s.pos.roomName === builder.pos.roomName)
                if(currentRoomSites.length > 0){
                    target = builder.pos.findClosestByPath(currentRoomSites)
                    //target will be null if no accessible construction sites in creeps current room, so we give it the first site in the list
                    if(target){
                        constructionSites.splice(constructionSites.indexOf(target), 1)
                    }
                } else {
                    target = constructionSites.splice(0, 1)[0]
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
            else if (Repair.length > 0){
                let target = builder.pos.findClosestByPath(Repair)
                if(target){
                    Repair.splice(Repair.indexOf(target), 1)
                }
                builder.memory.job = "Repair"
                builder.memory.jobTarget = target
            }
            else if (wallRepair.length > 0){

                let target

                for(let percentage = 0.0001; percentage < 1; percentage = percentage + 0.0001){
                    for(let wall of wallRepair){
                        if(wall.hits/wall.hitsMax < percentage){
                            target = wall

                        }
                    }
                }
                if(target){
                    wallRepair.splice(wallRepair.indexOf(target), 1)
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