Vue.component("line-chart", {
  extends: VueChartJs.Line,
  props: ['chartData', 'options'],
  mixins: [VueChartJs.mixins.reactiveProp],

  mounted () {
    this.renderChart(this.chartData, this.options)
  }
});


var app = new Vue({

  el: '#controlGui',
  data: {
    message: 'Pippo!',
    socket: null,
    mydata: {},
    yvector: [],
    options: { responsive: false, maintainAspectRatios: false }
  },

  methods: {
    readSerial: (event) => {
      $.getJSON('/gui/read-serial', payload => {
        app.message = payload['message'];
      });
    },
    openSerial: (event) => {
      $.getJSON('/gui/open-serial', payload => {
        app.message = payload['message'];
      });
    },
    pauseSerial: (event) => {
      $.getJSON('/gui/pause-serial', payload => {
        app.message = payload['message'];
      });
    },
    closeSerial: (event) => {
      $.getJSON('/gui/close-serial', payload => {
        app.message = payload['message'];
      });
    },
    resumeSerial: (event) => {
      $.getJSON('/gui/resume-serial', payload => {
        app.message = payload['message']
      });
    },
    fetchData () {
      $.getJSON('/gui/data', payload => {
        this.fillData(payload['data']);
      });
    },

    fillData (yvalue) {
          this.yvector.push(yvalue);
          while (this.yvector.length >= 20) {
            this.yvector.shift();
          }
          let i = 1;
          let xvector = [];
          while(xvector.push(i++)<this.yvector.length);

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
    this.socket.on('new-data', () => this.fetchData());
  },

  // This function is called before a change of component by the router.
  // We have to close the socket in order to clean the component.
  beforeRouteLeave (to, from, next) {
    this.socket.close();
    next();
  }
})
