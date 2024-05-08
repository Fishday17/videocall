

<template>
  <div class="echarts-box">
    <el-button type="primary" @click="refresh">刷新</el-button>
    <div v-bind:id="id" class="echarts-item"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import {onMounted, onUnmounted, ref} from "vue";

const name = ref('App')
const props = defineProps({
  title: {
    type: String,
    default: "Echarts"
  },
  value: {
    type: Number,
    default: 0
  },
  id: {
    type: String,
    default: "echarts" + Math.random()
  },
  flag: {
    type: Boolean,
    default: false
  }
})

let myEcharts = echarts;
let data = []
let myChart = null;
let time = new Date(0 + 16 * 3600 * 1000)
let option = {
  title: {
    text: props.title
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      animation: false
    }
  },
  xAxis: {
    type: 'time',
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    splitLine: {
      show: false
    }
  },
  series: [
    {
      data: data,
      type: "line"
    }
  ]
};
setInterval(() => {
  time = new Date(time.getTime() + 1000);
  var value = props.value;
  data.push({
    name: time.toISOString().substring(11, 8),
    value: [
      time,
      parseNumber(value)
    ]
  })
  // if(myChart != null && props.flag){
  //   myChart.setOption(option);
  // }
},1000);

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  myEcharts.dispose;
});

const parseNumber = (value) => {
  return value ? parseInt(value, 10) : 0;
}

const refresh = () => {
  if(myChart != null){
    myChart.setOption(option);
  }
}

const initChart = () => {
  if(myChart == null){
    var echartDom = document.getElementById(props.id);
    myChart = myEcharts.getInstanceByDom(echartDom, "purple-passion")
    if(myChart == null){
      myChart = myEcharts.init(echartDom, "purple-passion");
    }
  }
  myChart.setOption(option);
  window.onresize = function () {
    myChart.resize();
  };
}

</script>

<style scoped>
.echarts-box {
  width: 800px;
  height: 600px;
  .echarts-item {
    width: 800px;
    height: 600px;
  }
}
</style>