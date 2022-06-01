<template>
  <div id="app">
    <b-loading is-full-page v-model="$store.state.loading" :can-cancel="false"></b-loading>
    <DataTable
      v-show="!$store.state.loading"
      :isLoading="$store.state.loading"
      :data="rows"
      :headers="columns"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DataTable from "./components/DataTable.vue";

// New interface for Location
interface Location {
  country: string;
  city: string;
  postal_code: string;
  address: string;
}

export default Vue.extend({
  name: "App",
  components: {
    DataTable
  },
  computed: {
    columns(): Array<any> {
      return this.$store.state.data.columns;
    },
    rows(): Array<any> {
      return this.$store.state.data.rows;
    }
  },
  beforeMount: function() {
    // Formatear la localizacion antes de pasarla a la tabla
    for (let item of this.rows) {
      let itemLocation: Location = item["location"];
      item["location"] = this.formatAddress(item["location"]);
    }
  },
  mounted: function() {
    // Fake timeout para sensacion de carga de datos desde API
    setTimeout(() => {
      this.$store.commit("changeLoading", false);
    }, 800);
  },
  methods: {
    formatAddress: function name(params: Location) {
      /**
       * Funcion que devuelve un string
       */
      return `${params.address} - ${params.city} C.P: ${params.postal_code} (${
        params.country
      })`;
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
