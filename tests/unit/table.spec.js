import { shallowMount, createLocalVue } from "@vue/test-utils";
import DataTable from "@/components/DataTable.vue";
import Vuex from "vuex";
import Buefy from "buefy";

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(Buefy);

describe("DataTable.vue", () => {
  let store;
  let props;

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
              id: 1,
              plate: "0000LBN"
            },
            {
              id: 2,
              plate: "0000AAA"
            }
          ]
        },
        items_page: 2
      }
    });
    props = {
      data_rows: store.state.data.rows,
      headers: store.state.data.columns,
      per_page: store.state.items_page
    };
  });

  it("Montar componente con datos del store", () => {
    const wrapper = shallowMount(DataTable, {
      store,
      localVue,
      propsData: props
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.props("per_page")).toBe(2);
  });

  it("Comprobar si la tabla de datos se ha renderizado OK", () => {
    const wrapper = shallowMount(DataTable, {
      store,
      localVue,
      propsData: props
    });
    const tableItem = wrapper
      .findAllComponents({
        name: "b-tab-item"
      })
      .at(0);
    expect(tableItem.exists()).toBeTruthy();
    const tableItems = wrapper.findAllComponents({ name: "b-tab-item" });
    expect(tableItems).toHaveLength(2);
    expect(wrapper.find(".container table#datos").exists()).toBe(true);
    expect(wrapper.find(".container table#seleccionados").exists()).toBe(true);
  });
});
