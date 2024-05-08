<template>
  <div class="padding-20">
    <JoinForm v-show="true" ref="formRef"></JoinForm>
    <div class="btn-wrapper mt-10">
      <RoleSelect :style="{ }" @change="(val)=> roleChange(val)" ></RoleSelect>
      <el-button :style="{ marginLeft: '10px' }" type="primary" :disabled="joined" @click="reJoin">加入</el-button>
      <el-button type="primary" :disabled="!joined" @click="leave">离开</el-button>

      <AdvancedSetting :style="{ marginLeft: '10px' }" @profileChange="profileChange" @codecChange="codecChange"
                       @strategyChange="strategyChange" @cameraChange="cameraChange" @microPhoneChange="microPhoneChange"
                       :audioTrack="audioTrack" :videoTrack="videoTrack">
      </AdvancedSetting>
    </div>
    <div v-if="joined" class="mt-10">
      <div class="text">Local User</div>
      <AgoraVideoPlayer :audioTrack="audioTrack" :videoTrack="videoTrack"
                        :localVideoStats="localVideoStats"
                        :localClientStats="localClientStats" :type="1">

      </AgoraVideoPlayer>
    </div>
    <div v-if="Object.keys(remoteUsers).length">
      <div class="text">Remote Users</div>
      <AgoraVideoPlayer v-for="item in remoteUsers" :key="item.uid" :videoTrack="item.videoTrack"
                        :audioTrack="item.audioTrack" :text="item.uid"
                        v-bind:remoteUserNetworkQuantity="remoteUserNetworkQuantity[item.uid]"
                        v-bind:remoteVideoStats="remoteVideoStatsList[item.uid]" :type="2">
      </AgoraVideoPlayer>
    </div>
  </div>
</template>

<script setup>
import AgoraRTC from "agora-rtc-sdk-ng"
import {onMounted, onUnmounted, ref} from "vue"
import {ElMessage} from 'element-plus'
import {useRoute} from "vue-router"
import {showJoinedMessage} from "../../../utils/utils"
import axios from 'axios'


const route = useRoute()
const { query } = route

const role = ref("1")
const joined = ref(false)
const remoteUsers = ref({})
const audioTrack = ref(null)
const videoTrack = ref(null)
const formRef = ref()
const remoteUserNetworkQuantity = ref({});
const remoteVideoStatsList = ref({});
const localVideoStats = ref({});
const localClientStats = ref({});
const currentHost = window.location.host;
const currentProtocol = window.location.protocol;
const currentOrigin = window.location.origin;

let statsInterval = null
let networkQuantityInterval = null
let flushRemoteVideoStatsInterval = null


let client = null
let codec = 'vp8'
let optimizationMode = null
let profile = '1080p_2'
let camera = 'default'
let microPhone = 'default'

const getNetworkQualityValue = (quality) => {
  if(quality == null ||quality < 0 || quality > 7) {
    return '网络未知'
  }else {
    return networkQualityEnum[quality]
  }
}


onMounted(async () => {
  if (query.appId && query.channel) {
    formRef.value.setValue(query)
    join()
  }
})

onUnmounted(() => {
  if (joined.value) {
    leave()
  }
})

const roleChange = (val) => {
  role.value = val
}

const getToken = async (channel,uid) =>{
  const data = {
    channel: channel,
    uid: uid
  }
  const result = await axios.post(currentOrigin + '/api/token',data )
  // const result = await axios.post('http://49.234.44.18:8082/api/token',data )
  if(result == null || result.data == null || result.data.code == null || result.data.code != 200){
    throw new Error('获取token失败')
  } else return {
    appId: result.data.appid,
    token: result.data.token
  }

}

const profileChange = async (val) => {
  profile = val
  leave()
  join()
}

const codecChange = (val) => {
  codec = val.target.value
  leave()
  join()
}
const strategyChange = (val) => {
  optimizationMode = val
  leave()
  join()
}
const cameraChange = (val) => {
  camera = val
  leave()
  join()
}
const microPhoneChange = (val) => {
  microPhone = val
  leave()
  join()
}


