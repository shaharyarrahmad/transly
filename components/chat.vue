<template>
  <div class="chat-container py-3 px-3">
    <p class="text-info text-center">
      You can easily navigate to any part of the audio by clicking on the
      corresponding word/timestamp.
    </p>
    <div
      v-for="(utterance, index) in splitLongUtterances(utterances)"
      :key="index"
      class="chat-message"
    >
      <div
        :class="[
          'chat-bubble',
          'speaker',
          'p-3',
          'rounded-3',
          'mb-3',
          'd-inline-block',
        ]"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center w-100">
            <strong class="speaker-label me-2"
              >Speaker {{ labelToNumber(utterance.speaker) }}</strong
            >
            <div
              class="d-flex justify-content-between align-items-center gap-2"
            >
              <div
                v-if="utterance.start == currentStart"
                class="time-label text-primary"
                role="button"
                @click="pausePlay"
                data-toggle="tooltip"
                data-placement="top"
                title="Click to Pause"
              >
                {{ formatSeconds(playerCurrentTime) }}
              </div>
              <div
                v-else
                class="time-label text-primary"
                role="button"
                @click="
                  audioPlayBack(
                    utterance.words[0].start,
                    utterance.end,
                    utterance.words
                  )
                "
                data-toggle="tooltip"
                data-placement="top"
                title="Click to Play"
              >
                {{ formatStartTime(utterance.start) }}
              </div>
              <button
                v-show="
                  playerCurrentTime >= utterance.start / 1000 &&
                  playerCurrentTime <= utterance.end / 1000
                "
                class="btn btn-sm btn-outline-danger py-0"
                @click="stopAudio"
              >
                Stop
              </button>
            </div>
          </div>
          <button
            @click="copyToClipboard(utterance.text)"
            class="btn btn-sm copy-button"
          >
            &#128203;
          </button>
        </div>
        <div class="make-relative">
          <p class="hidden-search flex-wrap pt-1">{{ utterance.text }}</p>
          <div class="d-flex flex-wrap pt-1">
            <template
              v-for="(word, wordIndex) in utterance.words"
              :key="wordIndex"
            >
              <span
                :id="'word-' + word.start"
                @click="
                  audioPlayBack(word.start, utterance.end, utterance.words)
                "
                role="button"
                class="z-10 unselectable"
                :class="{
                  'highlighted-word':
                    playerCurrentTime >= word.start / 1000 &&
                    playerCurrentTime <= word.end / 1000,
                }"
                >{{ word.text }}</span
              >
              <span
                v-if="wordIndex < utterance.words.length - 1"
                class="z-10 unselectable"
                >&nbsp;</span
              >
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const showCopyButton = ref(false);

const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      console.error("Error copying text: ", err);
    });
};
import { useSplitLongUtterances } from "~/composables/useSplitLongUtterances";
const { splitLongUtterances } = useSplitLongUtterances();
const props = defineProps({
  utterances: {
    type: Object as PropType<Array<Utterance>>,
    required: true,
  },
  audiosrc: {
    type: String,
    required: false,
    default: "",
  },
});

const labelToNumber = (label: string) => {
  return label.charCodeAt(0) - 64;
};
const scrollingManually = ref(false);
const currentStart = ref(-1);
const playerCurrentTime = ref(0);
let currentStopPlayback: () => void;
const pausePlay = () => {
  const audio = document.getElementById("audio") as HTMLAudioElement;
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
};
const audioPlayBack = (start: number, end: number, words: Word[]) => {
  currentStart.value = words[0].start;
  const audio = document.getElementById("audio") as HTMLAudioElement;
  audio.playbackRate = 1;
  audio.currentTime = start / 1000;
  const endTime = end / 1000;
  if (currentStopPlayback) {
    audio.removeEventListener("timeupdate", currentStopPlayback);
  }
  audio.play();
  audio.muted = false;
  playerCurrentTime.value = audio.currentTime;
  const stopPlayback = () => {
    playerCurrentTime.value = audio.currentTime;
    const highlightedWordEl = document.getElementById(
      `word-${
        words.find(
          (word) =>
            audio.currentTime >= word.start / 1000 &&
            audio.currentTime <= word.end / 1000
        )?.start
      }`
    );
    if (highlightedWordEl && !scrollingManually.value) {
      highlightedWordEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (audio.currentTime >= endTime) {
      audio.pause();
      currentStart.value = -1;
      playerCurrentTime.value = -1;
      audio.removeEventListener("timeupdate", stopPlayback);
    }
  };

  audio.addEventListener("timeupdate", stopPlayback);
  currentStopPlayback = stopPlayback;
};
const stopAudio = () => {
  currentStart.value = -1;
  const audio = document.getElementById("audio") as HTMLAudioElement;
  audio.currentTime = 0;
  audio.pause();
};

const formatStartTime = (start: number) => {
  const seconds = Math.floor(start / 1000);
  const minutes = Math.floor(seconds / 60);

  return `${minutes.toString().padStart(2, "0")}:${(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
};
const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};
const scrollingTimeout = ref();
const handleScroll = () => {
  scrollingManually.value = true;
  clearTimeout(scrollingTimeout.value);
  scrollingTimeout.value = setTimeout(() => {
    scrollingManually.value = false;
  }, 3000);
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});
onBeforeMount(() => {
  window.removeEventListener("scroll", handleScroll);
});
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
  background-color: #f5f5f5;
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
.chat-bubble {
  position: relative;
}
.chat-bubble .copy-button {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.chat-bubble:hover .copy-button {
  opacity: 1;
}
</style>
