/**
 * Contains functions related to the displaying of lines on the graph
 */
var Display = {
    // Predefined colors for the first 6 displayed states
    colors: [
        "hsla(0, 100%, 50%, 1)",
        "hsla(109, 100%, 40%,1)",
        "hsla(208, 100%, 50%,1)",
        "hsla(27, 100%, 50%,1)",
        "hsla(240, 100%, 40%,1)",
        "hsla(290, 100%, 40%,1)",
    ],
    colorInUse: [false, false, false, false, false, false],
    /**
     * Changes what states are displayed on the graph
     * @param {{name:String, bool:Boolean}} par Array with the parameters given below
     * @param {Object} response The reponse object
     * @param {Object} graphInfo The Graph info object
     * @param {Object} displayStates The displayStates object
     * @param {String} compareTo The name of the compareTo
     * @param {Array} AxisTitle The axis title array
     * @param {String} compare The name of the compare
     * @returns if second y-axis should be displayed
     */
    stateChange(par, response, graphInfo, displayStates, compareTo, AxisTitle, compare) {
        let showSecondAxis;
        // Display stuff, should the state be deleted or drawn
        // Cycles through all the responses
        for (let j = 0; j < response.length; j++) {
            // If the response is the compare, or the one to compare with
            if (response[j].name == compare || response[j].name == compareTo) {
                // Generate the label for the state
                let name = "";
                let unit = displayStates[par.name].unit;
                name = '[' + response[j].name + '] ' + par.name
                // If true we must draw the state
                if (par.bool) {
                    let output = [];
                    let data = response[j].data
                    for (let i = 0; i < data.tout.length; i++) {
                        output.push([data.tout[i], data.yout[par.name][i]])
                    }
                    if (par.axis == "r") {
                        graphInfo.datasets.push(this.datasetObj(name, "right-y-axis", par.name, true, output, displayStates, graphInfo))
                        showSecondAxis = true;
                    } else {
                        graphInfo.datasets.push(this.datasetObj(name, "left-y-axis", par.name, true, output, displayStates, graphInfo))
                    }
                    
                    // graphInfo.datasets = graphInfo.datasets.map((item) => item.label === name ? { ...item, data: output } : item)
                }// else we delete the state
                else {
                    name = name + ' ' + unit;
                    if (par.axis == 'r') {
                        graphInfo.datasets = graphInfo.datasets.filter((item) => {
                            if (item.label == name && item.yAxisID == "right-y-axis") {
                                this.removeColorInUse(item.backgroundColor);
                                return false
                            } else {
                                return true
                            }
                        })
                        var lastOne = true;
                        for (let i = 0; i < graphInfo.datasets.length; i++) {
                            if (graphInfo.datasets[i].yAxisID == "right-y-axis") {
                                lastOne = false;
                            }
                        }
                        lastOne ? showSecondAxis = false : null
                    } else if (par.axis == 'l') {
                        graphInfo.datasets = graphInfo.datasets.filter((item) => {
                            if (item.label == name && item.yAxisID == "left-y-axis") {
                                this.removeColorInUse(item.backgroundColor);
                                return false
                            } else {
                                return true
                            }
                        })
                    }
                }
            }
        }
        this.displayAxisTitle(displayStates, AxisTitle);

        return showSecondAxis
    },
    /**
     * Generates the nescessary stuff to display a new dataset
     * @param {String} label Name of the new dataset
     * @param {String} axis Name of the axis to display on
     * @param {String} colorKey Name of the key to match the color with
     * @param {Boolean} primary Is it primary or not (Current or the compareTo)
     * @param {Object} data Data that's to be plottet
     * @param {Object} displayStates The displayStates object
     * @param {Object} graphInfo The graphInfo object
     * @param {String} primaryKey Name of the primary compare
     * @returns 
     */
    datasetObj(label, axis, colorKey, primary, data, displayStates, graphInfo, primaryKey) {
      // if (label !== colorKey) {
      //     primary = false;
      // }
      label = label + ' ' + displayStates[colorKey].unit;
      var color = "";
      // var borderWidth = 3;
      if (primary) {
          if (!this.colorInUse[0]) {
              color = this.colors[0];
              this.colorInUse[0] = true;
          }else if (!this.colorInUse[1]){
              color = this.colors[1];
              this.colorInUse[1] = true;
          }else if (!this.colorInUse[2]){
              color = this.colors[2];
              this.colorInUse[2] = true;
          }else if (!this.colorInUse[3]){
              color = this.colors[3];
              this.colorInUse[3] = true;
          }else if (!this.colorInUse[4]){
              color = this.colors[4];
              this.colorInUse[4] = true;
          }else if (!this.colorInUse[5]){
              color = this.colors[5];
              this.colorInUse[5] = true;
          }else{
              color = this.generateRandomColor();
          }
      }
      else {
          graphInfo.datasets.forEach(dataset => {
              if (dataset.label == "[" + primaryKey+ "] " + colorKey + ' ' + displayStates[colorKey].unit && dataset.yAxisID == axis) {
                  // borderWidth = 2;
                  color = dataset.backgroundColor;
                  var colorSplit = color.split(",")
                  color = colorSplit[0] + "," + colorSplit[1] + "," + colorSplit[2] +",30%)";
              }

          });
      }
      // var borderdash;
      // primary ? null : borderdash = [5,5];
      return { label: label, yAxisID: axis, backgroundColor: color, borderColor: color, data: data};
  },
    /**
     * Generates a random color in hsl format
     * @returns String of a hsl color
     */
    generateRandomColor() {
        var num = Math.floor(Math.random() * 360);
        var color = "hsla(" + num + ",100%,50%,1)";
        return color
    },
    /**
     * Remove the color from the in use list
     * @param {String} color String of the hsl color
     */
    removeColorInUse(color){
        for (let i = 0; i < this.colors.length; i++) {
            if (this.colors[i] == color){
                this.colorInUse[i] = false;
            }   
        }
    },
    /**
     * Changes the labels of the axis titles
     * @param {*} displayStates The displayStates object
     * @param {*} AxisTitle The AxisTitle object
     */
    displayAxisTitle(displayStates, AxisTitle){
        // For title display on the chart
        let count = [0, 0]
        let tempTitle = ['','']
        var keys = Object.keys(displayStates);
        for (let i = 0; i < keys.length; i++) {
            if(displayStates[keys[i]].l){
                count[0]++;
                keys[i] == 'GH' ? tempTitle[0] = 'Blood Glucose (' +displayStates[keys[i]].name + ') ' + displayStates[keys[i]].unit : 
                keys[i] == 'IH' ? tempTitle[0] = 'Blood Insulin (' +displayStates[keys[i]].name + ') ' + displayStates[keys[i]].unit :
                tempTitle[0] = displayStates[keys[i]].name + ' ' + displayStates[keys[i]].unit;
            }
            if(displayStates[keys[i]].r){
                count[1]++;
                keys[i] == 'GH' ? tempTitle[1] = 'Blood Glucose (' +displayStates[keys[i]].name + ') ' + displayStates[keys[i]].unit : 
                keys[i] == 'IH' ? tempTitle[1] = 'Blood Insulin (' +displayStates[keys[i]].name + ') ' + displayStates[keys[i]].unit :
                tempTitle[1] = displayStates[keys[i]].name + ' ' + displayStates[keys[i]].unit;
            }
        }
        count[0] == 1 ? AxisTitle[0] = tempTitle[0] : AxisTitle[0] = '';
        count[1] == 1 ? AxisTitle[1] = tempTitle[1] : AxisTitle[1] = '';
    },
    /**
     * Changes what response is compared to
     * @param {String} newName Name of the new compareTo
     * @param {String} compareTo Old compare to
     * @param {Object} Response The response object
     * @param {Object} graphInfo The graphInfo object
     * @param {Object} displayStates The displayStates object
     * @param {Boolean} primary Boolean indication if it's the primary or not
     * @param {String} primaryKey Name of the primary compare
     * @returns the name of the new response to compare with
     */
    changeCompare(newName, compareTo, Response, graphInfo, displayStates, primary, primaryKey){
        // Generates necessary variables
        var oldName = compareTo;
        var newResponse = [];
        // console.log(Response)
        Response.forEach(item => {
          item.name === newName ? newResponse = item : null
        });
        // Deletes old response from plot
        var keys = Object.keys(displayStates);
        for (let i=0;i<keys.length;i++){
            graphInfo.datasets = graphInfo.datasets.filter((item) => {
                if (item.label == '['+oldName+'] '+ keys[i] + ' ' + displayStates[keys[i]].unit ) {
                    this.removeColorInUse(item.backgroundColor);
                    // Dont let this through the filter
                    return false
                } else {
                    // Let this through the filter
                    return true
                }
            })
        }
        // Creates new data to graphInfo
        if(newName != 'None'){
            for (let i = 0; i < keys.length; i++){
                // Checks if state is displayed on left
                if(displayStates[keys[i]]['l']){
                // Creates the new graph
                    let name = '['+newName+'] '+ keys[i]
                    let output = [];
                    let data = newResponse.data
                    for (let j = 0; j < data.tout.length; j++) {
                        output.push([data.tout[j],data.yout[keys[i]][j]])
                    }
                    graphInfo.datasets.push(Display.datasetObj(name,"left-y-axis",keys[i],primary,output, displayStates, graphInfo, primaryKey));
                }
                // Checks if state is displayed on right
                if(displayStates[keys[i]]['r']){
                // Creates the new graph
                    let name = '['+newName+'] '+ keys[i]
                    let output = [];
                    let data = newResponse.data;
                    for (let j = 0; j < data.tout.length; j++) {
                        output.push([data.tout[j],data.yout[keys[i]][j]])
                    }
                    graphInfo.datasets.push(Display.datasetObj(name,"right-y-axis",keys[i],primary,output, displayStates, graphInfo, primaryKey));
                }
            } 
        }
        return newName
    },
}
export default Display