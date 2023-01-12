<template>
  <q-page padding>
    <div class="row">
      <div>
        <span>Cidade: </span>
        <q-select
          class="selectSize q-mt-sm"
          dense
          outlined
          v-model="defeito"
          :options="defeitosOptions"
        >
        </q-select>
        <div>
          <q-btn class="q-mt-sm"> Buscar </q-btn>
        </div>
      </div>
    </div>
    <div>
      <q-table
        class="q-mt-sm"
        :rows="store.getContentTable"
        :columns="tableColumContent"
        title="Tabela de Defeitos"
        separator="vertical"
        table-header-class="text-center"
      >
        <template v-slot:no-data>
          <q-item>
            <q-item-section class="text-grey"> Sem Resultados </q-item-section>
          </q-item>
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <q-icon name="visibility" size="20px">
              <q-tooltip> Visualizar defeito no mapa </q-tooltip>
            </q-icon>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useComponentStore } from "../stores/component-store";
const store = useComponentStore();

export default defineComponent({
  setup() {
    const defeitosOptions = ["Rachadura", "Remendo", "Panela"];
    const defeito = ref(null);
    const tableColumContent = [
      {
        name: "endereco",
        require: true,
        label: "Endereço",
        field: "endereco",
        align: "left",
        sortable: true,
      },
      {
        name: "defeitos",
        label: "Defeitos",
        field: "defeitos",
        align: "center",
        sortable: true,
      },
      {
        name: "quantidade",
        label: "Quantidade por KM",
        field: "quantidade",
        align: "center",
        sortable: true,
      },
      {
        name: "acoes",
        label: "Ações",
        field: "acoes",
        align: "center",
        sortable: false,
      },
    ];
    function buscarCEporDefeitos() {
      store.filtrarPorClasse();
    }
    return {
      tableColumContent,
      store,
      defeitosOptions,
      defeito,
      buscarCEporDefeitos,
    };
  },
});
</script>

<style scoped>
.selectSize {
  width: 220px;
}
</style>
