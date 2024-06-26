<template>
  <div class="padding-20">
    <JoinForm ref="formRef"></JoinForm>
    <div class="btn-wrapper mt-10">
      <el-button type="primary" :disabled="joined" @click="join">Join with screen video track</el-button>
      <el-button type="primary" :disabled="!joined" @click="leave">Leave</el-button>
    </div>
    <div v-if="joined" class="mt-10">
      <div class="text">Local User</div>
      <AgoraVideoPlayer :audioTrack="screenAudioTrack || audioTrack" :videoTrack="screenVideoTrack"></AgoraVideoPlayer>
    </div>
    <div v-if="Object.keys(remoteUsers).length">
      <div class="text">Remote Users</div>
      <AgoraVideoPlayer v-for="item in remoteUsers" :key="item.uid" :videoTrack="item.videoTrack"
        :audioTrack="item.audioTrack" :text="item.uid">
      </AgoraVideoPlayer>
    </div>
  </div>
</template>

<script setup>
import AgoraRTC from "agora-rtc-sdk-ng"
import { onMounted, onUnmounted, ref } from "vue"
import { ElMessage } from 'element-plus'
import { useRoute } from "vue-router"
import { showJoinedMessage } from "../../../utils/utils"


const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: 'vp8'
});

const route = useRoute()
const { query } = route


const joined = ref(false)
const remoteUsers = ref({})
const audioTrack = ref()
const screenVideoTrack = ref()
const screenAudioTrack = ref()
const formRef = ref()


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


//bind "track-ended" event, and when screensharing is stopped, there is an alert to notify the end user.
const handleTrackEnded = (e) => {
  if (screenVideoTrack.value) {
    screenVideoTrack.value.close()
    screenVideoTrack.value = null
  }
  if (screenAudioTrack.value) {
    screenAudioTrack.value.close()
    screenAudioTrack.value = null
  }
  if (audioTrack.value) {
    audioTrack.value.close()
    audioTrack.value = null
  }
}



const initTracks = async () => {
  const tempAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
  audioTrack.value = tempAudioTrack
  const tracks = await AgoraRTC.createScreenVideoTrack({
    encoderConfig: "720p"
  }, "auto")
  if (tracks instanceof Array) {
    screenVideoTrack.value = tracks[0]
    screenAudioTrack.value = tracks[1]
    tracks[0].on('track-ended', handleTrackEnded)
    return [tempAudioTrack, ...tracks]
  } else {
    screenVideoTrack.value = tracks
    tracks.on('track-ended', handleTrackEnded)
    return [tempAudioTrack, tracks]
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



const join = async () => {
  try {
    // Add event listeners to the client.
    client.on("user-published", handleUserPublished)
    client.on("user-unpublished", handleUserUnpublished);

    const options = formRef.value.getValue()
    // Join a channel
    options.uid = await client.join(options.appId, options.channel, options.token || null, options.uid || null)
    const tracks = await initTracks()
    await client.publish(tracks)
    showJoinedMessage(options)
    joined.value = true
  } catch (error) {
    console.error(error)
    ElMessage.error(error.message)
  }
}

const leave = async () => {
  screenAudioTrack.value?.close()
  screenVideoTrack.value?.close()
  audioTrack.value?.close()
  remoteUsers.value = {}
  await client.leave()
  joined.value = false
  ElMessage.success('leave channel success!')
}

</script>

