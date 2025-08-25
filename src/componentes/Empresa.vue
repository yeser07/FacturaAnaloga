<template>
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="breadcrumb">
            <b-breadcrumb-item to="/">Inicio</b-breadcrumb-item>
            <b-breadcrumb-item active>Empresa</b-breadcrumb-item>
            </div>
            <h2 class="text-center" style="font-size: 24px; font-weight: bold; color: white;">Gestion de Empresas</h2>
            <b-button variant="primary" @click="abrirAgregar"><span class="bi bi-plus-circle mr-1"></span> Agregar</b-button>
        </div>
        <b-table striped hover bordered :items="registros" :fields="[ 'rtn','razonSocial', 'direccion', 'telefono', 'correo', 'acciones']" variant=dark  responsive="md">
            <template #cell(acciones)="data">
                <div class="d-flex align-items-center">
                    <b-button size="sm" variant="warning" class="me-2" @click="abrirEditar(data.item)">
                        <i class="bi bi-pencil"></i>
                    </b-button>
                    <b-button size="sm" variant="danger" @click="eliminar(data.item.id)">
                        <i class="bi bi-trash"></i>
                    </b-button>
                </div>
            </template>
            <template #empty>
                <div class="text-center py-3">No hay registros</div>
            </template>
        </b-table>

        <b-modal v-model="showModal" title="Agregar Empresa" hide-footer>
            <b-form @submit.prevent="guardar" enctype="multipart/form-data">
                <b-form-group label="RTN:" label-for="rtn">
                    <b-form-input id="rtn" v-model="form.rtn"></b-form-input>
                </b-form-group>
                <b-form-group label="Razón Social:" label-for="razonSocial">
                    <b-form-input id="razonSocial" v-model="form.razonSocial"></b-form-input>
                </b-form-group>
                <b-form-group label="Dirección:" label-for="direccion">
                    <b-form-input id="direccion" v-model="form.direccion"></b-form-input>
                </b-form-group>
                <b-form-group label="Telefono:" label-for="telefono">    
                    <b-form-input id="telefono" v-model="form.telefono"></b-form-input>
                </b-form-group>
                <b-form-group label="Correo:" label-for="correo">
                    <b-form-input id="correo" v-model="form.correo"></b-form-input>
                </b-form-group>
                <div v-if="!editId">
                    <b-form-group label="Logo:" label-for="logo">
                    <input
                        id="logo"
                        type="file"
                        class="form-control"
                        accept="image/*"
                        @change="onFileChange"
                    />
                    </b-form-group>
                </div>
                  
                    <hr>
                <b-button type="submit" variant="primary">Guardar</b-button>
            </b-form>
        </b-modal>

    </div>  
</template>

<script setup>

import { ref, onMounted } from 'vue'
import { BFormGroup } from 'bootstrap-vue-next'
import Swal from 'sweetalert2'

// Datos de la tabla
const registros = ref([])



// Modal y formulario
const showModal = ref(false)
const form = ref({
  rtn: '',
  razonSocial: '',
  direccion: '',
  telefono: '',
  correo: '',
  logo: null

})
const editId = ref(null)

// Cargar registros desde SQLite
async function cargar() {
  const resultados = await window.api.getAllEmpresa()
  
  registros.value = resultados.map(r => r.dataValues)
}

function onFileChange(event) {
  const file = event.target.files[0]
  const reader = new FileReader()
  reader.onload = () => {
    form.value.logo = reader.result // base64 string
  }
  reader.readAsDataURL(file)
}


function limpiarFormulario() {
  form.value = {
    rtn: '',
    razonSocial: '',
    direccion: '',
    telefono: '',
    correo: '',
    logo: null,
  }
  editId.value = null
}

function abrirAgregar() {
  limpiarFormulario()
  showModal.value = true
}

function validarInputs() {
  if (!form.value.rtn || !form.value.razonSocial || !form.value.direccion || !form.value.telefono || !form.value.correo) {
    Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error')
    return false
  }
  if (!form.value.logo) {
    Swal.fire('Error', 'Por favor selecciona un logo', 'error')
    return false
  }
  return true
}

async function guardar() {
  if (!validarInputs()) return

  let response

  if (editId.value) {
    response = await window.api.updateEmpresa(editId.value, {
      rtn: form.value.rtn,
      razonSocial: form.value.razonSocial,
      direccion: form.value.direccion,
      telefono: form.value.telefono,
      correo: form.value.correo,
      logo: form.value.logo
    })
  } else {
    response = await window.api.createEmpresa({
      rtn: form.value.rtn,
      razonSocial: form.value.razonSocial,
      direccion: form.value.direccion,
      telefono: form.value.telefono,
      correo: form.value.correo,
      logo: form.value.logo
    })
  }

  console.log('Respuesta del backend:', response)

  if (response.success) {
    Swal.fire('Éxito', response.message, 'success')
    showModal.value = false
    limpiarFormulario()
    await cargar()
  } else {
    Swal.fire('Error', response.message, 'error')
  }
}





async function eliminar(id ) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás deshacer esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })
  if (!result.isConfirmed) return
  const response = await window.api.deleteEmpresa(id)
  if (response.success) {
    Swal.fire('Eliminado', response.message, 'success')
    await cargar()
} else {
    Swal.fire('Error', response.message, 'error')
  }
  if (!response) {
    Swal.fire('Error', 'Registro no encontrado', 'error')
    return
  }
    
}

function abrirEditar(registro) {
   form.value = { ...registro }
  editId.value = registro.id
  showModal.value = true
}

onMounted(() => {
  cargar()
})



</script>