<template>
  <section>
    <section class="container">
      <b-button @click="resetData" type="is-danger">Reset seleccionados</b-button>
      <b-button style="margin-left:0.5rem" @click="addNew" type="is-info">Añadir</b-button>
    </section>
    <section class="container">
      <b-tabs>
        <!-- Tabla datos pasados por props y con paginador, solo se ordena el campo ID -->
        <b-tab-item label="Tabla">
          <table id="datos">
            <thead>
              <tr>
                <th>#</th>
                <th
                  @click="column.field === 'id' ? orderBy(column.field) : ''"
                  v-for="column in headers"
                  :class="{'clickable': column.field === 'id'}"
                  :key="column.field"
                >{{column.label}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dataPaginated" :key="row.id">
                <td>
                  <b-checkbox @input="showItem(row.id)" v-model="checked" :native-value="row"></b-checkbox>
                </td>
                <td v-for="key in Object.keys(row)" :key="key">{{ row[key] }}</td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <section>
            <b-button v-if="page !== 1" @click="changePage('prev')" size="is-medium">Anterior</b-button>
            <b-button
              v-if="page < total_pages"
              @click="changePage('next')"
              size="is-medium"
            >Siguiente</b-button>
          </section>
          <p>
            <b>Página actual: {{ page }}</b>
          </p>
          <p>
            <b>Nº total de páginas : {{ total_pages }}</b>
          </p>
        </b-tab-item>
        <!-- Tabla seleccionados -->
        <b-tab-item :label="'Seleccionados (' + checked.length + ')'">
          <table id="seleccionados">
            <thead>
              <tr>
                <th v-for="column in headers" :key="column.field">{{column.label}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in checked" :key="row.id">
                <td v-for="key in Object.keys(row)" :key="key">{{ row[key] }}</td>
              </tr>
            </tbody>
          </table>
        </b-tab-item>
      </b-tabs>
    </section>
  </section>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    data_rows: Array,
    headers: Array,
    isLoading: Boolean,
    per_page: Number
  },
  data: function() {
    return {
      checked: [],
      paginated: true,
      start: 0,
      end: this.$props.per_page,
      page: 1,
      orden: false, // Orden = false -> ascendente , Orden = true -> descendente
      copy: this.$store.state.data.rows // Variable copia de los datos originales
    };
  },
  computed: {
    dataPaginated(): Array<any> {
      // Cortamos el array , para hacer paginador
      return this.data_rows.slice(this.start, this.end);
    },
    total_pages(): number {
      return Math.ceil(this.data_rows.length / this.per_page);
    }
  },
  methods: {
    changePage: function(action: string) {
      /**
       * Funcion encargada de cambiar de pagina al paginador y mostrar datos
       */
      switch (action) {
        case "next":
          this.$data.page++;
          this.$data.start = this.$data.end;
          this.$data.end += this.$props.per_page;
          break;
        case "prev":
          this.$data.page--;
          this.$data.start -= this.$props.per_page;
          this.$data.end -= this.$props.per_page;
      }
    },
    addNew: function() {
      /*
        Función encargada de añadir una nueva fila copiando los datos del ultimo elemento del array
      */

      // Mostramos loading
      this.$store.commit("changeLoading", true);

      // Obtenemos todos los ids y vemos cual es el más alto
      let ids = this.$props.data_rows.map(
        (item: any): Array<number> => {
          return item.id;
        }
      );
      let highest = Math.max.apply(Math, ids);

      // Obtenemos el ultimo objeto del array para copiar sus datos
      let last = this.$store.state.data.rows[
        this.$store.state.data.rows.length - 1
      ];
      // Hacemos una copia
      let copiedItem = Object.assign({}, last);
      // Aumentamos el id mas alto encontrado para no tener ids duplicados
      copiedItem.id = highest + 1;
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
        this.$buefy.notification.open({
          message: "Añadida nueva fila con id :" + copiedItem.id,
          type: "is-success"
        });
      }, 800);
    },
    showItem: function(idSelected: number) {
      /*
        Funcion encargada de filtrar los datos del array para mostrar todos menos el seleccionado
      */
      this.$store.state.data.rows = this.$store.state.data.rows.filter(
        (item: any) => {
          return item["id"] !== idSelected;
        }
      );
    },
    resetData: function() {
      // Asignamos los valores iniciales
      this.$store.state.data.rows = this.$data.copy;
      this.$data.checked = [];
    },
    orderBy: function(field: string) {
      // Cambio de orden Asc (false) or desc (true)
      this.$data.orden = !this.$data.orden;
      this.$store.state.data.rows = this.$store.state.data.rows.sort(
        (a: any, b: any) => {
          return this.$data.orden === true ? b.id - a.id : a.id - b.id;
        }
      );
      let text = this.$data.orden === true ? "DESC" : "ASC";
      this.$buefy.notification.open({
        message: "Ordenado por " + field + " (" + text + ")",
        type: "is-primary"
      });
    }
  }
});
</script>

<style scoped>
.container {
  margin: 2rem;
  display: flex;
  justify-content: center;
}

.container table#datos th {
  border: 1px solid;
}

.clickable {
  cursor: pointer;
  background-color: rgba(144, 248, 131, 0.5);
}

.container table th,
.container table tr td {
  padding: 1rem;
}
</style>
