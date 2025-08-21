<template>
  <div class="container py-4">
    <!-- Breadcrumb -->
    <b-breadcrumb>
      <b-breadcrumb-item to="/">Inicio</b-breadcrumb-item>
      <b-breadcrumb-item active>Factura</b-breadcrumb-item>
    </b-breadcrumb>

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="text-light">Factura Análoga</h1>
      <b-button variant="success" pill> Generar Factura</b-button>
    </div>

    <!-- Datos principales -->
    <b-row>
      <!-- Selección de Cliente -->
      <b-col md="6">
        <b-card bg-variant="dark" text-variant="white" class="mb-3 shadow-sm rounded-3">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">Datos del Cliente</h4>
            <b-button variant="primary" pill size="sm" @click="abrirModalCliente">
              <i class="bi bi-person-plus"></i> Crear Cliente
            </b-button>
          </div>
          <b-form-group label="Seleccionar Cliente" label-for="cliente" label-class="text-white">
            <b-form-select 
              id="cliente" 
              v-model="clienteId" 
              :options="clientes" 
              value-field="id"
              text-field="razonSocial" 
              @change="handleClienteChange" 
            />
          </b-form-group>

            <b-card 
              v-if="clienteResultado" 
              bg-variant="secondary" 
              text-variant="white" 
              class="mt-3"
            >
              <b-card-text>
                <p class="mb-1"><b>Razón Social:</b> {{ clienteResultado.razonSocial }}</p>
                <p class="mb-1"><b>RTN:</b> {{ clienteResultado.rtn }}</p>
                <p class="mb-1"><b>Dirección:</b> {{ clienteResultado.direccion }}</p>
                <p class="mb-0"><b>Código Cliente:</b> {{ clienteResultado.codigoCliente }}</p>
              </b-card-text>
            </b-card>
        </b-card>
          </b-col>

      <!-- Datos de Factura -->
      <b-col md="6">
        <b-card bg-variant="dark" text-variant="white" class="mb-3 shadow-sm rounded-3">
          <h4 class="mb-3">Datos de la Factura</h4>

          <b-form-group label="Número Correlativo" label-for="numeroCorrelativo" label-class="text-white">
            <b-form-input id="numeroCorrelativo" placeholder="Ingrese los últimos 8 dígitos" />
            <small class="text-danger">Solo los últimos 8 dígitos del correlativo</small>
          </b-form-group>

          <b-form-group label="OC / PO Cliente" label-for="poCliente" label-class="text-white">
            <b-form-input id="poCliente" placeholder="Ingrese el OC / PO Cliente" />
          </b-form-group>

          <b-form-group label="Orden de Venta" label-for="ordenVenta" label-class="text-white">
            <b-form-input id="ordenVenta" placeholder="Ingrese la Orden de Venta" />
          </b-form-group>

          <b-row>
            <b-col md="6">
              <b-form-group label="Término de Venta" label-class="text-white">
                <b-form-select>
                  <option value="0">Crédito</option>
                  <option value="1">Contado</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group label="Término de Pago" label-class="text-white">
                <b-form-input placeholder="Ingrese el Término de Pago" />
              </b-form-group>
            </b-col>
          </b-row>

          <b-form-group label="Fecha de Emisión" label-for="fechaEmision" label-class="text-white">
            <b-form-input type="date" id="fechaEmision" />
          </b-form-group>
        </b-card>
      </b-col>
    </b-row>

    <!-- Detalle de Productos -->
    <b-card bg-variant="dark" text-variant="white" class="shadow-sm rounded-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">Detalle de Factura</h4>
            <b-button variant="outline-warning" pill size="sm" @click="abrirModalProducto">
              <i class="bi bi-cart-plus"></i> Agregar Producto
            </b-button>
          </div>
      <b-table :items="items" :fields="fields" bordered hover small head-variant="light" class="mb-0" />
    </b-card>
    <b-card   class="p-2 ms-auto" style="width: fit-content; min-width: 250px;">
      <b-row>
        <b-col>
         <table class="table table-sm table-bordered mb-0" style="width: auto;">
            <tr>
              <td><b>IMPORTE EXONERADO: </b></td>
              <td>L. {{ exoneradoTotal }}</td>
            </tr>
            <tr>
              <td><b>IMPORTE EXENTO: </b></td>
              <td>L. {{ exentoTotal }}</td>
            </tr>
            <tr>
              <td><b>IMPORTE GRAVADO 15%: </b></td>
              <td>L. {{ gravado15Total }}</td>
            </tr>
            <tr>
              <td><b>IMPORTE GRAVADO 18%: </b></td>
              <td>L. {{ gravado18Total }}</td>
            </tr>
            <tr>
              <td><b>0% ISV: </b></td>
              <td>L. 0.00</td>
            </tr>
            <tr>
              <td><b>15% ISV: </b></td>
              <td>L. {{ isv15Total }}</td>
            </tr>
            <tr>
              <td><b>18% ISV: </b> </td>
              <td>L. {{ isv18Total }}</td>
            </tr>
            <tr>
              <td><b>TRANSPORTE: </b> </td>
              <td>L. {{ transporteTotal }}</td>
            </tr>
            <tr>
              <td><b><h2>TOTAL: </h2> </b></td>
              <td><b><h2>L. {{ totalFactura }}</h2> </b></td>
            </tr>
          </table>
        </b-col>
    </b-row>
    </b-card>
  </div>
  <b-modal v-model="showModalCliente" title="Agregar Cliente" hide-footer> <b-form @submit.prevent="guardarCliente">
      <b-form-group label="Razón Social:" label-for="razonSocial">
        <b-form-input id="razonSocial" v-model="clienteModel.razonSocial"></b-form-input>
      </b-form-group>
      <b-form-group label="RTN::" label-for="rtn">
        <b-form-input id="rtn" v-model="clienteModel.rtn"></b-form-input>
      </b-form-group>
      <b-form-group label="Codigo Cliente:" label-for="codigoCliente">
        <b-form-input id="codigoCliente" v-model="clienteModel.codigoCliente"></b-form-input>
      </b-form-group>
      <b-form-group label="Dirección:" label-for="direccion">
        <b-form-input id="direccion" v-model="clienteModel.direccion"></b-form-input>
      </b-form-group>
      <br>
      <b-button type="submit" variant="primary">Guardar</b-button>
    </b-form>
  </b-modal>

  <b-modal v-model="showModalProducto" title="Agregar Producto al detalle" hide-footer>
    <b-form @submit.prevent="guardarProducto">
      <b-form-group label="Cantidad:" label-for="cantidad">
        <b-form-input id="cantidad" v-model="detalleFacturaModel.cantidad"></b-form-input>
      </b-form-group>
      <b-form-group label="Codigo:" label-for="codigo">
        <b-form-input id="codigo" v-model="detalleFacturaModel.codigo"></b-form-input>
      </b-form-group>
      <b-form-group label="Descripcion:" label-for="descripcion">
        <b-form-input id="descripcion" v-model="detalleFacturaModel.descripcion"></b-form-input>
      </b-form-group>
      <b-form-group label="Precio Unitario:" label-for="precioUnitario">
        <b-form-input id="precioUnitario" v-model="detalleFacturaModel.precioUnitario"></b-form-input>
      </b-form-group>
      <b-form-group label="Esquema de Impuesto:" label-for="esquemaImpuesto">
        <b-form-select id="esquemaImpuesto" v-model="detalleFacturaModel.esquemaImpuesto">
          <option value="isv15">ISV 15%</option>
          <option value="isv18">ISV 18%</option>
          <option value="exento">Exento</option>
          <option value="exonerado">Exonerado</option>
        </b-form-select>
      </b-form-group>
        <b-form-group label="Descuento:" label-for="descuento">
         <b-form-input id="descuento" v-model="detalleFacturaModel.descuento"></b-form-input>
      </b-form-group>
      <br>
      <b-button type="submit" variant="primary">Guardar</b-button>
    </b-form>
  </b-modal>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'


