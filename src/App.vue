<template>
  <div>
    <router-view />

    <!-- Buscador flotante -->
    <div v-if="showSearch" class="search-box card shadow-sm border-primary">
      <div class="card-body d-flex align-items-center gap-2">
        <!-- Input -->
        <input
          v-model="query"
          @keyup.enter="buscar"
          class="form-control"
          placeholder="Buscar en la página..."
          autofocus
        />

        <!-- Botones -->
        <button class="btn btn-primary btn-sm" @click="buscar">
          <i class="bi bi-search"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="anterior" title="Anterior">
          <i class="bi bi-arrow-up"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm" @click="siguiente" title="Siguiente">
          <i class="bi bi-arrow-down"></i>
        </button>
        <button class="btn btn-danger btn-sm" @click="cerrar" title="Cerrar">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const showSearch = ref(false)
const query = ref('')

onMounted(() => {
  window.api.onBuscar(() => {
    showSearch.value = true
  })
})

const buscar = () => {
  if (query.value) {
    window.api.buscarEnPagina(query.value)
  }
}

const siguiente = () => {
  if (query.value) {
    window.api.buscarSiguiente(query.value)
  }
}

const anterior = () => {
  if (query.value) {
    window.api.buscarAnterior(query.value)
  }
}

const cerrar = () => {
  showSearch.value = false
  query.value = ''
  window.api.detenerBusqueda()
}
</script>

<style scoped>
.search-box {
  position: fixed;
  top: 15px;
  right: 20px;
  width: 350px;
  z-index: 1050;
  border-radius: 0.5rem;
}
</style>
