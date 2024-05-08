<template>
  <el-row :gutter="16" ref={ref}>
    <el-col v-show="false" :span="6">
      <div class="title">APP ID</div>
      <el-input type="text" placeholder="Enter the appid" v-model="appId"></el-input>
      <div class="footer"> 输入appId </div>
    </el-col>
    <el-col v-show="false" :span="6">
      <div class="title">Token</div>
      <el-input type="text" placeholder="Enter the app token" v-model="token" />
      <div class="footer"> 输入token ，临时token有效期一天，如果登陆失败，一般都是token过期了 </div>
    </el-col>
    <el-col :span="6">
      <div class="title">频道名称</div>
      <el-input type="text" placeholder="Enter the channel name" v-model="channel" />
    </el-col>
    <el-col :span="6">
      <div class="title">userId</div>
      <el-input type="text" placeholder="Enter the user ID (number)" v-model="uid" :formatter="(value) => `${value}`"
        :parser="(value) => value.replace(/[^0-9]/g, '')"></el-input>
    </el-col>
    <el-col :span="6">
      <div class="title">widthMin:</div>
      <el-input type="text" placeholder="Enter the widthMin" v-model="widthMin" />
    </el-col>
    <el-col :span="6">
      <div class="title">withMax:</div>
      <el-input type="text" placeholder="Enter the withMax" v-model="withMax" />
    </el-col>
    <el-col :span="6">
      <div class="title">heightMin:</div>
      <el-input type="text" placeholder="Enter the heightMin" v-model="heightMin" />
    </el-col>
    <el-col :span="6">
      <div class="title">heightMax:</div>
      <el-input type="text" placeholder="Enter the heightMax" v-model="heightMax" />
    </el-col>
    <el-col :span="6">
      <div class="title">frameRateMin:</div>
      <el-input type="text" placeholder="Enter the frameRateMin" v-model="frameRateMin" />
    </el-col>
    <el-col :span="6">
      <div class="title">frameRateMax:</div>
      <el-input type="text" placeholder="Enter the frameRateMax" v-model="frameRateMax" />
    </el-col>
    <el-col :span="6">
      <div class="title">bitrateMin:</div>
      <el-input type="text" placeholder="Enter the bitrateMin" v-model="bitrateMin" />
    </el-col>
    <el-col :span="6">
      <div class="title">bitrateMax:</div>
      <el-input type="text" placeholder="Enter the bitrateMax" v-model="bitrateMax" />
    </el-col>
  </el-row>
</template>


<script setup>
import { ref } from "vue"

const appId = ref("ebb5f19cda414fe29b3495999d525c04")
const token = ref(
    "007eJxTYJi07UbDO2ZVZgnN3f83B+o80blkWmKbLOra5jLntOes2fUKDKlJSaZphpbJKYkmhiZpqUaWScYmlqaWlpYppkamyQYmf/v+pDQEMjJMe2fCxMgAgSA+E4OhIQMDAOmiHlc="
)

const channel = ref("11")
const uid = ref("")
const widthMin = ref("")
const withMax = ref("")
const heightMin = ref("")
const heightMax = ref("")
const frameRateMin = ref("")
const frameRateMax = ref("")
const bitrateMin = ref("")
const bitrateMax = ref("")


defineExpose({
  getValue: () => ({
    appId: appId.value,
    token: token.value,
    channel: channel.value,
    uid: uid.value ? Number(uid.value) : null,
    widthMin: widthMin.value ? Number(widthMin.value) : null,
    widthMax: withMax.value ? Number(withMax.value) : null,
    heightMin: heightMin.value ? Number(heightMin.value) : null,
    heightMax: heightMax.value ? Number(heightMax.value) : null,
    frameRateMin: frameRateMin.value ? Number(frameRateMin.value) : null,
    frameRateMax: frameRateMax.value ? Number(frameRateMax.value) : null,
    bitrateMin: bitrateMin.value ? Number(bitrateMin.value) : null,
    bitrateMax: bitrateMax.value ? Number(bitrateMax.value) : null
  }),
  setValue: (data) => {
    if (data.appId) {
      appId.value = data.appId
    }
    if (data.token) {
      token.value = data.token
    }
    if (data.channel) {
      channel.value = data.channel
    }
    if (data.uid) {
      uid.value = data.uid
    }
    if (data.widthMin) {
      widthMin.value = data.widthMin
    }
    if (data.withMax) {
      withMax.value = data.withMax
    }
    if (data.heightMin) {
      heightMin.value = data.heightMin
    }
    if (data.heightMax) {
      heightMax.value = data.heightMax
    }
    if (data.frameRateMin) {
      frameRateMin.value = data.frameRateMin
    }
    if (data.frameRateMax) {
      frameRateMax.value = data.frameRateMax
    }
    if (data.bitrateMin) {
      bitrateMin.value = data.bitrateMin
    }
    if (data.bitrateMax) {
      bitrateMax.value = data.bitrateMax
    }
  }
})

</script>


<style scoped>
.title {
  margin-bottom: 5px;
}

.footer {
  margin-top: 5px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  appearance: "textfield";
}
</style>