const clienteId = ref(null)
const clientes = ref([])
const clienteResultado = ref(null)
const clienteModel = ref({
  razonSocial: '',
  rtn: '',
  direccion: '',
  codigoCliente: ''
})



const detalleFacturaModel = ref({
  codigo: '',
  descripcion: '',
  precioUnitario: 0,
  cantidad: 0,
  descuento: 0,
  importe: 0,
  esquemaImpuesto: 'isv15'
})





const showModalCliente = ref(false)
const showModalProducto = ref(false)


const fields = ['Cantidad', 'Codigo del Articulo', 'Descripcion', 'Precio Unitario', 'Descuento','ISV', 'Importe Neto']

const items = ref([])

function handleClienteChange() {
  clienteResultado.value = clientes.value.find(
    (e) => e.id === clienteId.value
  )
}

async function getClientes() {
  const response = await window.api.getAllCliente()
  if (Array.isArray(response)) {
    clientes.value = response.map((e) => ({
      id: e.dataValues.id,
      razonSocial: e.dataValues.razonSocial,
      rtn: e.dataValues.rtn,
      direccion: e.dataValues.direccion,
      codigoCliente: e.dataValues.codigoCliente
    }))
  }
}

const importeExonerado = ref([]) 
const importeExento = ref([])
const importeGravado15 = ref([])
const importeGravado18 = ref([])

const exoneradoTotal = computed(() => sumaArrayImpuestos(importeExonerado.value).toFixed(2))
const exentoTotal    = computed(() => sumaArrayImpuestos(importeExento.value).toFixed(2))
const gravado15Total = computed(() => sumaArrayImpuestos(importeGravado15.value).toFixed(2))
const gravado18Total = computed(() => sumaArrayImpuestos(importeGravado18.value).toFixed(2))

