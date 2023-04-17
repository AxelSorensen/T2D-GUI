<template>
  <Scatter ref="graph" :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
    :plugins="plugins" />
</template>

<script>
// Setup stuff (can be used to remove elements if not needed to minimize file size)
import { Scatter } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, CategoryScale, LinearScale, Chart, Filler } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import TextIconButton from './TextIconButton.vue';
// Registers the plugins
ChartJS.register(Title, Tooltip, CategoryScale, LinearScale, Filler);
Chart.register(zoomPlugin);
Chart.register(annotationPlugin);

export default {
  name: 'ScatterChart',
  components: { Scatter,TextIconButton },
  props: {
    chartData: {
      type: Object,
      required: true,
      default: []
    },
    chartId: {
      type: String,
      default: 'chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    plugins: {
      type: Array,
      default: () => []
    },
    xMax: {
      type: Number,
      default: 1440
    },
    xMin: {
      type: Number,
      default: 3
    },
    simProg:0,
    zoom: {
      type: Boolean,
      default: true
    },
    showSecondAxis: {
      type: Boolean,
      default: false
    },
    showGlycemia: {
      type: Number,
    },
    GlycemiaInterval: Object,
    GH: Object,
    axisTitleChange: {
      type: Number,
    },
    AxisTitle: Array,
    graphScroll: Boolean,
  },
  // Watches for changes in the props.
  watch: {
    // if xMax changes, change the limit in options
    xMax: function (newVal, oldVal) {
      // Updates the rest
      this.chartOptions.scales.x.max = newVal;
      this.chartOptions.plugins.zoom.limits.x.max = newVal;
      this.chartOptions.plugins.annotation.annotations.lGlycemia.xMax = newVal;
      this.chartOptions.plugins.annotation.annotations.rGlycemia.xMax = newVal;
    },
    // If zoom changes, change enable in options
    zoom: function (newVal, oldVal) {
      // Scale time axis so everyting is displayed
      // newVal == false ? this.chartOptions.scales.x.min = 0*1440 : this.chartOptions.scales.x.min = this.xMax - this.xMin*1440;
      // console.log('zoom',newVal,oldVal)
      this.chartOptions.plugins.zoom.zoom.pinch.enabled = newVal;
      this.graphScroll ? this.chartOptions.plugins.zoom.zoom.wheel.enabled = newVal : null;
    },
    // If second axis changes, change in option
    showSecondAxis: function (newVal, oldVal) {
      this.chartOptions.scales['right-y-axis'].display = newVal;
    },
    // If the glycemia box (Green area) should be displayed
    showGlycemia: function (newVal, oldVal) {
      this.chartOptions.plugins.annotation.annotations.lGlycemia.display = this.GH.l
      this.chartOptions.plugins.annotation.annotations.rGlycemia.display = this.GH.r
    },
    // If the values for the glycemia interval has been changed
    GlycemiaInterval: {
      handler() {
        this.chartOptions.plugins.annotation.annotations.lGlycemia.yMin = this.GlycemiaInterval.lower;
        this.chartOptions.plugins.annotation.annotations.lGlycemia.yMax = this.GlycemiaInterval.upper;
        this.chartOptions.plugins.annotation.annotations.rGlycemia.yMin = this.GlycemiaInterval.lower;
        this.chartOptions.plugins.annotation.annotations.rGlycemia.yMax = this.GlycemiaInterval.upper;
      },
      deep: true
    },
    // If the axis titles should be displayed
    axisTitleChange: function (newVal, oldVal) {
      if (this.AxisTitle[0] == '') {
        this.chartOptions.scales['left-y-axis'].title.display = false;
      } else {
        this.chartOptions.scales['left-y-axis'].title.text = this.AxisTitle[0];
        this.chartOptions.scales['left-y-axis'].title.display = true;
      }
      if (this.AxisTitle[1] == '') {
        this.chartOptions.scales['right-y-axis'].title.display = false;
      } else {
        this.chartOptions.scales['right-y-axis'].title.text = this.AxisTitle[1];
        this.chartOptions.scales['right-y-axis'].title.display = true;
      }
    },
    graphScroll: function (newVal, oldVal) {
      this.chartOptions.plugins.zoom.zoom.wheel = newVal
    }
  },
  data() {
    return {
      // Options for the chart, look in chart.js documentation
      chartOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        showLine: true,
        interaction: {
          mode: 'nearest',
          axis: 'xy',
          intersect: false
        },
        elements: {
          point: {
            radius: 0
          },
          line: {
            cubicInterpolationMode: 'monotone'
          }
        },
        parsing: 'false',
        scales: {
          x: {
            min: 0,
            max: 1440,
            ticks: {
              callback: (value, index, ticks) => {
                return this.calculateTimeFormat(value * 60 + 86400);
              }
            },
            title: {
              display: true,
              // TODO changed time format
              text: 'Time [dd - hh:mm]',
              color: '#000',
              font: {
                size: 15,
                // TODO change boldness of text
                weight: 'medium',
                lineHeight: 1.2,
              },
            }
          },
          'left-y-axis': {
            type: 'linear',
            position: 'left',
            alignToPixels: false,
            title: {
              display: false,
              text: 'GH [mmol/L]',
              color: '#000',
              font: {
                size: 15,
                weight: 'medium',
                lineHeight: 1.2,
              },
            }
          },
          'right-y-axis': {
            type: 'linear',
            position: 'right',
            alignToPixels: true,
            display: false,
            title: {
              display: false,
              text: '[TBD]',
              color: '#000',
              font: {
                size: 15,
                weight: 'medium',
                lineHeight: 1.2,
              },
            }
          },
          // Seperate axis for parameters
          'y1': {
            display: false,
            suggestedMin: 0,
            suggestedMax: 1e-5
          },
          'y2': {
            display: false,
            suggestedMin: 0,
            suggestedMax: 1e-5
          },
          'y3': {
            display: false,
            suggestedMin: 0,
            suggestedMax: 1e-5
          },
          'y4': {
            display: false,
            suggestedMin: 0,
            suggestedMax: 1e-5
          },
          'y5': {
            display: false,
            suggestedMin: 0,
            suggestedMax: 1e-5
          },
          'y6': {
            display: false,
            suggestedMin: 0,
            suggestedMax: 1e-5
          },
          'y7': {
            display: false,
            // the data minimum used for determining the ticks is Math.min(dataMin, suggestedMin)
            suggestedMin: 0,
            // the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
            suggestedMax: 1e-5
          },
          'y8': {
            display: false,
            suggestedMin: 0,
            suggestedMax: 1e-5
          }
        },
        plugins: {
          filler: {
            propagate: true
          },
          pan: {
            enabled: true,
            mode: 'x',
          },
          tooltip: {
            callbacks: {
              // Changes the title to display the time in [dd:hh:mm]
              title: (context) => {
                // Find decimal point
                var deci = 1.1;
                deci = deci.toLocaleString().substring(1, 2);

                let title = "";
                if (deci == ".") {
                  title = context[0].label.replace(',', '');
                } else {
                  title = context[0].label.replace('.', '');
                }
                let value = parseFloat(title);
                title = 'Time: ' + this.calculateTimeFormat(value * 60 + 86400)
                return title;
              },
              // Changes the label to be state: value
              label: (context) => {
                let label = '';
                // If value is 0 don't display. (Should only happen for input parameters)
                if(context.formattedValue != 0){
                  if(context.raw[2] != undefined){
                    label = context.dataset.label + ": " + context.formattedValue + " [" + context.raw[2] + "]";
                  }else{
                    label = context.dataset.label + ": " + context.formattedValue;
                  }
                }
                return label
              }
            }
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'x'
            },
            limits: {
              x: { min: 0, max: 1440 }
            },
          },
          annotation: {
            annotations: {
              lGlycemia: {
                borderWidth: 0,
                display: false,
                yScaleID: 'left-y-axis',
                type: 'box',
                
                xMin: 0,
                xMax: 1440,
                yMin: 3.9,
                yMax: 10,
                backgroundColor: 'rgba(0, 255, 0, 0.05)'
              },
              rGlycemia: {
                borderWidth: 0,
                display: false,
                yScaleID: 'right-y-axis',
                type: 'box',
                xMin: 0,
                xMax: 1440,
                yMin: 3.9,
                yMax: 10,
                backgroundColor: 'rgba(0, 255, 0, 0.05)'
              }
            }
          }
        },
        transitions: {
          zoom: {
            animation: {
              duration: 0
            }
          }
        }
      }
    }
  },
  methods: {
    ZOOOM(v){
      var chart=this.$refs['graph'].chart;
      if (v==0){
        chart.resetZoom('none')
      }else{
        chart.zoomScale('x', {min:Math.max(0,this.xMax-v*1440),max:this.xMax}, 'none') // scale , range={min,max}, animationMode
      }
      // console.log(this)
    },
    // Calculates time and formates it
    calculateTimeFormat(time) {
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
      return this.padTime(days) + " - " + this.padTime(hours) + ":" + this.padTime(minutes)
    },
    // Pad zero if the time is below 10
    padTime(time) {
      if (Math.floor(time / 10) < 1) {
        time = '0' + time
      }
      return time
    },
  }
}
</script>
