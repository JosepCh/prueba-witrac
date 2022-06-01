<template>
  <section>
    <section>
      <b-switch style="margin-left:0.5rem" v-model="paginated">Paginador</b-switch>
      <b-button @click="resetData" type="is-danger">Reset table</b-button>
      <b-button style="margin-left:0.5rem" @click="addNew" type="is-info">Add new row</b-button>
    </section>
    <b-tabs>
      <b-tab-item label="Tabla">
        <!-- 
          Tabla con datos obtenidos del store, solo seran checkables si hay mas de 1 para no dejar la tabla vacia, datos paginados a 2 por pagina
        -->
        <b-table
          class="percentage-width"
          :columns="headers"
          @check="showItem"
          :checked-rows.sync="checked"
          :data="data"
          :checkable="$store.state.data.rows.length > 1"
          :paginated="paginated"
          :per-page="items_page"
          pagination-rounded
          :loading="isLoading"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
        ></b-table>
      </b-tab-item>
      <b-tab-item :label="'Seleccionados (' + checked.length + ')'">
        <b-table :columns="headers" :data="checked"></b-table>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    data: Array,
    headers: Array,
    isLoading: Boolean
  },
  data: function() {
    return {
      checked: [],
      paginated: true,
      items_page: 2,
      // Variable copia de los datos originales
      copy: this.$store.state.data.rows
    };
  },
  methods: {
    addNew: function() {
      /*
        Función encargada de añadir una nueva fila copiando los datos del ultimo elemento del array
      */

      // Mostramos loading
      this.$store.commit("changeLoading", true);
      // Obtenemos el ultimo objeto del array
      let last = this.$store.state.data.rows[
        this.$store.state.data.rows.length - 1
      ];
      // Hacemos una copia
      let copiedItem = Object.assign({}, last);
      // Aumentamos el id para no tener ids duplicados
      copiedItem.id++;
      // Generamos un string en mayusculas alfanumerico aleatorio de longitud 7
      copiedItem.plate = Math.random()
        .toString(36)
        .slice(2, 9)
        .toUpperCase();
      // Llamamos a la mutacion del store encargada de añadir una fila
      this.$store.commit("addNew", copiedItem);
      // Timeout para ver espiral de cargando antes de ocultarlo
      setTimeout(() => {
        this.$store.commit("changeLoading", false);
        // Mostramos notificacion informativa
        this.$buefy.notification.open(
          "Añadida nueva fila con id :" + copiedItem.id
        );
      }, 800);
    },
    showItem: function(list: Array<any>, row: any) {
      /*
        Funcion encargada de filtrar los datos del array para mostrar todos menos el seleccionado
      */
      this.$store.state.data.rows = this.$store.state.data.rows.filter(
        (item: any) => {
          return item["id"] !== row.id;
        }
      );
    },
    resetData: function() {
      // Asignamos los valores iniciales
      this.$store.state.data.rows = this.$data.copy;
      this.$data.checked = [];
    }
  }
});
</script>