const isv15Total = computed(() => (gravado15Total.value * 0.15).toFixed(2))
const isv18Total = computed(() => (gravado18Total.value * 0.18).toFixed(2))
const isvExoneradoTotal = computed(() => (exoneradoTotal.value * 0).toFixed(2))
const isvExentoTotal = computed(() => (exentoTotal.value * 0).toFixed(2))
const transporteTotal = computed(() => (0).toFixed(2))

const totalFactura = computed(() => {
  return (
    parseFloat(exoneradoTotal.value) +
    parseFloat(exentoTotal.value) +
    parseFloat(gravado15Total.value) +
    parseFloat(gravado18Total.value) +
    parseFloat(isv15Total.value) +
    parseFloat(isv18Total.value) +
    parseFloat(isvExoneradoTotal.value) +
    parseFloat(isvExentoTotal.value) +
    parseFloat(transporteTotal.value)
  ).toFixed(2)
})

async function guardarProducto() {
  const cantidad = parseFloat(detalleFacturaModel.value.cantidad) || 0
  const codigo = detalleFacturaModel.value.codigo || ''
  const descripcion = detalleFacturaModel.value.descripcion || ''
  const precioUnitario = parseFloat(detalleFacturaModel.value.precioUnitario) || 0
  const descuento = parseFloat(detalleFacturaModel.value.descuento) || 0

  const descuentoTotal = parseFloat((cantidad * descuento).toFixed(2))
  const importeBruto = parseFloat((cantidad * precioUnitario).toFixed(2))
  const importeNeto = parseFloat((importeBruto - descuentoTotal).toFixed(2))
  const isv = importeNeto * esquemaImpuestoSeleccionado(detalleFacturaModel.value.esquemaImpuesto)

  //CALCULA EL TOTAL DE LOS IMPORTES POR CADA ESQUEMA DE IMPUESTO
  calcularImportesTotales(importeNeto, detalleFacturaModel.value.esquemaImpuesto)


  items.value.push({
    Cantidad: cantidad,
    'Codigo del Articulo': codigo,
    Descripcion: descripcion,
    'Precio Unitario': precioUnitario,
    Descuento: descuento,
    'Descuento Total': descuentoTotal,
    'Importe Bruto': importeBruto,
    'Importe Neto': importeNeto,
    'ISV': (isv).toFixed(2),
  })
}

function esquemaImpuestoSeleccionado(isv) {
  if (isv === 'isv15') {
    return 0.15
  } else if (isv === 'isv18') {
    return 0.18
  } else {
    return 0
  }
}

function calcularImportesTotales(importeNeto,esquemaImpSelected){
  if (esquemaImpSelected === 'exonerado') {
    importeExonerado.value.push(importeNeto)
  } else if (esquemaImpSelected === 'exento') {
    importeExento.value.push(importeNeto)
  } else if (esquemaImpSelected === 'isv15') {
    importeGravado15.value.push((importeNeto))
  } else if (esquemaImpSelected === 'isv18') {
    importeGravado18.value.push(importeNeto)
  }
}

function sumaArrayImpuestos(arr) {
  return arr.reduce((acc, val) => acc + parseFloat(val || 0), 0)
}




function abrirModalCliente() {
  limpiarModalCliente()
  showModalCliente.value = true
}

function abrirModalProducto() {
  limpiarModalProducto()
  showModalProducto.value = true
}


function limpiarModalProducto() {

  detalleFacturaModel.value = {
    codigo: '',
    descripcion: '',
    precioUnitario: '',
    cantidad: 0,
    descuento: 0,
    importe: 0,
    esquemaImpuesto: ''
  }
}


function limpiarModalCliente() {
  clienteModel.value = {
    razonSocial: '',
    rtn: '',
    direccion: '',
    codigoCliente: ''
  }
}

function validarInputsCliente() {
  if (!clienteModel.value.rtn || !clienteModel.value.razonSocial || !clienteModel.value.direccion || !clienteModel.value.codigoCliente) {
    Swal.fire('Error', 'Por favor completa todos los campos obligatorios', 'error')
    return false
  }
  return true
}

async function guardarCliente() {
  if (!validarInputsCliente()) return

    let response = await window.api.createCliente({
      rtn: clienteModel.value.rtn,
      razonSocial: clienteModel.value.razonSocial,
      direccion: clienteModel.value.direccion,
      codigoCliente: clienteModel.value.codigoCliente
    })

  console.log('Respuesta del backend:', response)

  if (response.success) {
    Swal.fire('Éxito', response.message, 'success')
    showModalCliente.value = false
    limpiarModalCliente()
    await getClientes()
  } else {
    Swal.fire('Error', response.message, 'error')
  }
}






onMounted(() => {
  getClientes()
})
</script>

<style scoped>
h1, h3, h4 {
  font-weight: bold;
}
</style>
