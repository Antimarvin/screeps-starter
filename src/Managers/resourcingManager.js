

function getEmpireSources() {

    let sources = []

    for(let r in Memory.rooms) {
        if(Memory.rooms[r].sources){
            for(let s in Memory.rooms[r].sources) {
                sources.push(s)
            }
        }
    }
    return sources
}


 function resourcingManager(){

    //create object if it doesnt exist
    if(!Memory.resourcingManager) {
        Memory.resourcingManager = {}
    }

    //create list of all sources
    for(let s of getEmpireSources()){
        Memory.resourcingManager[s] = {
            source: Game.getObjectById(s),
            miningLocations: Memory.rooms[Game.getObjectById(s).roomName].sources[s].miningLocations,

        }
    }
 }

 module.exports = resourcingManager