<template>
  <q-page padding>
    <div class="row">
      <div>
        <q-input
          v-model="state.caminhoModel"
          hint="Caminho"
          readonly
          class="fieldSize"
        />
      </div>
      <div>
        <q-btn
          class="q-mt-lg q-ml-lg"
          no-caps
          push
          color="primary"
          icon="download"
          @click="buscarCaminho"
        >
          Importar
        </q-btn>
      </div>
    </div>
    <div>
      <q-table
        class="q-mt-sm"
        :rows="state.tableRowContent"
        :columns="state.tableColumContent"
        title="Histórico de Importações dos dados"
        separator="vertical"
        table-header-class="text-center"
      >
        <template v-slot:no-data>
          <q-item>
            <q-item-section class="text-grey"> Sem Resultados </q-item-section>
          </q-item>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup() {
    const state = reactive({
      caminhoModel: null,
      tableColumContent: [
        {
          name: "data",
          require: true,
          label: "Data da Importação",
          field: "data",
          align: "left",
          sortable: true,
        },
        {
          name: "periodo",
          label: "Periodo dos dados importados",
          field: "periodo",
          align: "center",
          sortable: true,
        },
      ],
      tableRowContent: [
        {
          data: "12/02/2022",
          periodo: "20/01/2022",
        },
        {
          data: "20/03/2022",
          periodo: "25/02/2022",
        },
        {
          data: "07/04/2022",
          periodo: "20/03/2022",
        },
        {
          data: "16/05/2022",
          periodo: "20/04/2022",
        },
        {
          data: "27/06/2022",
          periodo: "20/05/2022",
        },
        {
          data: "22/07/2022",
          periodo: "20/06/2022",
        },
        {
          data: "06/08/2022",
          periodo: "20/07/2022",
        },
        {
          data: "10/09/2022",
          periodo: "20/08/2022",
        },
        {
          data: "13/10/2022",
          periodo: "20/09/2022",
        },
        {
          data: "26/11/2022",
          periodo: "20/10/2022",
        },
      ],
    });

    async function buscarCaminho() {
      let dir = await window.showDirectoryPicker();
      state.caminhoModel = dir.name;
    }
    return { state, buscarCaminho };
  },
});
</script>
<style scoped>
.fieldSize {
  width: 280px;
  max-width: 700px;
}
</style>
