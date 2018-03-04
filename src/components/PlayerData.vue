<template>
  <div class="player-data">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title is-1">Player Data</h1>
            <div class="field">
              <div class="control">
                <input class="input is-medium" type="text" placeholder="Player Number" v-model="playernumber">
              </div>
            </div>
        <button class="button is-primary is-large" @click="fetchData" :disabled="playernumber === ''">Load Player Data</button><br>
        <router-link to="/" class="button">All Match Statistics</router-link>
        <div v-if="this.goalAttempts === 0">
          <h3 class="title is-3 noresult">No data found</h3>
        </div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <chart :options='options' ref="scatter" auto-resize></chart>
      </div>
    </section>
  </div>
</template>

<script>
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/bar'
import map from 'lodash/map'
import min from 'lodash/min'
import minBy from 'lodash/minby'
import maxBy from 'lodash/maxby'
import chunk from 'lodash/chunk'
import meanBy from 'lodash/meanby'
import floor from 'lodash/floor'
import filter from 'lodash/filter'
import findIndex from 'lodash/findindex'

export default {
  name: 'PlayerData',
  data () {
    return {
      scatters: [],
      goalNumber: [],
      playernumber: '',
      loading: false
    }
  },
  computed: {
    options () {
      return {
        grid: {
          top: 50,
          width: '55%',
          left: 10,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
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
        xAxis: {
          name: 'Match IDs',
          type: 'category',
          data: this.matchID
        },
        yAxis: {
          name: 'Player Value',
          type: 'value',
          max: 1,
          interval:0.1
        },
        series: [{
            type: 'pie',
            name: 'Goal Statistics',
            tooltip: {
              trigger: 'item',
              formatter: '<b>{b}</b> {c} <br>({d}%)'
            },
            radius: [0, '50%'],
            center: ['85%', '50%'],
            data: [
              { value: this.goalAttempts,
                name: 'Goal Attempts',
                itemStyle: {
                  color: '#ff8000'
                } 
              },
              { value: this.goalNumber,
                name: 'Goals',
                itemStyle: {
                  color: '#ff0000'
                }
              },
              { value: this.matchNumber,
                name: 'No Goal Attempts',
                itemStyle: {
                  color: '#161431'
                }
              }
            ]
        },
        {
          name: 'Player Value',
          type: 'bar',
          markLine: {
              data: [{
                  type: 'average',
                  name: 'Average Value',
                  lineStyle: {
			              normal: {color:'#ff8000'}
                  },
                  label: { 
                    normal: { 
                    show: true,
                    formatter: 'Average Value: {c}'
                    }
                  }
              }]
          },
          markPoint: {
              data: [{
                  type: 'min',
                  name: 'Min Value',
                  itemStyle: {
			              normal: {color:'#ff8000'}
                  }
                }, 
                  {
                  type: 'max',
                  itemStyle: {
			              normal: {color:'#ff8000'}
			            }
              }]
          },
          data: this.playerValue,
          tooltip: {
              trigger: 'item',
              formatter: '<b>Match ID:</b> {b} <br> <b>Player Value:</b> {c}'
            }
        }]
      }
    }
  },
  methods: {
    fetchData () {
      let self = this
      fetch('../../static/goal_attempts.json')
        .then(
          function (response) {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status)
              return
            }
            response.json().then(function (data) {
              self.playerData = filter(data, {'player_id': + self.playernumber})
              self.trueGoal = filter(self.playerData, {'goal': 'True'})
              self.onTarget = filter(self.playerData, {'on_target': 'True'})
              self.goalNumber = map(self.trueGoal).length
              self.goalAttempts = map(self.onTarget).length
              self.playerValue = map(self.playerData, 'value')
              self.positionX = map(self.playerData, 'position_x')
              self.positionY = map(self.playerData, 'position_y')
              self.matchID = map(self.playerData, 'match_id')
              self.matchNumber = map(self.matchID).length
              self.result = self.positionX.reduce(function (arr, v, i) {
                return (arr.concat(v, self.positionY[i], self.matchID[i], self.playerValue[i]  ))
              }, [])
              self.scatters = chunk(self.result, 4)
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
}

figure .echarts {
  width: 100%;
}

.title {
  color: #fff;
}

.noresult {
  padding-top:30px;
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
