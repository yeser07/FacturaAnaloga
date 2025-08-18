<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

// Datos de la tabla
const registros = ref([])

// Modal y formulario
const showModal = ref(false)
const form = ref({
  cai: '',
  fechaLimiteEmision: '',
  rangoAutorizado: '',
  estado: 'activo'
})
const editId = ref(null)

// Cargar registros desde SQLite
async function cargar() {
  const resultados = await window.api.getAllDataRegimen()
  registros.value = resultados.map(r => {
    const item = r.dataValues
    return {
      ...item,
      fechaLimiteEmision: item.fechaLimiteEmision
      ? item.fechaLimiteEmision.toISOString().slice(0, 10)
      : null
    }

  })
}

// Limpiar formulario y cerrar modal
function limpiarFormulario() {
  form.value = {
    cai: '',
    fechaLimiteEmision: '',
    rangoAutorizado: '',
    folioInicial: '',
    folioFinal: '',
  }
  editId.value = null
}

// Abrir modal para agregar nuevo
function abrirAgregar() {
  limpiarFormulario()
  showModal.value = true
}

// Abrir modal para editar
function abrirEditar(registro) {
  form.value = { ...registro }
  form.value.fechaLimiteEmision = form.value.fechaLimiteEmision?.slice(0, 10)
  editId.value = registro.id
  showModal.value = true
}

// Guardar cambios (agregar o actualizar)
async function guardar() {
  if (!validarInputs()) return
  let response

  if (editId.value) {
      response = await window.api.updateDataRegimen(editId.value, { ...form.value })
  } else {
    response = await window.api.createDataRegimen({ ...form.value })
  }

  if (response.success === true) {
    Swal.fire('Éxito', response.message, 'success')
    showModal.value = false
    limpiarFormulario()
    await cargar()
  }else {
    Swal.fire('Error', response.message, 'error')
  }
}

// Eliminar registro
async function eliminar(id) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás deshacer esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (!result.isConfirmed) return
  const response = await window.api.deleteDataRegimen(id)
  if (response.success) {
    Swal.fire('Eliminado', response.message, 'success')
  } else {
    Swal.fire('Error', response.message, 'error')
  }
  if (!response) {
    Swal.fire('Error', 'Registro no encontrado', 'error')
    return
  } 
  await cargar()
}

function validarInputs() {
  if (!form.value.cai || !form.value.fechaLimiteEmision || !form.value.rangoAutorizado || !form.value.folioInicial || !form.value.folioFinal) {
    Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error')
    return false
  }
  if (form.value.fechaLimiteEmision < new Date().toISOString().slice(0, 10)) {
    Swal.fire('Error', 'La fecha límite de emisión no puede ser anterior a la fecha actual', 'error')
    return false
  }
  if (form.value.folioInicial >= form.value.folioFinal) {
    Swal.fire('Error', 'El folio inicial debe ser menor que el folio final', 'error')
    return false
  }
  return true
}


onMounted(cargar)
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="breadcrumb">
          <b-breadcrumb-item to="/">Inicio</b-breadcrumb-item>
          <b-breadcrumb-item active>Régimen de Facturación</b-breadcrumb-item>
        </div>
      <h2 class="text-center" style="font-size: 24px; font-weight: bold; color: white;">Gestión de Régimen de Facturación</h2>
      <b-button variant="primary" @click="abrirAgregar">Agregar Nuevo</b-button>
    </div>
    <div class="mb-3">
      <h2 class="text-center" style="font-size: 18px; font-weight: bold; color: white;">En esta tabla se detallan todos los requisitos que solicita el regimen de facturación</h2>
      <h2 class="text-left" style="font-size: 18px; font-weight: bold; color: white;">Ejemplos de como documentar los datos:</h2>
      <span style="font-size: 15px; color: white;">CAI: 2423D6-18EBC4-18D8E0-63BE03-09090A-23</span><br>
      <span style="font-size: 15px; color: white;">RANGO AUTORIZADO: 000-001-01-00052001 A LA 000-001-01-00055000</span><br>
      <span style="font-size: 15px; color: white;">FOLIO INICIAL Y FINAL: 00052001 A LA 00055000</span><br>
      <span style="font-size: 15px; color: white;">FECHA LIMITE DE EMISION: 10 DE OCTUBRE DEL 2025</span><br>
    </div>

    <!-- Tabla -->
    <b-table striped hover bordered :items="registros" :fields="['cai', 'fechaLimiteEmision', 'rangoAutorizado','folioInicial','folioFinal', 'estado', 'acciones']" variant=dark  responsive="md">
      <template #cell(fechaLimiteEmision)="data">
        {{ data.item.fechaLimiteEmision}}
      </template>

      <template #cell(acciones)="data">
        <b-button size="sm" variant="warning" @click="abrirEditar(data.item)"><span class="bi bi-pencil"></span></b-button>
        <b-button size="sm" variant="danger" class="ms-2" @click="eliminar(data.item.id)"><span class="bi bi-trash"></span></b-button>
      </template>

      <template #empty>
        <div class="text-center py-3">No hay registros</div>
      </template>
    </b-table>

    <!-- Modal -->
    <b-modal v-model="showModal" title="Régimen de Facturación" @ok="guardar">
      <b-form @submit.prevent="guardar">
        <b-form-group label="CAI" class="mb-3">
          <b-form-input v-model="form.cai" placeholder="CAI" required />
        </b-form-group>

        <b-form-group label="Fecha Límite Emisión" class="mb-3">
          <b-form-input type="date" v-model="form.fechaLimiteEmision" required />
        </b-form-group>

        <b-form-group label="Rango Autorizado" class="mb-3">
          <b-form-input v-model="form.rangoAutorizado" placeholder="Rango Autorizado" required />
        </b-form-group>
        <b-form-group label="Folio Inicial" class="mb-3">
          <b-form-input v-model="form.folioInicial" placeholder="Folio Inicial" />
        </b-form-group>
        <b-form-group label="Folio Final" class="mb-3">
          <b-form-input v-model="form.folioFinal" placeholder="Folio Final" />
        </b-form-group>
        <div v-if="form.id">
          <b-form-group label="Estado" class="mb-3">
            <b-form-select v-model="form.estado">
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </b-form-select>
          </b-form-group>
        </div>

      </b-form>
    </b-modal>
  </div>
</template>
<style>


</style>