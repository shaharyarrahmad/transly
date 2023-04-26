<template>
  <div >
    <section class="hero-section hero-bg">
      <div class="d-flex align-items-center p-3">
        <img src="/icon.svg" class="logo" width="30px">
        <h1 class="text-white mb-0 ms-2 fw-light">Transly</h1>
      </div>

      <hr class="m-0">
      <div class="container text-center py-3">
        <p class="lead mb-4 fs-1 text-white fw-bolder">Instant, Free and Accurate Transcription</p>
        <UploadBox @fileSelected="uploadAudio" @transcribePressed=" transcribeUrl" :progress="uploadProgress" class="mt-5 mb-3" :errorText="errorText"></UploadBox>
      </div>
    </section>
    <div>
      <template  v-if="!transcriptLoading && transcript">
        <Chat :utterances="utterances" />
      </template>
      <template v-else-if="transcriptLoading">
        <div class="my-5">
        <div class="d-flex justify-content-center align-items-center">
          <div class="spinner-border  text-primary spinner-dimensions "  role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
      </div>
      <div class="text-center text-capitalize">{{ transcriptResultStatus }}</div>
    </div>
      </template>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const API_BASE_URL = 'https://api.assemblyai.com/v2';
const API_KEY = '119e15faf70346fea5e487f2b4b7f94b';

const transcript = ref('');
const utterances = ref<Utterance[]>([]);
const uploadProgress = ref(-1)
const uploadUrl = ref('')
const errorText = ref('')
const transcriptResultStatus = ref('')
const transcriptLoading = ref(false)
const uploadAudio = async (file: any) => {
    errorText.value = ''
    uploadProgress.value = 0
    const response = await axios.post(`${API_BASE_URL}/upload`, file, {
      headers: {
        'authorization': API_KEY,
        'Transfer-Encoding': 'chunked',
      },
      onUploadProgress: (progressEvent: any) => {
        uploadProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      },
    });
    const responseData = await response.data;

    if (responseData && responseData.upload_url) {
      uploadUrl.value = responseData.upload_url
    }
  };
  const transcribeUrl= async (uploadurl: string)=> {
    errorText.value = ''
    transcriptResultStatus.value = 'Queued'
    transcriptLoading.value = true
      const transcriptionResponse = await fetch(`${API_BASE_URL}/transcript`, {
        method: 'POST',
        headers: {
          'authorization': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: uploadUrl.value,
          speaker_labels: true,
        }),
      });
      const transcriptionData = await transcriptionResponse.json();
      if (transcriptionData && transcriptionData.id) {
        let transcriptResult = null;
        do {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          const transcriptResponse = await fetch(`${API_BASE_URL}/transcript/${transcriptionData.id}`, {
            headers: {
              'authorization': API_KEY,
            },
          });
          transcriptResult = await transcriptResponse.json();
          transcriptResultStatus.value = transcriptResult.status
        } while (transcriptResult.status === 'queued' || transcriptResult.status === 'processing');

        if (transcriptResult.status === 'completed') {
          if(transcriptResult.text === null) {
            errorText.value = 'No transcript found'
          }
          if(transcriptResult.error !== null) {
            errorText.value = transcriptResult.error
          }
          if(transcriptResult.utterances !== null && transcriptResult.utterances.length < 2) {
            errorText.value = 'Please Upload Audio with more than one speaker.'
            uploadProgress.value = -1
            transcriptLoading.value = false
            return
          }

          transcriptLoading.value = false
          transcriptResultStatus.value = transcriptResult.status
          transcript.value = transcriptResult.text;
          utterances.value = transcriptResult.utterances
          uploadProgress.value = -1
        } else {
          transcript.value = 'Error retrieving transcript';
        }
      }
    };
</script>
<style scoped>

.upload-box {
  background-color: #ffffff;
  border: 2px dashed #007bff;
  border-radius: 5px;
}

input[type="file"] {
  display: none;
}
.logo path {
  fill: white;
}
</style>


<!-- kill port in terminal single line -->
