import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: {
      columns: [
        {
          field: "id",
          label: "Id",
          format: "numeric",
          sortable: true
        },
        {
          field: "plate",
          label: "Plate",
          sortable: true
        },
        {
          field: "location",
          label: "Location",
          sortable: true,
          format: "location"
        },
        {
          field: "speed",
          label: "Speed",
          sortable: false,
          format: "speed",
          measure: "kmh",
          precision: 2
        },
        {
          field: "speed_average",
          label: "Speed Avg",
          sortable: false,
          format: "speed",
          measure: "mph",
          precision: 3
        },
        {
          field: "temperature_front",
          label: "Front Tmp.",
          sortable: true,
          format: "temperature",
          measure: "celsius"
        },
        {
          field: "temperature_back",
          label: "Back Tmp.",
          sortable: true,
          format: "temperature",
          measure: "fahrenheit"
        }
      ],
      rows: [
        {
          id: 1,
          plate: "0000LBN",
          location: {
            country: "Spain",
            city: "Valencia",
            postal_code: "46004",
            address: "Carrer de Colón"
          },
          speed: 25.56789,
          speed_average: 30.123456789,
          temperature_front: 19.5456789,
          temperature_back: 3.23456789
        },
        {
          id: 2,
          plate: "0000ABC",
          location: {
            country: "Spain",
            city: "Valencia",
            postal_code: "46004",
            address: "Carrer de Cadis"
          },
          speed: 25.56789,
          speed_average: 30.123456789,
          temperature_front: 19.5456789,
          temperature_back: 3.23456789
        },
        {
          id: 3,
          plate: "0001GBC",
          location: {
            country: "Spain",
            city: "Valencia",
            postal_code: "46004",
            address: "Carrer de Xátiva"
          },
          speed: 25.56789,
          speed_average: 30.123456789,
          temperature_front: 19.5456789,
          temperature_back: 3.23456789
        }
      ]
    },
    loading: true,
    items_page: 2
  },
  getters: {},
  mutations: {
    addNew: (state, newValue) => state.data.rows.push(newValue),
    changeLoading: (state, newValue) => (state.loading = newValue)
  },
  actions: {},
  modules: {}
});
