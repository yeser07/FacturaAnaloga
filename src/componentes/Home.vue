<template>
  <div class="menu-container d-flex flex-column justify-content-center align-items-center vh-100 bg-dark">
    <h2 class="text-white mb-5">Menú Principal</h2>
    <div class="d-flex flex-wrap justify-content-center gap-4">
      <b-button
        variant="primary"
        class="rounded-circle menu-btn d-flex flex-column justify-content-center align-items-center"
        @click="goTo('regimen')"
      >
        <i class="bi bi-file-text mb-2" style="font-size: 24px;"></i>
        Data Regimen
      </b-button>

        <b-button
          variant="danger"
          class="rounded-circle menu-btn d-flex flex-column justify-content-center align-items-center"
          @click="goTo('empresa')"
        >
          <i class="bi bi-building mb-2" style="font-size: 24px;"></i>
          Empresa
      </b-button>


      <b-button
        variant="success"
        class="rounded-circle menu-btn d-flex flex-column justify-content-center align-items-center"
        @click="goTo('factura')"
      >
        <i class="bi bi-receipt mb-2" style="font-size: 24px;"></i>
        Crear Factura
      </b-button>

      <b-button
        variant="warning"
        class="rounded-circle menu-btn d-flex flex-column justify-content-center align-items-center"
        @click="goTo('clientes')"
      >
        <i class="bi bi-people mb-2" style="font-size: 24px;"></i>
        Clientes
      </b-button>

      <b-button
        variant="info"
        class="rounded-circle menu-btn d-flex flex-column justify-content-center align-items-center"
        @click="goTo('productos')"
      >
        <i class="bi bi-box-seam mb-2" style="font-size: 24px;"></i>
        Productos
      </b-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (option) => {
  switch(option) {
    case 'regimen':
      router.push('/data-regimen-facturacion')
      break
    case 'factura':
      router.push('/crear-factura')
      break
    case 'clientes':
      router.push('/clientes')
      break
    case 'productos':
      router.push('/productos')
      break
    case 'empresa':
      router.push('/empresa')
      break
  }
}
</script>

<style scoped>
.menu-container {
  background-color: #000; /* Fondo negro */
}

.menu-btn {
  width: 120px;
  height: 120px;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  transition: transform 0.2s;
}

.menu-btn:hover {
  transform: scale(1.1);
}
</style>
