<script setup lang="ts">
import { RouterView } from 'vue-router'

import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import Notifications from '@/components/Notifications.vue'
</script>

<template>
  <Navbar />
  <Notifications />
  <main id="main" role="main">
    <RouterView />
  </main>
  <Footer />
</template>