<template>
  <q-page padding>
    <div class="row">
      <div>
        <span>Defeitos: </span>
        <q-select
          label="Selecione"
          class="selectSize q-mt-sm"
          dense
          outlined
          v-model="defeito"
          :options="defeitosOptions"
        >
        </q-select>
      </div>
      <div class="q-ml-lg">
        <span>Quantidade mínima por KM: </span>
        <q-select
          label="Selecione"
          class="selectSize q-mt-sm"
          dense
          outlined
          v-model="qtd"
          :options="qtdOptions"
        >
        </q-select>
      </div>
      <div class="q-pt-lg">
        <q-btn
          class="q-mt-sm q-ml-lg"
          push
          color="primary"
          @click="buscarCEporDefeitos(defeito)"
        >
          Buscar
        </q-btn>
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
            <q-icon
              name="map"
              size="20px"
              @click="visualizarDefeito(props.row)"
            >
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
import { useRouter } from "vue-router";
const store = useComponentStore();

export default defineComponent({
  setup() {
    const router = useRouter();
    const defeitosOptions = ["crack", "patche", "pothole"];
    const defeito = ref(null);
    const qtdOptions = [10, 20, 30, 40, 50];
    const qtd = ref(null);
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
    function buscarCEporDefeitos(defeito) {
      store.filtrarPorClasse(defeito);
    }
    function visualizarDefeito(dados) {
      store.dados.endereco = dados.endereco;
      store.dados.defeito = dados.defeitos;
      router.push("/");
    }
    return {
      tableColumContent,
      store,
      defeitosOptions,
      defeito,
      qtd,
      qtdOptions,
      buscarCEporDefeitos,
      visualizarDefeito,
    };
  },
});
</script>

<style scoped>
.selectSize {
  width: 220px;
}
</style>
