<script setup lang="ts">
import "cropperjs/dist/cropper.css"
import Cropper from "cropperjs"
import { onMounted, ref } from "vue"

interface Props {
  file?: File
  aspectRatio: number
}
const props = defineProps<Props>()

const img = ref<HTMLImageElement | undefined>()

const cropperConfig: Cropper.Options<HTMLImageElement> = {
  aspectRatio: props.aspectRatio,
  viewMode: 2,
}

let cropper: Cropper | undefined

onMounted(() => {
  const reader = new FileReader()

  reader.onload = (event) => {
    img.value!.onload = () => {
      cropper = new Cropper(img.value!, cropperConfig)
    }
    img.value!.src = <string>event.target!.result
  }

  reader.readAsDataURL(props.file!)
})

const resolveBlob = () => {
  cropper?.getCroppedCanvas().toBlob((blob) => {
    console.log("inside", blob)
    return blob
  })
}

defineExpose({
  resolveBlob,
})
</script>

<template>
  <div class="max-h-[350px]">
    <img ref="img" />
  </div>
</template>
