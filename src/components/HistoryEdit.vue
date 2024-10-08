<script setup lang="ts">
import Note from './Note.vue'
import NoteIcon from './NoteIcon.vue'

import { onMounted, onUnmounted, ref } from 'vue'
import historyManager, { type Sample } from '@/historyManager'

const emit = defineEmits(['switchSample'])
const activeDate = ref<string | null | undefined>(sessionStorage.getItem('currentHistoryDate'))
const history = ref<Sample[]>(historyManager.history)

function switchSample(date: string) : void {
  const newSample = historyManager.sampleGet(date)

  activeDate.value = date
  historyManager.activeDate = date
  if (newSample) emit('switchSample')
}

function removeSample(date: string) : void {
  const userIsremovingActiveSample = date == historyManager.activeDate

  historyManager.delete(date)

  if (!userIsremovingActiveSample)
    return

  activeDate.value = historyManager.activeDate
  emit('switchSample')
}

/* eslint-disable sort-keys */
const formatter = new Intl.DateTimeFormat('fr-FR', {
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})
/* eslint-enable sort-keys */

function sexyDate(strDate: string) {
  return formatter.format(new Date(strDate))
}

onMounted(() => {
  const updateHistory = (event: Event) => {
    const customEvent = event as CustomEvent
    history.value = [...customEvent.detail]
  }

  historyManager.addEventListener('update', updateHistory)
  onUnmounted(() => historyManager.removeEventListener('update', updateHistory))
})
</script>

<template>
  <div class="row char-width-30">
    <div class="row">
      <h3>Dates</h3>
      <hr>
      <ul class="item-list">
        <li v-for="sample in history" :key="sample.date" class="item py-2">
          <div class="d-flex justify-content-between container-fluid align-items-center">
            <span
              v-tooltip
              data-bs-placement="right"
              data-bs-title="Cliquer pour sélectionner"
              style="cursor: pointer"
              :class="{ active: activeDate === sample.date }"
              @click="() => switchSample(sample.date)"
            >
              {{ sexyDate(sample.date) }}
              <NoteIcon :text="sample.note" :unpaded="true" />
            </span>
            <div>
              <Note :item="sample" @update="note => historyManager.update(sample.date, { note })" />
              <img
                v-tooltip="{ disposeOnClick: true }"
                src="@/assets/icons/cross.png"
                alt="Supprimer"
                data-bs-title="Supprimer de l’historique"
                class="icon-container-small icon-hoverable ms-2"
                @click="() => removeSample(sample.date)"
              >
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.active {
  font-weight: bold;
  color: #000;
}
</style>