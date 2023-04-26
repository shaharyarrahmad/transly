<template>
  <div class="chat-container py-3 px-3">
    <audio id="audio" :src="audiosrc" preload="auto"></audio>
    <div v-for="(utterance, index) in utterances" :key="index" class="chat-message">
      <div :class="['chat-bubble', 'speaker', 'p-3', 'rounded-3', 'mb-3', 'd-inline-block']">
        <div class="d-flex justify-content-between align-items-center w-100">
          <strong class="speaker-label me-2">Speaker {{ labelToNumber(utterance.speaker) }}</strong>
          <div class="d-flex justify-content-between align-items-center gap-2 ">
            <button v-show="utterance.start == currentStart" class="btn btn-sm btn-outline-danger py-0" @click="stopAudio">Stop</button>
            <div v-show="utterance.start == currentStart" class="time-label text-primary " role="button" @click="pausePlay" data-toggle="tooltip" data-placement="top" title="Click to Pause">{{ formatSeconds(playerCurrentTime) }}
            </div>
            <div class="time-label text-primary" role="button" @click="audioPlayBack(utterance.start, utterance.end,  utterance.words)" data-toggle="tooltip" data-placement="top" title="Click to Play">{{ formatStartTime(utterance.start) }}
            </div>
          </div>
        </div>
        <div>
          <div class="d-flex flex-wrap">
            <template v-for="(word, wordIndex) in utterance.words" :key="wordIndex">
              <span :id="'word-' + word.start">{{ word.text }}</span>
              <span v-if="wordIndex < utterance.words.length - 1">&nbsp;</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">

const props = defineProps({
  utterances: {
    type: Object as PropType<Array<Utterance>>,
    required: true,
  },
  audiosrc: {
    type: String,
    required: false,
    default: '',
  },
});

const labelToNumber = (label: string) => {
  return label.charCodeAt(0) - 64;
};
const currentStart = ref(-1);
const playerCurrentTime = ref(0);
let currentStopPlayback: () => void;
const pausePlay = () => {
  const audio = document.getElementById('audio') as HTMLAudioElement;
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
};
const audioPlayBack = (start: number, end: number, words: Word[]) => {
  currentStart.value = start;

  const audio = document.getElementById('audio') as HTMLAudioElement;
  const endTime = (end / 1000);
  audio.currentTime = start / 1000;
  audio.play();
  if (currentStopPlayback) {
    audio.removeEventListener('timeupdate', currentStopPlayback);
  }
  const stopPlayback = () => {
    playerCurrentTime.value = audio.currentTime;
    highlightCurrentWord(audio.currentTime, words);
    console.log(audio.currentTime, playerCurrentTime.value);
    if (audio.currentTime >= endTime) {

      audio.pause();
      currentStart.value = -1;
      playerCurrentTime.value = -1;
      audio.removeEventListener('timeupdate', stopPlayback);
    }
  };

  audio.addEventListener('timeupdate', stopPlayback);
  currentStopPlayback = stopPlayback;
};
const stopAudio = () => {
  currentStart.value = -1;
  const audio = document.getElementById('audio') as HTMLAudioElement;
  audio.currentTime = 0;
  audio.pause();
};

const formatStartTime = (start: number) => {
  const seconds = Math.floor(start / 1000);
  const minutes = Math.floor(seconds / 60);

  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};
const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};
const highlightCurrentWord = (currentTime: number, words: Word[]) => {
  const currentWordIndex = words.findIndex(
    (word) => currentTime >= ((word.start / 1000)) && currentTime <= ((word.end / 1000 ))
  );
  words.forEach((word, index) => {
    const wordElement = document.getElementById(`word-${word.start}`);
    if (index === currentWordIndex) {
      wordElement.style.backgroundColor = "#0dcaf0";
      wordElement.style.color = "white";
    } else {
      wordElement.style.backgroundColor = "";
      wordElement.style.color = "";
    }
  });
};
</script>

<style scoped>
.chat-container {
  margin: 0 0;
  width: 100%;
  border-radius: 5px;
}

.chat-message {
  margin-bottom: 1rem;
}

.speaker {
  background-color:  #f5f5f5;
  color: grey;
}

</style>
