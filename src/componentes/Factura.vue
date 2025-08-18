<template>
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1>Factura Análoga</h1>
            <div class="breadcrumb">
                <b-breadcrumb-item to="/">Inicio</b-breadcrumb-item>
                <b-breadcrumb-item active>Factura</b-breadcrumb-item>
            </div>
            <h3 class="text-center" style="font-size: 24px; font-weight: bold; color: white;">Selecciona los datos de facturación</h3>
            <b-button variant="primary">Agregar Nuevo</b-button>
        </div>
        <div class="row">
            <div class="col-md-6">
                <h3 class="text-center" style="font-size: 24px; font-weight: bold; color: white;">Empresa Facturadora</h3>
                <b-form-group label="Empresa Facturadora" label-for="empresa">
                <b-form-select
                    id="empresa"
                    v-model="empresaId"
                    :options="empresas"
                    value-field="id"
                    text-field="razonSocial"
                    class="mb-3"
                    @change="handleEmpresaChange" 
                />
                </b-form-group>
                <b-list-group class="mb-3" v-if="empresaSeleccionada">
                <b-list-group-item>Razón Social: {{ empresaSeleccionada.razonSocial }}</b-list-group-item>
                <b-list-group-item>Dirección: {{ empresaSeleccionada.direccion }}</b-list-group-item>
                <b-list-group-item>Teléfono: {{ empresaSeleccionada.telefono }}</b-list-group-item>
                <b-list-group-item>Correo: {{ empresaSeleccionada.correo }}</b-list-group-item>
                </b-list-group>
            </div>
            <div class="col-md-6">
                            <!-- DATA CIA -->
                <h3 class="text-center" style="font-size: 24px; font-weight: bold; color: white;">Datos de Facturación</h3>
                <br>
                <br>
                <b-list-group class="mb-3">
                    <b-list-group-item>CAI: {{ cai.cai }}</b-list-group-item>
                    <b-list-group-item>Rango Autorizado: {{ cai.rangoAutorizado }}</b-list-group-item>
                    <b-list-group-item>Fecha Limite Emision: {{ cai.fechaLimiteEmision }}</b-list-group-item>
                    <b-list-group-item>Folio Inicial: {{ cai.folioInicial }}</b-list-group-item>
                    <b-list-group-item>Folio Final: {{ cai.folioFinal }}</b-list-group-item>
                </b-list-group>
            </div>
        </div>

    </div>

</template>

<script setup>

import { ref, onMounted } from 'vue'


const cai = ref({})
const empresas = ref([])
const empresa = ref(null)
const empresaSeleccionada = ref(null)
const empresaId = ref(null)

async function getDataRegimenFacturacion() {
      const response = await window.api.getCaiActivo()
      if (response && response.dataValues) {
        cai.value = response.dataValues
    }
}

async function getEmpresas() {
  const response = await window.api.getAllEmpresa()
  if (Array.isArray(response)) {

    empresas.value =
     response.map((e) => ({
      id: e.dataValues.id,
      razonSocial: e.dataValues.razonSocial,
      direccion: e.dataValues.direccion,
      telefono: e.dataValues.telefono,
      correo: e.dataValues.correo
    }))
  }
}



function handleEmpresaChange() {
  empresaSeleccionada.value = empresas.value.find(
    (e) => e.id === empresaId.value
  )
}



onMounted(() => {
  getDataRegimenFacturacion()
  getEmpresas()
})

</script>
