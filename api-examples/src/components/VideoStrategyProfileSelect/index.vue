<template>
  <span :style="{ display: 'inline-block', ...style }">
    <div class="video-profiles">
      <span class="">优化策略: </span>
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
  key: "motion",
  label: "流畅优先",
}, {
  key: "detail",
  label: "清晰优先",
}, {
  key: null,
  label: "默认优化策略",
}];

const props = defineProps({
  defaultValue: {
    type: String,
    default: null
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
