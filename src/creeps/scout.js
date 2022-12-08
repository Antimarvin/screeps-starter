var roleScout = {
    /** @param {Creep} creep **/
    run: function(creep) {


    },
    defaultSettings: function (serialNumber) {
        return {
            name: `Scout_${serialNumber}`,
            baseBody: [],
            scalingBody: [CARRY, CARRY, MOVE],
            memory: {
                role: 'miningTruck',
                working: false,
                targetMiningPosition: targetMiningPosition,
                depositRoom: depositRoom
            }
        }
    }
}

module.exports = roleScout;