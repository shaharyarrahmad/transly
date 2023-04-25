<template>
  <div class="upload-block text-center"
    @dragover.prevent
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @mouseenter="handleMouseEnter"
    @drop.prevent="handleDrop">
    <div class="" @click="selectFile">
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-cloud-arrow-up upload-icon" viewBox="0 0 16 16" :style="uploadIconStyle" >
  <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
  <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
    </svg>
    <div :class="uploadClasses(progress)">{{ progress }}</div>
    </div>
    <input type="file" @change="onFileChange" accept="audio/*" class="d-none" ref="fileInput" />

    <button class="btn btn-primary">Transcribe</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
});
import { ref } from 'vue';
const emit = defineEmits(['file-selected'])

const fileInput = ref(null);

const selectFile = () => {
  fileInput.value.click();
};

const onFileChange = (event) => {
  const file = event.target.files[0];
  emit('file-selected', file);
};
const handleMouseEnter = () =>{

}
const handleDragEnter = () => {
  // You can add some styling here when the user starts dragging a file over the drop area

};

const handleDragLeave = () => {
  // You can remove the styling added in handleDragEnter when the user stops dragging a file over the drop area
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  emit('file-selected', file);
};
const uploadClasses = (progress) =>{
  // if progress > 0
}
const uploadIconStyle = computed(() => ({
  // fill gradiant, sharp, bottom to top, grey to blue
  fill: `linear-gradient(to top, grey ${100 - props.progress}%, blue ${props.progress}%)`,
}));
</script>

<style scoped>
.upload-block {
  padding: 2rem;
  background-color: var(--bs-light);
  border-radius: 1rem;
  max-width: 400px;
  margin: 0 auto;
  margin-top: 20px;
}

.upload-icon {
  font-size: 4rem;
  color: var(--bs-primary);
  margin-bottom: 1rem;
}

h2 {
  margin-bottom: 1rem;
}
</style>
