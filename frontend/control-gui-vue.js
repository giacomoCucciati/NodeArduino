Vue.component("line-chart", {
  extends: VueChartJs.Line,
  props: ['chartData', 'options'],
  mixins: [VueChartJs.mixins.reactiveProp],

  mounted () {
    this.renderChart(this.chartData, this.options)
  }
});

Vue.component("slider-picker", {
  extends: VueColor.Slider,
});

var defaultProps = {
  rgba: {
    r: 0,
    g: 255,
    b: 0,
    a: 1
  },
};

var app = new Vue({

  el: '#controlGui',
  data: {
    message: 'Welcome!',
    colors: defaultProps,
    contreading: false,
    socket: null,
    mydata: {},
    lummydata: {},
    xyvector: [],
    lumxyvector: [],
    options: { responsive: false, maintainAspectRatios: false },
    portselected: '',
    ports: [],
    arduino: false,
  },

  methods: {

    connectArduino: (event) => {
      $.post('/gui/connect-arduino', { port: app.portselected }, payload => {
        app.message = payload['message']
        app.arduino = payload['arduino']
      });
    },

    closeArduino: (event) => {
      $.post('/gui/close-arduino', payload => {
        app.message = payload['message']
        app.arduino = payload['arduino']
      });
    },

    readSingleTemp: (event) => {
      $.getJSON('/gui/read-single-temp', payload => {
        app.message = payload['message'];
      });
    },

    toggleTempReading: (event) => {
      console.log(app.contreading);
      $.post('/gui/toggle-reading-temp', { reading: app.contreading },payload => {
        app.message = payload['message'];
      });
    },

    fetchData (type) {
      $.post('/gui/data',{ load: type }, payload => {
        this.fillData(type, payload);
      });
    },

    updateValue (value) {
      app.colors = value;
      $.post('/gui/changecolor',{  r: app.colors.rgba.r, g: app.colors.rgba.g, b: app.colors.rgba.b,}, payload => {
        app.message = payload['message']
      });
    },

    fillData (type, payload) {
          let temperatureValue = payload['temperatureData'];
          let luminosityValue = payload['luminosityData'];
          if(type === "last") {
            this.xyvector.push({x: new Date(temperatureValue.x), y: temperatureValue.y});
            this.lumxyvector.push({x: new Date(luminosityValue.x), y: luminosityValue.y});
          } else if (type === "all") {
            app.ports = payload['ports'];
            app.arduino = payload['arduino'];
            app.contreading = payload['reading'];
            if(app.ports.indexOf(payload['thePort']) > 0) {
              app.portselected = payload['thePort'];
            }
            for (let el in temperatureValue) {
              let singleValue = temperatureValue[el];
              this.xyvector.push({x: new Date(singleValue.x), y: singleValue.y});
            }
            for (let el in luminosityValue) {
              let singleValue = luminosityValue[el];
              this.lumxyvector.push({x: new Date(singleValue.x), y: singleValue.y});
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

          this.lummydata = {
            labels: [],
            datasets: [
              {
                label: 'Luminosity (byte)',
                backgroundColor: 'transparent',
                pointBorderColor: 'green',
                data: this.lumxyvector
              }
            ]
          }

          this.options = {
          responsive: true,
          maintainAspectRatio: false,
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
    },

    connected() {
      return this.arduino;
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
