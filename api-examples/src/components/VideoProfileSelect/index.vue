<template>
  <span :style="{ display: 'inline-block', ...style }">
    <div class="video-profiles">
      <span class="">画质: </span>
      <el-dropdown :style="{ marginLeft: '10px' }" :disabled="disabled">
        <el-button type="primary" :disabled="disabled">
          {{ label }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(item) in videoProfiles" :key="item.key" @click="click(item.key)">
              <span :class="{ active: item.key == id }">{{ item.label }}
              </span></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

  </span>
</template>


<script setup>
import { ref, computed } from 'vue'

const videoProfiles = [{
  key: "360p_7",
  label: "480×360, 15fps, 320Kbps",
}, {
  key: "360p_8",
  label: "480×360, 30fps, 490Kbps",
}, {
  key: "480p_1",
  label: "640×480, 15fps, 500Kbps",
}, {
  key: "480p_2",
  label: "640×480, 30fps, 1000Kbps",
}, {
  key: "720p_1",
  label: "1280×720, 15fps, 1130Kbps",
}, {
  key: "720p_2",
  label: "1280×720, 30fps, 2000Kbps",
}, {
  key: "1080p_1",
  label: "1920×1080, 15fps, 2080Kbps",
}, {
  key: "1080p_2",
  label: "1920×1080, 30fps, 3000Kbps",
}, {
  key: "1080p_3",
  label: "640×480, 30fps, 3150Kbps",
}, {
  key: "1080p_5",
  label: "640×480, 60fps, 4780Kbps",
}, {
  key: "1440p_1",
  label: "2560×1440, 15fps, 500Kbps",
}, {
  key: "1440p_3",
  label: "2560×1440, 30fps, 500Kbps",
}, {
  key: "4k_1",
  label: "4096×2160, 15fps, 未知Kbps",
}, {
  key: "4k_1",
  label: "4096×2160, 30fps, 未知Kbps",
}];

const props = defineProps({
  defaultValue: {
    type: String,
    default: '720p_2'
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
  return videoProfiles.find(item => item.key === id.value)?.label
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
