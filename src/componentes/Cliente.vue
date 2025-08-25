<template>
  <div class="cliente-crud container mt-4">
        <!-- Breadcrumb -->
    <b-breadcrumb>
      <b-breadcrumb-item to="/">Inicio</b-breadcrumb-item>
      <b-breadcrumb-item active>Clientes</b-breadcrumb-item>
    </b-breadcrumb>
    <h2 class="text-center" style="color: white;">Gestión de Clientes</h2>
    <b-form @submit.prevent="guardarCliente">
      <b-row>
        <b-col md="6" class="mb-2">
          <b-form-group label="Razón Social:" label-for="razonSocial">
            <b-form-input id="razonSocial" v-model="cliente.razonSocial"/>
          </b-form-group>
        </b-col>
        <b-col md="6" class="mb-2">
          <b-form-group label="RTN:" label-for="rtn">
            <b-form-input id="rtn" v-model="cliente.rtn" />
          </b-form-group>
        </b-col>
        <b-col md="6" class="mb-2">
          <b-form-group label="Dirección:" label-for="direccion">
            <b-form-input id="direccion" v-model="cliente.direccion" />
          </b-form-group>
        </b-col>
        <b-col md="6" class="mb-2">
          <b-form-group label="Código Cliente:" label-for="codigoCliente">
            <b-form-input id="codigoCliente" v-model="cliente.codigoCliente" />
          </b-form-group>
        </b-col>
      </b-row>
        <b-button type="submit" variant="primary" class="me-2">
        <span v-if="cliente.id">
          <i class="bi bi-pencil me-1"></i> Actualizar
        </span>
        <span v-else>
          <i class="bi bi-plus-circle me-1"></i> Agregar
        </span>
      </b-button>
      <b-button type="button" variant="secondary" v-if="cliente.id" @click="cancelarEdicion">
        Cancelar
      </b-button>
    </b-form>

    <b-table
      striped
      hover
      :items="clientes"
      :fields="fields"
      class="mt-4"
      small
      bordered
      variant="dark"
      responsive
    >
<template #cell(acciones)="row">
  <b-button size="sm" variant="warning" class="me-2" @click="editarCliente(row.item)">
    <span class="bi bi-pencil"></span>
  </b-button>
  <b-button size="sm" variant="danger" @click="eliminarCliente(row.item.id)">
    <span class="bi bi-trash"></span>
  </b-button>
</template>

    </b-table>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  name: 'Cliente',
  data() {
    return {
      clientes: [],
      cliente: {
        id: null,
        razonSocial: '',
        rtn: '',
        direccion: '',
        codigoCliente: ''
      },
      fields: [
        { key: 'razonSocial', label: 'Razón Social' },
        { key: 'rtn', label: 'RTN' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'codigoCliente', label: 'Código Cliente' },
        { key: 'acciones', label: 'Acciones' }
      ]
    }
  },
  mounted() {
    this.cargarClientes()
  },
  methods: {
    async cargarClientes() {
      try {
        const response = await window.api.getAllCliente()
        this.clientes = Array.isArray(response)
          ? response.map(e => ({
              id: e.dataValues.id,
              razonSocial: e.dataValues.razonSocial,
              rtn: e.dataValues.rtn,
              direccion: e.dataValues.direccion,
              codigoCliente: e.dataValues.codigoCliente
            }))
          : []
      } catch (error) {
        Swal.fire('Error', 'No se pudieron cargar los clientes.', 'error')
      }
    },
    async guardarCliente() {
      try {
        if (!this.validarInputsCliente()) return

        if (this.cliente.id) {
          await window.api.updateCliente(this.cliente.id, {
            razonSocial: this.cliente.razonSocial,
            rtn: this.cliente.rtn,
            direccion: this.cliente.direccion,
            codigoCliente: this.cliente.codigoCliente
          })
          Swal.fire('Actualizado', 'Cliente actualizado correctamente.', 'success')
        } else {
          await window.api.createCliente({
            razonSocial: this.cliente.razonSocial,
            rtn: this.cliente.rtn,
            direccion: this.cliente.direccion,
            codigoCliente: this.cliente.codigoCliente
          })
          Swal.fire('Agregado', 'Cliente agregado correctamente.', 'success')
        }
        this.resetCliente()
        this.cargarClientes()
      } catch (error) {
        Swal.fire('Error', 'No se pudo guardar el cliente.', 'error')
      }
    },
    editarCliente(cliente) {
      this.cliente = { ...cliente }
    },
    async eliminarCliente(id) {
      try {
        await window.api.deleteCliente(id)
        if (this.cliente.id === id) {
          this.resetCliente()
        }
        Swal.fire('Eliminado', 'Cliente eliminado correctamente.', 'success')
        this.cargarClientes()
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el cliente.', 'error')
      }
    },
    cancelarEdicion() {
      this.resetCliente()
    },
    resetCliente() {
      this.cliente = { id: null, razonSocial: '', rtn: '', direccion: '', codigoCliente: '' }
    },

    validarInputsCliente() {
      if (!this.cliente.rtn || !this.cliente.razonSocial || !this.cliente.direccion || !this.cliente.codigoCliente) {
        Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error')
        return false
      }
      return true
    }
  }
}
</script>

<style scoped>
.cliente-crud {
  max-width: 900px;
  margin: auto;
}
</style>