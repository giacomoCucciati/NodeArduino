Vue.component("line-chart", {
  extends: VueChartJs.Line,
  props: ['chartData', 'options'],
  mixins: [VueChartJs.mixins.reactiveProp],
  // updated () {
  //   console.log('I am updated')
  // },
  mounted () {

    this.renderChart(this.chartData, this.options)
  }
});


var app = new Vue({

  el: '#controlGui',
  data: {
    message: 'Hello Vue!',
    socket: null,
    mydata: {},
    yvector: [],
    options: null,

    // options: {
    //       responsive: true,
    //       maintainAspectRatios: false,
    //       // scales: {
    //       //   yAxes: [{
    //       //     ticks: {
    //       //       callback: function(value, index, values) {
    //       //         return `£ ${value}`;
    //       //       },
    //       //     },
    //       //   }],
    //       // },
    //       tooltips: {
    //         enabled: true,
    //         // callbacks: {
    //         //   label:function (tooltipItems, data) {
    //         //     console.log(data)
    //         //     return tooltipItems.yLabel + '£'
    //         //   }
    //         // }
    //       }
    //     }
  },
  methods: {
    readSerial: (event) => {
      console.log("Request serial");
      $.getJSON('/gui/read-serial', payload => {
        console.log(payload['message']);
      });
    },
    openSerial: (event) => {
      console.log("Open serial");
      $.getJSON('/gui/open-serial', payload => {
        console.log(payload['message']);
      });
    },
    pauseSerial: (event) => {
      console.log("Pause serial");
      $.getJSON('/gui/pause-serial', payload => {
        console.log(payload['message']);
      });
    },
    closeSerial: (event) => {
      console.log("Close serial");
      $.getJSON('/gui/close-serial', payload => {
        console.log(payload['message']);
      });
    },
    resumeSerial: (event) => {
      console.log("Resume serial");
      $.getJSON('/gui/resume-serial', payload => {
        console.log(payload['message']);
      });
    },
    fetchData () {
      $.getJSON('/gui/data', payload => {
        console.log(payload['data']);
        this.fillData(payload['data']);
        //console.log(this.series.datasets[0].data.length);
        //this.series.datasets[0].data.push({x:this.series.datasets[0].data.length,y:payload['data']});
      });
    },
    fillData (yvalue) {
          this.yvector.push(yvalue);
          let i = 1;
          let xvector = [];
          while(xvector.push(i++)<this.yvector.length);
          console.log(this.yvector);
          console.log(xvector);

          this.mydata = {
            labels: xvector,
            datasets: [
              {
                label: 'Data One',
                backgroundColor: '#f87979',
                data: this.yvector
              }
            ]
          }
        },

        getRandomInt () {
          return Math.floor(Math.random() * (50 - 5 + 1)) + 5
        }
  },

  computed: {
    isDefined () {
      console.log(this.series);
      if(this.series !== undefined) {
        return true;
      } else {
        return false;
      }
    }
  },

  mounted () {
    // Creating the socket for updates notifications
    this.socket = io('/control');
    // Callback for new-data event
    this.socket.on('new-data', () => this.fetchData());
  },

  // This function is called before a change of component by the router.
  // We have to close the socket in order to clean the component.
  beforeRouteLeave (to, from, next) {
    this.socket.close();
    next();
  }
})
