<script setup lang="ts">
import UserNameEdit from '@/components/UserNameEdit.vue'

import { ref } from 'vue'
import User from '@/user'
import userManager from '@/userManager'

const username = ref<string>('')

function userCreate() : void {
  userManager.create(username.value)
  username.value = ''
}

function userDelete(user: User) : void {
  const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ? Cette action est irréversible.`)

  if (confirmation) userManager.delete(user)
}
</script>

<template>
  <div class="row char-width-30">
    <div class="row">
      <h3>Habitants</h3>
      <hr>
      <ul class="item-list">
        <li v-for="user in userManager.users" :key="user.id" class="item py-2">
          <div class="d-flex justify-content-between container-fluid align-items-center">
            <UserNameEdit :user="user" />
            <img
              v-tooltip="{ disposeOnClick: true }"
              src="@/assets/icons/cross.png"
              :alt="`Supprimer ${user.name} des habitants`"
              data-bs-title="Supprimer des habitants"
              class="icon-container-small icon-hoverable"
              @click="() => userDelete(user)"
            >
          </div>
        </li>
      </ul>
      <div class="input-group">
        <input
          v-model="username"
          type="text"
          placeholder="Prénom"
          class="form-control"
          @keydown.enter="userCreate"
        >
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          :disabled="!username"
          @click="userCreate"
        >
          Ajouter
        </button>
      </div>
    </div>
  </div>
</template>