<template>
  <div>
    <section class="hero-section hero-bg">
      <div class="d-flex align-items-center p-3">
        <img src="/icon.svg" class="logo" width="30px" />
        <h1 class="text-white mb-0 ms-2 fw-light">Transly</h1>
      </div>

      <hr class="m-0" />
      <div class="container text-center py-3">
        <p class="lead mb-4 fs-1 text-white fw-bolder">
          Instant, Free and Accurate Transcription
        </p>
        <UploadBox
          @fileSelected="uploadAudio"
          @transcribePressed="transcribeUrl"
          :progress="uploadProgress"
          class="mt-5 mb-3"
          :errorText="errorText"
          :transcriptLoading="transcriptLoading"
          :estimatedTimeRemaining="estimatedTimeRemaining"
        ></UploadBox>
        <audio
          ref="audioElement"
          id="audio"
          preload="auto"
          @loadeddata="audioLoaded"
          :src="audioLocalUrl"
          @loadedmetadata="getAudioDuration"
        ></audio>
      </div>
    </section>
    <div>
      <!-- <Chat :utterances="tedTalk.utterances" :audiosrc="audioLocalUrl"/> -->
      <template v-if="!transcriptLoading && transcript">
        <Chat :utterances="utterances" :audiosrc="audioLocalUrl" />
      </template>
      <template v-else-if="transcriptLoading">
        <div class="my-5">
          <div class="d-flex justify-content-center align-items-center">
            <div
              class="spinner-border text-primary spinner-dimensions"
              role="status"
            >
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
          <div class="text-center text-capitalize">
            {{ transcriptResultStatus }}
          </div>
          <div
            v-if="estimatedTimeRemaining !== ''"
            class="text-center text-capitalize"
          >
            Estimated Time Remaining: {{ estimatedTimeRemaining }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
// import tedTalk  from '~/assets/sample/tedTalk.json';
const API_BASE_URL = "https://api.assemblyai.com/v2";
const API_KEY = "119e15faf70346fea5e487f2b4b7f94b";
const audioLocalUrl = ref("");
const audioElement = ref<any>(null);
const audioDuration = ref(0);
const estimatedTime = ref(0);
const estimatedTimeRemaining = ref("");
const transcript = ref("");
const utterances = ref<Utterance[]>([]);
const uploadProgress = ref(-1);
const uploadUrl = ref("");
const errorText = ref("");
const transcriptResultStatus = ref("");
const transcriptLoading = ref(false);
const urlUpdated = ref(false);
const getAudioDuration = () => {
  if (audioElement.value) {
    audioDuration.value = audioElement.value.duration;
  }
};

watch(audioDuration, () => {
  estimatedTime.value = Math.round(audioDuration.value * 0.23) + 5;
});

const audioLoaded = () => {
  const audio = document.getElementById("audio") as HTMLAudioElement;
  audio.muted = true;
  audio.playbackRate = 16;
  audio.play();
};
const audioStopped = () => {
  const audio = document.getElementById("audio") as HTMLAudioElement;
  audio.pause();
};
const uploadAudio = async (file: any) => {
  if (transcriptLoading.value) {
    alert("Please wait for the current transcription to finish");
    return;
  }
  audioStopped();
  transcript.value = "";
  errorText.value = "";
  uploadProgress.value = 0;
  audioLocalUrl.value = URL.createObjectURL(file);
  const response = await axios.post(`${API_BASE_URL}/upload`, file, {
    headers: {
      authorization: API_KEY,
    },
    onUploadProgress: (progressEvent: any) => {
      uploadProgress.value = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
    },
  });
  const responseData = await response.data;

  if (responseData && responseData.upload_url) {
    uploadUrl.value = responseData.upload_url;
    urlUpdated.value = true;
  }
};
const estimatedTimeCountDown = () => {
  if (estimatedTime.value < 0) return;

  let timeRemaining = estimatedTime.value;
  estimatedTimeRemaining.value = formatTime(timeRemaining);

  const timer = setInterval(() => {
    timeRemaining -= 1;
    if (timeRemaining <= 0 || transcript.value !== "") {
      clearInterval(timer);
      estimatedTimeRemaining.value = "Any Moment Now...";
    } else {
      estimatedTimeRemaining.value = formatTime(timeRemaining);
    }
  }, 1000);
};
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
const handleTranscriptError = (message: any) => {
  errorText.value = message;
  resetTranscriptState();
};

const resetTranscriptState = () => {
  uploadProgress.value = -1;
  transcriptLoading.value = false;
  estimatedTimeRemaining.value = "";
  urlUpdated.value = false;
};

const handleCompletedTranscript = (transcriptResult: any) => {
  console.log(transcriptResult);
  if (transcriptResult.text === null || transcriptResult.text === "") {
    handleTranscriptError("No Words Detected, Upload a different file.");
    return;
  }

  if (transcriptResult.error) {
    handleTranscriptError(transcriptResult.error);
    return;
  }

  if (
    transcriptResult.utterances !== null &&
    transcriptResult.utterances.length < 2
  ) {
    handleTranscriptError("Please Upload Audio with more than one speaker.");
    return;
  }
  console.log("Transcript Completed");
  transcriptResultStatus.value = transcriptResult.status;
  transcript.value = transcriptResult.text;
  utterances.value = transcriptResult.utterances;
  resetTranscriptState();
};
const transcribeUrl = async (uploadurl: string) => {
  errorText.value = "";
  transcriptLoading.value = true;
  const startTime = Date.now();
  const timeout = 3000;
  while (!urlUpdated.value && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  if (!urlUpdated.value) {
    errorText.value = "Timeout reached while waiting for URL update";
    transcriptResultStatus.value = "Error";
    transcriptLoading.value = false;
    return;
  }
  transcriptResultStatus.value = "Transcribing your uploaded file";
  const transcriptionResponse = await fetch(`${API_BASE_URL}/transcript`, {
    method: "POST",
    headers: {
      authorization: API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio_url: uploadUrl.value,
      speaker_labels: true,
    }),
  });
  const transcriptionData = await transcriptionResponse.json();
  if (transcriptionData && transcriptionData.id) {
    estimatedTimeCountDown();
    let transcriptResult = null;
    do {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const transcriptResponse = await fetch(
        `${API_BASE_URL}/transcript/${transcriptionData.id}`,
        {
          headers: {
            authorization: API_KEY,
          },
        }
      );

      transcriptResult = await transcriptResponse.json();
      transcriptResultStatus.value = transcriptResult.status;
    } while (
      transcriptResult.status === "queued" ||
      transcriptResult.status === "processing"
    );

    if (transcriptResult.status === "completed") {
      console.log("hello");
      handleCompletedTranscript(transcriptResult);
    } else {
      errorText.value = transcriptResult.error;
      utterances.value = [];
      transcript.value = "Error retrieving transcript";
      resetTranscriptState();
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
