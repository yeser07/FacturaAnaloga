import { createRouter, createWebHashHistory } from 'vue-router'

// Importa tus componentes

import Home from '../componentes/Home.vue'
import DataRegimenFacturacion from '../componentes/DataRegimenFacturacion.vue'

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/data-regimen-facturacion',
      name: 'DataRegimenFacturacion',
      component: DataRegimenFacturacion
    }
]

const router = createRouter({
  history: createWebHashHistory(), // Hash es recomendable para Electron
  routes
})

export default router
