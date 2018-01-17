Vue.component("line-chart", {
  extends: VueChartJs.Line,
  props: ['chartData', 'options'],
  mixins: [VueChartJs.mixins.reactiveProp],

  mounted () {
    this.renderChart(this.chartData, this.options)
  }
});

Vue.component("chrome-picker", {
  extends: VueColor.Chrome,
});

var defaultProps = {
  rgba: {
    r: 25,
    g: 77,
    b: 51,
    a: 1
  },
  a: 1
};

var app = new Vue({

  el: '#controlGui',
  data: {
    message: 'Pippo!',
    colors: defaultProps,
    socket: null,
    mydata: {},
    xyvector: [],
    options: { responsive: false, maintainAspectRatios: false },
    portselected: '/dev/ttyACM0',
    ports: [
      { text: '/dev/ttyACM0'},
      { text: '/dev/tty.usbmodem1411'},
    ],
  },

  methods: {

    connectArduino: (event) => {
      $.post('/gui/connect-arduino', { port: app.portselected }, payload => {
        app.message = payload['message']
      });
    },

    readSingleTemp: (event) => {
      $.getJSON('/gui/read-single-temp', payload => {
        app.message = payload['message'];
      });
    },

    startTempReading: (event) => {
      $.getJSON('/gui/start-cycle-temp', payload => {
        app.message = payload['message']
      });
    },
    stopTempReading: (event) => {
      $.getJSON('/gui/stop-cycle-temp', payload => {
        app.message = payload['message'];
      });
    },
    fetchData (type) {
      $.post('/gui/data',{ load: type }, payload => {
        this.fillData(type, payload['data']);
      });
    },
    updateValue (value) {
      app.colors = value;
      $.post('/gui/changecolor',{  r: app.colors.rgba.r, g: app.colors.rgba.g, b: app.colors.rgba.b,}, payload => {
        app.message = payload['message']
      });
    },

    fillData (type, theValue) {
          // this.xyvector.push(yvalue);
          // while (this.yvector.length >= 20) {
          //   this.yvector.shift();
          // }
          // let i = 1;
          // let xvector = [];
          // while(xvector.push(i++)<this.yvector.length);
          if(type === "last") {
            this.xyvector.push({x: new Date(theValue.x), y: theValue.y});
          } else if (type === "all") {
            for (let el in theValue) {
              let singleValue = theValue[el];
              this.xyvector.push({x: new Date(singleValue.x), y: singleValue.y});
            }
          }
          this.mydata = {
            labels: [],
            datasets: [
              {
                label: 'Temp (C)',
                backgroundColor: 'transparent',
                pointBorderColor: 'orange',
                data: this.xyvector
              }
            ]
          }

          this.options = {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 5
          },
          title: {
            display: true,
            text: 'Temperatura'
          },
          scales: {
            xAxes: [{
              type: 'time',
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Data'
              },
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Gradi'
              },
            }]
          }
        };
      },

  },

  computed: {
    isDefined () {
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
    this.socket.on('new-data', () => this.fetchData("last"));
    // Ask for the latest data collected
    this.fetchData("all");
  },

  // This function is called before a change of component by the router.
  // We have to close the socket in order to clean the component.
  beforeRouteLeave (to, from, next) {
    this.socket.close();
    next();
  }
})
