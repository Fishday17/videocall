<template>
  <span :style="{ display: 'inline-block', ...style }">
    <div class="video-profiles">
      <span class="">摄像头: </span>
      <el-dropdown :style="{ marginLeft: '10px' }" :disabled="disabled">
        <el-button type="primary" :disabled="disabled">
          {{ label }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item) in items" :key="item.key" @click="click(item.key)">
              <span :class="{ active: item.key == id }">{{ item.label }}
              </span></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </span>
</template>


<script setup>
import {ref, computed, onMounted} from 'vue'
import AgoraRTC from "agora-rtc-sdk-ng";

const items = ref([])

onMounted(async () => {
  const devices = await AgoraRTC.getCameras()
  items.value = devices.map(item => ({ label: item.label, key: item.deviceId }))
  id.value = items.value[0].key
  console.log(devices)
  console.log(id.value)
})

const props = defineProps({
  defaultValue: {
    type: String,
    default: ''
  },
  style: {
    type: Object,
    default: {}
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change'])

const id = ref(props.defaultValue)


const label = computed(() => {
  if(items.value.length === 0) return ''
  return items.value.find(item => item.key === id.value)?.label
})

const click = (val) => {
  id.value = val
  emit('change', val)
}

</script>


<style scoped>
.video-profiles {
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
</style>
