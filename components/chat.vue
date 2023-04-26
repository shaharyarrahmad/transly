<template>
  <div class="chat-container py-3 px-3">
    <div v-for="(utterance, index) in utterances" :key="index" class="chat-message">
      <div :class="['chat-bubble', `speaker-${utterance.speaker}`, 'p-3', 'rounded-3', 'mb-3', 'd-inline-block']">
        <div class="d-flex justify-content-between w-100">
          <strong class="speaker-label me-2">Speaker {{ labelToNumber(utterance.speaker) }}</strong>
          <small class="time-label text-primary">{{ formatStartTime(utterance.start) }}</small>
        </div>
        <div>{{ utterance.text }}</div>
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
});
// labelToNumber whole ABC to 123
const labelToNumber = (label: string) => {
  return label.charCodeAt(0) - 64;
};
const formatStartTime = (start: number) => {
  const seconds = Math.floor(start / 1000);
  const minutes = Math.floor(seconds / 60);

  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.chat-container {
  margin: 0 0;
  width: 100dvw;
  border-radius: 5px;
}

.chat-message {
  margin-bottom: 1rem;
}

.speaker-A {
  background-color:  #f5f5f5;
  color: grey;
}

.speaker-B {
  background-color:  #f3f1f1;
  color: gray;
}

</style>
