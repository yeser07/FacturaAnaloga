<template>
    <div class="container py-4">
        <div class="breadcrumb mb-3">
            <b-breadcrumb-item to="/">Inicio</b-breadcrumb-item>
            <b-breadcrumb-item active>Productos</b-breadcrumb-item>
        </div>

        <b-container fluid>
            <b-row class="align-items-center mb-3">
                <b-col>
                    <h2 class="mb-0">Productos</h2>
                </b-col>
                <b-col cols="auto">
                    <b-button variant="primary" @click="showModal = true">
                        <span class="bi bi-plus-circle mr-1"></span> Agregar Producto
                    </b-button>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-table :items="productos" :fields="fields" striped hover bordered small responsive variant="dark">
                        <template #cell(actions)="row">
                            <b-button size="sm" variant="warning" class="mr-2" @click="editProducto(row.item)">
                                <span class="bi bi-pencil"></span>
                            </b-button>
                            <b-button size="sm" variant="danger" @click="deleteProducto(row.item.id)">
                                <span class="bi bi-trash"></span>
                            </b-button>
                        </template>
                    </b-table>
                </b-col>
            </b-row>
        </b-container>

        <!-- Modal para crear/editar producto -->
        <b-modal 
          v-model="showModal" 
          :title="editMode ? 'Editar Producto' : 'Agregar Producto'" 
          @hide="resetForm" 
          hide-footer
        >
            <b-form @submit.prevent="saveProducto">
                <b-form-group label="Código" label-for="codigo" class="mb-3">
                    <b-form-input id="codigo" v-model="form.codigo" required></b-form-input>
                </b-form-group>
                <b-form-group label="Descripción" label-for="descripcion" class="mb-3">
                    <b-form-input id="descripcion" v-model="form.descripcion" required></b-form-input>
                </b-form-group>
                <b-form-group label="Precio" label-for="precio" class="mb-4">
                    <b-form-input id="precio" v-model="form.precio" type="number" step="0.01" required></b-form-input>
                </b-form-group>
                <div class="d-flex justify-content-end">
                    <b-button variant="secondary" class="mr-2" @click="showModal = false">
                        Cancelar
                    </b-button>
                    <b-button type="submit" variant="success">
                        {{ editMode ? 'Actualizar' : 'Crear' }}
                    </b-button>
                </div>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
    name: 'Producto',
    data() {
        return {
            productos: [],
            fields: [
                { key: 'codigo', label: 'Código' },
                { key: 'descripcion', label: 'Descripción' },
                { key: 'precio', label: 'Precio' },
                { key: 'actions', label: 'Acciones' }
            ],
            showModal: false,
            editMode: false,
            form: {
                id: null,
                codigo: '',
                descripcion: '',
                precio: ''
            }
        };
    },
    mounted() {
        this.fetchProductos();
    },
    methods: {
        async fetchProductos() {
            try {
                const response = await window.api.getAllProducto();
                this.productos = Array.isArray(response) ? response.map(e => e.dataValues) : [];
            } catch (error) {
                Swal.fire('Error', 'No se pudieron cargar los productos.', 'error');
            }
        },
        async saveProducto() {
            try {
                if (this.editMode) {
                    await window.api.updateProducto(this.form.id, {
                        codigo: this.form.codigo,
                        descripcion: this.form.descripcion,
                        precio: this.form.precio
                    });
                    Swal.fire('Actualizado', 'Producto actualizado correctamente.', 'success');
                } else {
                    await window.api.createProducto({
                        codigo: this.form.codigo,
                        descripcion: this.form.descripcion,
                        precio: this.form.precio
                    });
                    Swal.fire('Agregado', 'Producto agregado correctamente.', 'success');
                }
                this.showModal = false;
                this.fetchProductos();
                this.resetForm();
            } catch (error) {
                Swal.fire('Error', 'No se pudo guardar el producto. ' + error, 'error');
            }
        },
        editProducto(producto) {
            this.editMode = true;
            this.form = { ...producto };
            this.showModal = true;
        },
        async deleteProducto(id) {
            const result = await Swal.fire({
                title: '¿Está seguro de eliminar este producto?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            });
            if (result.isConfirmed) {
                try {
                    await window.api.deleteProducto(id);
                    Swal.fire('Eliminado', 'Producto eliminado correctamente.', 'success');
                    this.fetchProductos();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
                }
            }
        },
        resetForm() {
            this.editMode = false;
            this.form = {
                id: null,
                codigo: '',
                descripcion: '',
                precio: ''
            };
        }
    }
};
</script>

<style scoped>
.mr-2 {
    margin-right: 0.5rem;
}
</style>
