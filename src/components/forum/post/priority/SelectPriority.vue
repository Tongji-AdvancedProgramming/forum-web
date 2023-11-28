<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{ curPriority: number }>()
const priority = ref(props.curPriority)

const marks = ref<Record<number, any>>({
  0: "无任何置顶",
  3: "",
  6: "",
  9: "最高级别置顶",
})

const getPriority = () => priority.value
defineExpose<{ getPriority: () => number }>({ getPriority })
</script>

<template>
  <div class="py-5">
    <div class="font-bold">置顶等级</div>
    <div class="mt-5 px-8 font-normal">
      <a-slider v-model:value="priority" :marks="marks" :max="9" />
    </div>
    <div class="mt-10 text-sm text-gray-500">
      <ul>
        <li>置顶等级高者优先显示</li>
        <li>相同置顶等级，后发布者优先显示</li>
      </ul>
    </div>
  </div>
</template>

<style scoped></style>
