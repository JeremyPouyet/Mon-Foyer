<script setup lang="ts">
import Note from '@/components/Note.vue'
import NoteIcon from './NoteIcon.vue'

import type Account from '@/account'
import { TransactionType } from '@/types'

const props = defineProps<{ account: Account, name: string, withNote: boolean }>()
</script>

<template>
  <div class="d-flex justify-content-between">
    <div>
      <h3>
        {{ name }}
        <NoteIcon :text="props.account.note" :unpaded="true" />
        <Note v-if="props.withNote" :item="props.account" @update="note => account.note = note" />
      </h3>
    </div>
    <div class="d-flex">
      <div
        v-if="!account.settings.show[TransactionType.Expense]"
        v-tooltip="{ disposeOnClick: true }"
        data-bs-title="Aggrandir"
        class="text-container rounded-shadow icon-hoverable d-flex align-items-center p-2"
        :class="!account.settings.show[TransactionType.Income] ? 'me-3' : ''"
        @click="account.settings.show[TransactionType.Expense] = true"
      >
        Dépenses
        <img src="@/assets/icons/show.png" class="icon-container-small ms-2" alt="Aggrandir">
      </div>
      <div
        v-if="!account.settings.show[TransactionType.Income]"
        v-tooltip="{ disposeOnClick: true }"
        data-bs-title="Aggrandir"
        class="text-container rounded-shadow icon-hoverable d-flex align-items-center p-2"
        @click="account.settings.show[TransactionType.Income] = true"
      >
        Revenus
        <img src="@/assets/icons/show.png" class="icon-container-small ms-2" alt="Aggrandir">
      </div>
    </div>
  </div>
  <hr>
</template>

<style scope>
.text-container {
  height: 2.5rem;
}
</style>