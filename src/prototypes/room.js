let roomScout = require('./utils/roomScout');

//Initialize rooms with data

Room.prototype.validateMemory = function () {
    // no memory, create it
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
    //if this room has no memory then initialize the room
    this.validateMemory()


}
