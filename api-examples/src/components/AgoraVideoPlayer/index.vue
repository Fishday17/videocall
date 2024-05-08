<template>
  <div :style="style">
    <div v-if="text" :style="{ marginTop: '10px', marginBottom: '10px' }">{{ text }}</div>
    <el-collapse :style="width=800" v-if="localStatsList" v-model="activeName1" @change="activeName1Change" accordion>
      <el-collapse-item :style="width=800, height=600" v-for=" (stat,index) in localStatsList" :key="stat.description" >
        <template #title>
          {{stat.description}}: {{stat.value}} {{stat.unit}}
        </template>
        <MonitorEchart :style="width=800, height=600" v-bind:value="stat.value" v-bind:title="stat.description"
                       v-bind:id="'remoteStatsList' + stat.description" name="{{index}}"
                       v-bind:flag="false">

        </MonitorEchart>
      </el-collapse-item>
    </el-collapse>
    <el-collapse v-if="remoteStatsList" v-model="activeName2" @change="activeName2Change" accordion>
      <el-collapse-item :style="width=800,height=600" v-for="(stat,index) in remoteStatsList" :key="stat.description" >
        <template #title>
          {{stat.description}}: {{stat.value}} {{stat.unit}}
        </template>
        <MonitorEchart :style="width=800,height=600" v-bind:value="stat.value" v-bind:title="stat.description"
                       v-bind:id="'localStatsList' + stat.description" name="{{index}}"
                       v-bind:flag="false">

        </MonitorEchart>
      </el-collapse-item>
    </el-collapse>
    <div v-if="uplinkNetwork.value" :style="{ marginTop: '10px', marginBottom: '10px' }">上行网络质量：{{ uplinkNetwork.value}}</div>
    <div v-if="downlinkNetwork.value" :style="{ marginTop: '10px', marginBottom: '10px' }">下行网络质量：{{ downlinkNetwork.value}}</div>
    <div ref="videoRef" :style="{ width, height }" />
</div>
</template>


<script>
const DEFAULT_WIDTH = "800px"
const DEFAULT_HEIGHT = "600px"
</script>

<script setup>
import { ref, watch, onUnmounted, onMounted } from "vue"
import Echart from "../MonitorEchart/index.vue";

const videoRef = ref()
const remoteStatsList = ref([])
const localStatsList = ref([])
const uplinkNetwork = ref('')
const downlinkNetwork = ref('')
const activeName1 = ref('')
const activeName2 = ref('')
const emit = defineEmits(['click'])
const props = defineProps({
  videoTrack: {
    type: Object,
    default: null
  },
  audioTrack: {
    type: Object,
    default: null
  },
  config: {
    type: Object,
    default: {}
  },
  remoteUserNetworkQuantity: {
    type: Object,
    default: {}
  },
  text: {
    type: [String, Number],
    default: ''
  },
  width: {
    type: String,
    default: DEFAULT_WIDTH
  },
  height: {
    type: String,
    default: DEFAULT_HEIGHT
  },
  style: {
    type: Object,
    default: {}
  },
  remoteVideoStats:{
    type: Object,
    default: {}
  },
  localVideoStats:{
    type: Object,
    default: {}
  },
  localClientStats:{
    type: Object,
    default: {}
  },
  type: {
    type: Number,
    default: 0
  }
})

const activeName1Change = (name) => {
  console.log(name)
}

const activeName2Change = (name) => {
  console.log(name)
}

watch(
    () => props.remoteUserNetworkQuantity,
    () => {
      uplinkNetwork.value = uplinkNetworkQuality();
      downlinkNetwork.value = downlinkNetworkQuality();
    }
)

