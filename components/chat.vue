<template>
  <div class="chat-container py-3 px-3">
    <div v-for="(utterance, index) in utterances" :key="index" class="chat-message">
      <div :class="['chat-bubble', 'speaker', 'p-3', 'rounded-3', 'mb-3', 'd-inline-block']">
        <div class="d-flex justify-content-between align-items-center w-100">
          <strong class="speaker-label me-2">Speaker {{ labelToNumber(utterance.speaker) }}</strong>
          <div class="d-flex justify-content-between align-items-center gap-2 ">
            <button v-show="utterance.start == currentStart" class="btn btn-sm btn-outline-danger py-0" @click="stopAudio">Stop</button>
            <div v-show="utterance.start == currentStart" class="time-label text-primary " role="button" @click="pausePlay" data-toggle="tooltip" data-placement="top" title="Click to Pause">{{ formatSeconds(playerCurrentTime) }}
            </div>
            <div class="time-label text-primary" role="button" @click="audioPlayBack(utterance.words[0].start, utterance.end,  utterance.words)" data-toggle="tooltip" data-placement="top" title="Click to Play">{{ formatStartTime(utterance.start) }}
            </div>
          </div>
        </div>
        <div class="make-relative">
          <p class="hidden-search flex-wrap pt-1">{{ utterance.text}}</p>
          <div class="d-flex flex-wrap pt-1">
            <template v-for="(word, wordIndex) in utterance.words" :key="wordIndex">
              <span :id="'word-' + wordIndex" @click="audioPlayBack(word.start, utterance.end,  utterance.words)" role="button" class="z-10 unselectable" :class="{ 'highlighted-word': playerCurrentTime  >= word.start/1000 && playerCurrentTime  <= word.end/1000 }">{{ word.text }}</span>
              <span v-if="wordIndex < utterance.words.length - 1" class="z-10 unselectable">&nbsp;</span>
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
  currentStart.value = words[0].start;
  const audio = document.getElementById('audio') as HTMLAudioElement;
  audio.playbackRate = 1;
  audio.currentTime = start / 1000
  const endTime = (end / 1000);
  if (currentStopPlayback) {
    audio.removeEventListener('timeupdate', currentStopPlayback);
  }
  audio.play();
  audio.muted = false;
  playerCurrentTime.value = audio.currentTime;
  const stopPlayback = () => {
    playerCurrentTime.value = audio.currentTime ;
    if (audio.currentTime >= endTime + 0.5) {

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
  const minutes = Math.floor(seconds/ 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
.highlighted-word {
  background-color: #0dcaf0;
  color: white;
}
.hidden-search {
  position: absolute;
  color: #f5f5f5;
  z-index: 3;
  overflow: hidden;

}
.z-10 {
  position: relative;
  z-index: 10;

}
.make-relative {
  position: relative;
}
</style>
