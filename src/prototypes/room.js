//Initialize rooms with data
Room.prototype.init = function init(){
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
            minQty: 2
        },
        builder: {
            role: 'builder',
            minQty: 5
        },
        repairer: {
            role: 'repairer',
            minQty: 5
        }
    }

}

/** @param {Boolean} debug_status **/
Room.prototype.update = function update(debug_status) {
    //if this room has no memory then initialize the room
    if (!this.memory.hrPlan || debug_status) {
        this.init();
    }
}
