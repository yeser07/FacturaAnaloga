import { createRouter, createWebHashHistory } from 'vue-router'

// Importa tus componentes

import Home from '../componentes/Home.vue'
import DataRegimenFacturacion from '../componentes/DataRegimenFacturacion.vue'
import Empresa from '../componentes/Empresa.vue'
import Factura from '../componentes/Factura.vue'

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
    },
    {
      path: '/empresa',
      name: 'Empresa',
      component: Empresa
    },
    {
      path: '/crear-factura',
      name: 'CrearFactura',
      component: Factura
    }
]

const router = createRouter({
  history: createWebHashHistory(), // Hash es recomendable para Electron
  routes
})

export default router