watch(
    [() => props.localVideoStats,() => props.localClientStats],
    () => {
  // get the client stats message
  var localVideoStats = props.localVideoStats;
  var clientStats = props.localClientStats;
  localStatsList.value = [{
    description: "在线人数",
    value: clientStats.UserCount,
    unit: ""
  // }, {
  //   description: "持续时间",
  //   value: clientStats.Duration,
  //   unit: "s"
  }, {
    description: "下载码率",
    value: clientStats.RecvBitrate,
    unit: "bps"
  }, {
    description: "上传码率",
    value: clientStats.SendBitrate,
    unit: "bps"
  }, {
    description: "接收总字节数",
    value: clientStats.RecvBytes,
    unit: "bytes"
  }, {
    description: "上传总字节数",
    value: clientStats.SendBytes,
    unit: "bytes"
  }, {
    description: "上传预估带宽",
    value: clientStats.OutgoingAvailableBandwidth.toFixed(3),
    unit: "kbps"
  // }, {
  //   description: "RTT时间",
  //   value: clientStats.RTT,
  //   unit: "ms"
  },{
    description: "编码格式",
    value: localVideoStats.codecType,
    unit: ""
  // },{
  //   description: "视频发送总byte数",
  //   value: localVideoStats.sendBytes,
  //   unit: ""
  },{
    description: "发送帧率 ",
    value: localVideoStats.sendFrameRate,
    unit: "fps"
  // }, {
  //   description: "捕获帧率",
  //   value: localVideoStats.captureFrameRate,
  //   unit: "fps"
  // }, {
  //   description: "发送总包数",
  //   value: localVideoStats.sendPackets,
  //   unit: ""
  // }, {
  //   description: "总丢包数",
  //   value: localVideoStats.sendPacketsLost,
  //   unit: ""
  },{
    description: "发送视频高度",
    value: localVideoStats.sendResolutionHeight,
    unit: "px"
  }, {
    description: "发送视频宽度",
    value: localVideoStats.sendResolutionWidth,
    unit: "px"
  // }, {
  //   description: "捕获视频高度",
  //   value: localVideoStats.captureResolutionHeight,
  //   unit: "px"
  // }, {
  //   description: "捕获视频宽度",
  //   value: localVideoStats.captureResolutionWidth,
  //   unit: "px"
  }, {
    description: "发送比特率",
    value: localVideoStats.sendBitrate,
    unit: "bps"
  }, {
    description: "目标比特率",
    value: localVideoStats.targetSendBitrate,
    unit: "bps"
  }, {
    description: "视频总时间",
    value: localVideoStats.totalDuration,
    unit: "s"
  }, {
    description: "总卡顿时间",
    value: localVideoStats.totalFreezeTime,
    unit: "s"
  }, {
    description: "当前丢包率",
    value: localVideoStats.currentPacketLossRate,
    unit: ""
  }];
})

watch(
    () =>props.remoteVideoStats,
    () => {
  // get the client stats message
  var remoteVideoStats = props.remoteVideoStats
  remoteStatsList.value = [{
  //   description: "端到端延迟",
  //   value: remoteVideoStats.end2EndDelay,
  //   unit: "ms"
  // }, {
    description: "接收比特率",
    value: remoteVideoStats.receiveBitrate,
    unit: "bps"
  }, {
    description: "视频接收延迟",
    value: remoteVideoStats.receiveDelay,
    unit: "ms"
  // }, {
  //   description: "视频接收总byte数",
  //   value: remoteVideoStats.receiveBytes,
  //   unit: ""
  },{
    description: "解码帧率",
    value: remoteVideoStats.decodeFrameRate,
    unit: "fps"
  }, {
    description: "接收视频帧率",
    value: remoteVideoStats.receiveFrameRate,
    unit: "fps"
  }, {
    description: "渲染帧率",
    value: remoteVideoStats.renderFrameRate,
    unit: "fps"
  // }, {
  //   description: "接收总字节数",
  //   value: remoteVideoStats.receivePackets,
  //   unit: "kbps"
  // }, {
  //   description: "总丢包数",
  //   value: remoteVideoStats.receivePacketsLost,
  //   unit: ""
  // }, {
  //   description: "总丢包率",
  //   value: remoteVideoStats.packetLossRate,
  //   unit: ""
  // }, {
  //   description: "瞬时丢包率",
  //   value: remoteVideoStats.currentPacketLossRate,
  //   unit: ""
  }, {
    description: "视频高度",
    value: remoteVideoStats.receiveResolutionHeight,
    unit: "px"
  }, {
    description: "视频宽度",
    value: remoteVideoStats.receiveResolutionWidth,
    unit: "px"
  }, {
    description: "视频总时间",
    value: remoteVideoStats.totalDuration,
    unit: "s"
  }, {
    description: "总卡顿时间",
    value: remoteVideoStats.totalFreezeTime,
    unit: "s"
  }, {
    description: "卡顿率",
    value: remoteVideoStats.freezeRate,
    unit: ""
  }];
})

const { videoTrack, audioTrack, config } = props

const uplinkNetworkQuality = () => {
  if(props.remoteUserNetworkQuantity) {
    return getNetworkQualityValue(props.remoteUserNetworkQuantity.uplinkNetworkQuality)
  }else {
    return null
  }
}

const downlinkNetworkQuality = () => {
  if(props.remoteUserNetworkQuantity) {
    return getNetworkQualityValue(props.remoteUserNetworkQuantity.downlinkNetworkQuality)
  }else {
    return null
  }
}

const getNetworkQualityValue = (quality) => {
   if(quality == null ||quality < 0 || quality > 7) {
     return '网络未知'
   }else {
     return networkQualityEnum[quality]
   }
}

const networkQualityEnum = {
  0: '网络未知',
  1: '网络极好',
  2: '网络好',
  3: '网络较差',
  4: '网络差',
  5: '网络极差',
  6: '网络连接断开',
  7: '网络连接中'
}


onMounted(() => {
  videoTrack?.play(videoRef.value, config)
  audioTrack?.play()
})

watch(() => props.videoTrack, track => {
  if (track && videoRef.value) {
    track.play(videoRef.value)
  }
})


watch(() => props.audioTrack, (track) => {
  track?.play()
})



onUnmounted(() => {
  videoTrack?.close()
  audioTrack?.close()
})

</script>