const initTracks = async () => {
  if (audioTrack.value && videoTrack.value) {
    if(microPhone != null){
      audioTrack.value?.setDevice(microPhone);
    }
    if(camera != null){
      videoTrack.value?.setDevice(camera);
    }
    return
  }
  const options = formRef.value.getValue()
  const widthMin = options.widthMin;
  const widthMax = options.widthMax;
  const heightMin = options.heightMin;
  const heightMax = options.heightMax;
  const frameRateMin = options.frameRateMin;
  const frameRateMax = options.frameRateMax;
  const bitrateMin = options.bitrateMin;
  const bitrateMax = options.bitrateMax;
  const config = {optimizationMode: optimizationMode};
  if(widthMin != null || widthMax != null || heightMin != null || heightMax != null || frameRateMin != null || frameRateMax != null || bitrateMin != null || bitrateMax != null){
    config.encoderConfig = {
      width: {min: widthMin, max: widthMax},
      height: {min: heightMin, max: heightMax},
      frameRate: {min: frameRateMin, max: frameRateMax},
      bitrateMin: bitrateMin,
      bitrateMax: bitrateMax
    };
  }else {
    config.encoderConfig = profile;
  }
  const tracks = await Promise.all([
    AgoraRTC.createMicrophoneAudioTrack(),
    AgoraRTC.createCameraVideoTrack(config)
  ])
  audioTrack.value = tracks[0]
  videoTrack.value = tracks[1]
  if(microPhone != null){
    audioTrack.value?.setDevice(microPhone);
  }
  if(camera != null){
    videoTrack.value?.setDevice(camera);
  }
}

const handleUserPublished = async (user, mediaType) => {
  await client.subscribe(user, mediaType)
  delete remoteUsers.value[user.uid]
  remoteUsers.value[user.uid] = user
}

const handleUserUnpublished = (user, mediaType) => {
  if (mediaType == 'video') {
    delete remoteUsers.value[user.uid]
  }
}

const flushRemoteNetworkQuality = () => {
  remoteUserNetworkQuantity.value = {}
  var remoteNetworkQuality = client.getRemoteNetworkQuality();
  for (var key in remoteNetworkQuality) {
    remoteUserNetworkQuantity.value[key] = remoteNetworkQuality[key];
  }
}

const flushRemoteVideoStats = () => {
  remoteVideoStatsList.value = {}
  var remoteVideoStats = client.getRemoteVideoStats();
  for (var key in remoteVideoStats) {
    remoteVideoStatsList.value[key] = remoteVideoStats[key];
  }
}

const reJoin = () => {
  leave()
  join()
}

const join = async () => {
  try {
    const options = formRef.value.getValue()
    const uid = options.uid
    const channel = options.channel
    const roleStr = role.value === "1" ? "host" : "audience"
    if (channel == null || channel ==='') {
      throw new Error('channel不能为空')
    }
    if(uid == null){
      throw new Error('uid不能为空')
    }
    const result = await getToken(channel,uid)
    if (!client) {
      client = await AgoraRTC.createClient({
        mode: "rtc",
        codec: codec,
        role: roleStr
      });

    }
    // Add event listeners to the client.
    client.on("user-published", handleUserPublished)

    client.on("user-unpublished", handleUserUnpublished);
    // Join a channel
    await client.join(result.appId, channel, result.token, uid)
    await initTracks()
    const tracks = [audioTrack.value, videoTrack.value]
    if (roleStr === 'host') {
      await client.publish(tracks)
    }
    initStats();
    showJoinedMessage(options)
    joined.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}

const leave = () => {
  if (audioTrack.value) {
    audioTrack.value.close()
    audioTrack.value = null
  }
  if (videoTrack.value) {
    videoTrack.value.close()
    videoTrack.value = null
  }
  destructStats()
  remoteUsers.value = {}
  if(client != null){
    client.leave()
  }
  joined.value = false
  client = null
  ElMessage.success('leave channel success!')
}

const destructStats = () => {
  clearInterval(statsInterval);
  clearInterval(networkQuantityInterval)
  clearInterval(flushRemoteVideoStatsInterval)
}

const flushStats = () => {
  // get the client stats message
  localVideoStats.value = client.getLocalVideoStats();
  localClientStats.value = client.getRTCStats();
}

const initStats = () => {
  statsInterval = setInterval(flushStats, 1000);
  networkQuantityInterval = setInterval(flushRemoteNetworkQuality, 1000);
  flushRemoteVideoStatsInterval = setInterval(flushRemoteVideoStats, 1000);
}

</script>

