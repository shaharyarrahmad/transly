<template>
  <div class="upload-block text-center"
    @dragover.prevent
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    :class="{ 'dragging': isDragging , 'hover':progress!=100}  ">
    <div  @click="selectFile">
      <svg  v-if="progress==-1" xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" class="bi bi-cloud-arrow-up upload-icon" viewBox="0 0 16 16" >
      <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2z"/>
      <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
      </svg>
      <template v-if="progress==100">
      <svg  xmlns="http://www.w3.org/2000/svg" width="65" height="65" fill="currentColor" class="bi bi-check-circle upload-icon2" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
      </svg>
      <div class="m-1" v-show="errorText == ''">Upload Complete, Press Transcribe</div>
      </template>
      <div class="text-danger negativeMargin" style="font-size: small;" v-show="errorText !== ''">Error: {{ errorText }}</div>
      <div v-show="progress!==-1 && progress<100" class="m-1">
        <div class="spinner-border  text-primary spinner-dimensions "  role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div>Uploading: {{ progress }}%</div>
      </div>
    </div>
    <input type="file" @change="onFileChange" accept="audio/*" class="d-none" ref="fileInput"/>
    <button class="btn btn-primary" :disabled="progress !== 100" @click="onTrasncribePressed" >Transcribe</button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  progress: {
    type: Number,
    required: true,
  },
  errorText: {
    type: String,
    required: false,
    default: '',
  },
});
import { ref, computed } from 'vue';
const emit = defineEmits(['file-selected', 'transcribe-pressed'])

const fileInput = ref(null);
const isDragging = ref(false);
const svgWh = ref(80)
const selectFile = () => {
  fileInput.value.click();
};
const onTrasncribePressed = () =>{
  emit('transcribe-pressed');
}
const onFileChange = (event) => {
  const file = event.target.files[0];
  emit('file-selected', file);
};

const handleDragEnter = () => {
isDragging.value = true;
};

const handleDragLeave = () => {

isDragging.value = false;
};

const handleDrop = (event) => {
const file = event.dataTransfer.files[0];
emit('file-selected', file);
isDragging.value = false;
};
const uploadClasses = (progress) =>{
// if progress > 0
}


</script>
<style scoped>
.upload-block {
  padding: 2rem;
  background-color: var(--bs-light);
  border-radius: 1rem;
  max-width: 400px;
  margin: 0 auto;
  border: 2px solid transparent;
}

.dragging {
  border-color: var(--bs-primary);
}

.upload-icon {
  font-size: 4rem;
  color: var(--bs-primary);
  margin-bottom: 1rem;
}
.upload-icon2 {
  color: var(--bs-primary);
}
div.hover svg{
  transition: transform 0.2s ease-in-out;
}
div.hover:hover svg {
      transform: scale(1.5);
    }
h2 {
  margin-bottom: 1rem;
}
.spinner-dimensions{
  width: 60px;
  height: 60px;

}
.negativeMargin{
  margin-top: -1rem;
  margin-bottom: .3rem;
}
</style>
