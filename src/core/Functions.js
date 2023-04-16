var parFunction = {
    /**
     * Generates the array for the input parameters
     * @param {Array} items Items of the parameter
     * @param {Boolean} duration True if start and end-time, else false
     * @param {Number} minCount Number of minutes in the simulation time
     * @param {String} repeat "weekly", "daily", or "none"
     * @param {Boolean} display True if the array should generate for display, false if it should generate for data
     * @param {Array} simItems An array of doses from the simulation date for lai and fai
     * @returns 
     */
    generateValueArray(items, duration, minCount, repeat, display, simItems){
        var tempVec = [];
        var par;
        //  Check if we need to repeat the inputs
        repeat === "daily" ? par={offset: 1440, numRepeat:minCount/1440 -1} :
        repeat === "weekly" ? par={offset: 10080, numRepeat:Math.ceil(minCount/10080) -1} : 
        par={offset:0, numRepeat:0}
        
        var elements = {}
        //  Loops thorugh the number of times to repeat
        for(var j=0; j <= par.numRepeat; j++){
            //  Cycles through every element
            items.forEach(item => {
                var size = Object.keys(elements).length;

                if(duration){       // Duration (start- and endtime)
                    //  Splits the time-input into a minute count
                    // (Remainder compensates for a bug where starttime is 2. day on a daily event)
                    var startTime;
                    var endTime;
                    if(par.offset == 0){
                        startTime = j * par.offset + item.startTime;
                        endTime = j * par.offset + item.endTime;
                    }else{
                        startTime = j * par.offset + item.startTime % par.offset;
                        endTime = j * par.offset + item.endTime % par.offset;
                    }
                    // Check if start and endtime are the save value
                    if (startTime == endTime){
                        console.log("Error: Start and Endtime can't have same value");
                    }else if (size != 0) {    // Check if there are elements in the object
                        //  Loop so we compare with all other inputs
                        for (let i = 0; i < size; i++) {
                            var casePar = {};
                            if (startTime < elements[i].startTime) {
                                casePar = {x1:startTime, y1:endTime, x2:elements[i].startTime, y2:elements[i].endTime, val1:item.value, val2:elements[i].value}
                            }else{
                                casePar = {x2:startTime, y2:endTime, x1:elements[i].startTime, y1:elements[i].endTime, val2:item.value, val1:elements[i].value}
                            }
                            // Checks which case we having (see Cases.jpg)
                            // We must check how the start and endtime of two crossing events interact
                            // as indicated by x(starttime) y(endtime) in the figure.
                            if (casePar.x1 < casePar.x2 && casePar.x2 < casePar.y1) {
                                //case 1, 2 or 4 
                                if (casePar.y1 < casePar.y2) {
                                    //case 1
                                    //console.log("Case 1")
                                    elements[i] = {startTime:casePar.x1, endTime:casePar.x2, value:casePar.val1}
                                    elements[size] = {startTime:casePar.x2, endTime:casePar.y1, value:casePar.val1+casePar.val2}
                                    elements[size+1] = {startTime:casePar.y1, endTime:casePar.y2, value:casePar.val2}
                                }else if(casePar.y1 > casePar.y2){
                                    //case 2
                                    //console.log("Case 2")
                                    elements[i] = {startTime:casePar.x1, endTime:casePar.x2, value:casePar.val1}
                                    elements[size] = {startTime:casePar.x2, endTime:casePar.y2, value:casePar.val1+casePar.val2}
                                    elements[size+1] = {startTime:casePar.y2, endTime:casePar.y1, value:casePar.val2}
                                }else if(casePar.y1 == casePar.y2){
                                    //case 4
                                    //console.log("Case 4")
                                    elements[i] = {startTime:casePar.x1, endTime:casePar.x2, value:casePar.val1}
                                    elements[size] = {startTime:casePar.x2, endTime:casePar.y1, value:casePar.val1+casePar.val2}
                                }
                            }else if (casePar.x1 == casePar.x2){
                                //case 5 or 6
                                if(casePar.y1 > casePar.y2){
                                    //case 5
                                    //console.log("Case 5")
                                    elements[i] = {startTime:casePar.x1, endTime:casePar.y2, value:casePar.val1 + casePar.val2}
                                    elements[size] = {startTime:casePar.y2, endTime:casePar.y1, value:casePar.val1}
                                }else{
                                    //case 6
                                    //console.log("Case 6")
                                    elements[i] = {startTime:casePar.x1, endTime:casePar.y1, value:casePar.val1 + casePar.val2}
                                    elements[size] = {startTime:casePar.y1, endTime:casePar.y2, value:casePar.val2}
                                }
                            } else if (casePar.y1 <= casePar.x2){
                                //case 3
                                //console.log("Case 3")
                                elements[i] = {startTime:casePar.x1, endTime:casePar.y1, value:casePar.val1}
                                elements[size] = {startTime:casePar.x2, endTime:casePar.y2, value:casePar.val2}
                            }
                        }
                    }else{
                        elements[0] = {startTime:startTime, endTime:endTime, value:item.value}
                    }
                    
                    //  Generates the array
                    var newSize = Object.keys(elements).length;
                    for(var i=0; i < newSize; i++){
                        var localVec = []
                        for (var k = 0; k < elements[i].endTime-elements[i].startTime +1; k++){
                            localVec[k] = [elements[i].startTime+k, elements[i].value]
                        }
                        tempVec[i] = localVec;
                    }
                }
                else{       // single time
                    // Split time into minute count
                    // (Remainder compensates for a bug where starttime is 2. day on a daily event)

                    // New pr. V0.208 (remove unnecessary info on meals)
                    var type;
                    if (item.type!==undefined){
                        // Abuse the fact that we only need the first or first and second word
                        // Split the string, if the first word is very, we need the second also
                        // else we just need the first
                        var split = item.type.split(' ');
                        if(split[0] == 'Very'){
                            type = split[0] + ' ' + split[1];
                        }else{
                            type = split[0]
                        }
                    }
                    
                    var time;
                    if(par.offset == 0){
                        time = j * par.offset + item.time;
                    }else{
                        time = j * par.offset + item.time % par.offset;
                    }
                    if (size != 0) { // Check if there are elements in the object
                        var exists = false;
                        //  Loop so we compare with all other inputs
                        for (let i = 0; i < size; i++) {
                            if (elements[i].time == time){
                                if (elements[i].type!==undefined){
                                    if (elements[i].type==type){
                                        elements[i].value += item.value;
                                        exists = true;
                                    }
                                }else{
                                    elements[i].value += item.value;
                                    exists = true;
                                }
                            }
                        }
                        exists ? false : elements[size] = {time:time, value:item.value, type:type}
                        exists = false;
                    }else{
                        elements[0] = {time:time, value:item.value, type:type}
                    }
                    //  Generates the array
                    var newSize = Object.keys(elements).length;
                    for(var i=0; i < newSize; i++){
                        tempVec[i] = [elements[i].time, elements[i].value, elements[i].type]
                    }
                }
            }); 
        }
        
        // Checks if there exists items from the simulation
        if(simItems != undefined){
            // Loops through all new items
            for (let j=0;j<simItems.length;j++){
                if (simItems[j][1]>0){ // do not plot if dose is 0
                var exists = false;
                // tempVec.forEach(element => {
                //     // Element is an array with [timeIndex, amount]
                //     if(element[0] == timeIndex){
                //         // If there exists a dose at the timeIndex, add the two doses
                //         element[1] = element[1] + simItems[timeIndex];
                //         exists = true;
                //     }
                // })
                for (let i=0;i<tempVec.length;i++){
                    // Element is an array with [timeIndex, amount]
                    if(tempVec[i][0] == simItems[j][0]){
                        // If there exists a dose at the timeIndex, add the two doses
                        tempVec[i][1] = tempVec[i][1] + simItems[j][1];
                        exists = true;
                    }
                }
                // If a dose at the timeIndex didn't exist, add a new array
                (!exists) ? tempVec.push([simItems[j][0], simItems[j][1]]) : null;
                }
            }
        }
        
        // Checks if we should return display array or data array
        display ? tempVec = this.generateDisplayArray(tempVec, minCount, duration) : null
        return tempVec
    },
    /**
     * Converts data array into a display array
     * @param {Array} array The data array to be converted to display
     * @param {Number} minCount Number of minutes in the simulation time
     * @param {Boolean} duration True if start and end-time, else false
     * @returns 
     */
    generateDisplayArray(array, minCount, duration){
        var displayArray = [];

        // If array is empty, don't display
        if(array.length < 1){
            return displayArray;
        }
        // If only 0 val, don't display
        var empty = true;
        for (let i = 0; i < array.length; i++) {
            if(!duration){
                if(array[i][1] > 0){
                    empty = false;
                }
            }else{
                if(array[i][0][1] > 0){
                    empty = false;
                }
            }
        }
        if(empty){
            return displayArray;
        }
        if (duration){
            var prevZero = false;
            for (let i = 0; i < array.length; i++) {
                // check if there there needs to be a zero in front
                if(i == 0){  // First iteration, zero
                    array[i].unshift([array[i][0][0], 0]);
                }
                else if(prevZero){
                    array[i].unshift([array[i][0][0],0]);
                    prevZero = false;
                }

                // check if there needs to be a zero after
                if(i == array.length-1){    // Last element in array
                    array[i].push([array[i][array[i].length-1][0], 0]);
                    prevZero = true;
                }
                else if(array[i+1][0][0] != array[i][array[i].length-1][0]){   // Next element doesn't have same time
                    array[i].push([array[i][array[i].length-1][0], 0]);
                    array[i].push([array[i][array[i].length-1][0], NaN]);
                    
                    prevZero = true;
                }
            }
            // console.log(array)
            for (let i = 0; i < array.length; i++) {
                for (let j = 0; j < array[i].length; j++) {
                    displayArray.push(array[i][j]);
                }
                // displayArray.push(NaN)
            }
        }
        else{
            // Adds a 0 before and after every datapoint so a line appears on graph
            for (let i = 0; i < array.length; i++) {
                displayArray.push([array[i][0], NaN])
                displayArray.push([array[i][0], 0])
                //Place for controlling whether to make all lines (meals, metformin etc.) same length regardless of value
                displayArray.push(array[i]);
                displayArray.push([array[i][0], 0])
                displayArray.push([array[i][0], NaN])
            }
        }

        // Adds a 0 point at the start and end of simulation
        // displayArray.unshift([0,0]);
        // displayArray.push([minCount, 0]);

        return displayArray;
    },
    /**
     * Returns the time formatted as string [dd:hh:mm]
     * @param {Number} time The minute count
     * @returns 
     */
    calculateTimeFormat(time){
      var time = time;
      // calculate (and subtract) whole days
      var days = Math.floor(time / 86400);
      time -= days * 86400;

      // calculate (and subtract) whole hours
      var hours = Math.floor(time / 3600) % 24;
      time -= hours * 3600;

      // calculate (and subtract) whole minutes
      var minutes = Math.floor(time / 60) % 60;
      time -= minutes * 60;

      // constructs time format
      return this.padTime(days)+":"+this.padTime(hours)+":"+this.padTime(minutes)
    },
    /**
     * Pads the time with 0 if it's less than 10
     * @param {Number} time the time to be padded
     * @returns {String} time padded with 0
     */
    padTime(time){
      if(Math.floor(time / 10) < 1){
        time = '0' + time
      }
      return time
    }

}
export default parFunction