<template>
  <div class="all-data">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <div class="columns">
            <div class="column">
              <h1 class="title">
                Highest Player Value
              </h1>
              <h3 class="is-size-5">
                <div v-if="!loading">
                  <h1>Please Load Chart</h1>
                </div>
                <div v-else>
                  <p> <b>Player Value:</b> {{this.biggestValues.value}}</p>
                  <p> <b>Player ID:</b> {{this.biggestValues.player_id}}</p>
                </div>
              </h3>
            </div>
            <div class="column">
              <h1 class="title">
                Lowest Player Value
              </h1>
              <h3 class="is-size-5">
                <div v-if="!loading">
                  <p>Please Load Chart</p>
                </div>
                <div v-else>
                  <p> <b>Player Value:</b> {{this.lowestValues.value}}</p>
                  <p> <b>Player ID:</b> {{this.lowestValues.player_id}}</p>
                </div>
              </h3>
            </div>
            <div class="column">
              <h1 class="title">
                <img src="../../static/placeholder-player200.jpg">
                <h3 class="is-size-5">
                <div v-if="!loading">
                  <h1>Please Load Chart</h1>
                </div>
                <div v-else>
                  <p> <b>Average Player Value:</b> {{this.averageValue}}</p>
                </div>
              </h3>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <router-link to="/playerdata" class="button is-primary">Player Statistics</router-link>
        <chart :options='options' ref="scatter" auto-resize></chart>
        <button class="button is-primary is-large" @click="fetchData">Load Goal Data</button>
      </div>
    </section>
  </div>
</template>

<script>
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/chart/scatter'
import map from 'lodash/map'
import minBy from 'lodash/minby'
import maxBy from 'lodash/maxby'
import chunk from 'lodash/chunk'
import meanBy from 'lodash/meanby'
import floor from 'lodash/floor'
import filter from 'lodash/filter'

export default {
  name: 'Heatmap',
  data () {
    return {
      scatters: [],
      biggestValues: [],
      lowestValues: [],
      averageValue: [],
      loading: false
    }
  },
  computed: {
    options () {
      return {
        xAxis: {
          type: 'value',
          min: 0,
          max: 105
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 68
        },
        dataZoom: [
          {
            type: 'slider',
            show: true
          },
          {
            type: 'inside'
          }
        ],
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            return `<img src="../../static/placeholder-trans.png">
            <br>
            <b> Player Value:</b> ${params.value[2]}
            <br> <b> Player ID:</b> ${params.value[3]}
            <br> <b> Match ID:</b> ${params.value[4]}`
          }
        },
        visualMap: {
          precision: 3,
          min: 0,
          max: 1,
          dimension: 2,
          calculable: true,
          realtime: true,
          orient: 'vertical',
          right: 10,
          top: 'center',
          text: ['Max Value', 'Min Value'],
          inRange: {
            color: ['#32CD32', '#ff0000']
          }
        },
        series: [{
          name: 'Player value',
          type: 'scatter',
          data: this.scatters
        }]
      }
    }
  },
  methods: {
    fetchData () {
      let self = this
      let scatter = this.$refs.scatter
      self.loading = true
      scatter.showLoading({
        text: 'Loading Goal Data',
        color: '#000',
        maskColor: 'rgba(255, 255, 255, 0.5)'
      })
      fetch('../../static/goal_attempts.json')
        .then(
          function (response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status)
              return
            }
            response.json().then(function (data) {
              self.positionX = map(data, 'position_x')
              self.positionY = map(data, 'position_y')
              self.value = map(data, 'value')
              self.averageValue = floor(meanBy(data, 'value' ),2)
              self.playerID = map(data, 'player_id')
              self.matchID = map(data, 'match_id')
              self.goal = map(data, 'goal')
              self.onePlayer = filter(data, {'player_id': 295156})
              console.log('match?', (self.onePlayer = filter(self.onePlayer, {'goal': 'True'})))
              self.result = self.positionX.reduce(function (arr, v, i) {
                return (arr.concat(v, self.positionY[i], self.value[i], self.playerID[i], self.matchID[i]))
              }, [])
              self.scatters = chunk(self.result, 5)
              self.biggestValues = maxBy(data, 'value')
              self.lowestValues = minBy(data, 'value')
              scatter.hideLoading()
            })
          }
        )
        .catch(function (err) {
          console.log('Fetch Error :-S', err)
        })
    }
  }
}
</script>

<style scoped>
.echarts {
  width: 100%;
  height: 600px;
  background: #000;
}

figure .echarts {
  width: 100%;
}

.button {
  background: #ff8000;
  color: #fff;
  margin-top: 30px;
}

.hero {
  background: #161431;
  padding-bottom: 4rem;
  padding-top: 4rem;
}

.column {
  background: #fff;
  justify-content: center;
  display: flex;
  flex-direction: column;
  -webkit-box-shadow: 5px 10px 23px rgba(31,28,87,.2);
  box-shadow: 5px 10px 23px rgba(31,28,87,.2);
  border-radius: 4px;
  margin: 5px;
}
</style>
