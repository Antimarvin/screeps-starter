let roomScout = require('./utils/roomScout');

//Initialize rooms with data
Room.prototype.init = function (){
    console.log("Running init for ." + this.name)
    this.memory.hrPlan = {
        harvester: {
            role: 'harvester',
            minQty: this.find(FIND_SOURCES).length
        },
        truck: {
            role: 'truck',
            minQty: 2
        },
        upgrader: {
            role: 'upgrader',
            minQty: 1
        },
        builder: {
            role: 'builder',
            minQty: 1
        },
        repairer: {
            role: 'repairer',
            minQty: 1
        }
    }
}

/** @param {Boolean} debug_status **/
Room.prototype.update = function update(debug_status) {
    //if this room has no memory then initialize the room
    if (!this.memory.hrPlan || debug_status) {
        this.init();
    }
    roomScout(this)
}
