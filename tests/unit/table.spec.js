import { shallowMount, createLocalVue } from "@vue/test-utils";
import DataTable from "@/components/DataTable.vue";
import Vuex from "vuex";
import Buefy from "buefy";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Buefy);

describe("DataTable.vue", () => {
  let store;

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        data: {
          columns: [
            {
              field: "id",
              label: "Id",
              format: "numeric",
              sortable: true
            }
          ],
          rows: [
            {
              id: 1
            },
            {
              id: 2
            }
          ]
        }
      }
    });
  });

  it("Montar componente con datos del store", () => {
    const wrapper = shallowMount(DataTable, { store, localVue });
    console.log(wrapper);
  });

  it("Comprobar si 2 tablas se han renderizado", () => {
    const wrapper = shallowMount(DataTable, { store, localVue });
    const table = wrapper.findAllComponents({ name: "b-table" }).at(0);
    expect(table.exists()).toBeTruthy();
    const tables = wrapper.findAllComponents({ name: "b-table" });
    expect(tables).toHaveLength(2);
  });
});
