<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer.ToolbarDrawerControl"
        />
        <q-toolbar-title @click="$router.push('/')">
          App Infra Viária
        </q-toolbar-title>
        <q-space></q-space>
        <q-tabs shrink stretch>
          <q-route-tab
            name="mapa"
            label="Mapa"
            to="/"
            exact
            @click="drawer.markerDrawerControl"
          />
          <q-route-tab
            name="tabelaDeDefeitos"
            label="Tabela de Defeitos"
            to="/tabela"
            exact
            @click="drawer.tabDrawerControl"
          />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer.leftDrawerOpen"
      show-if-above
      bordered
      :width="350"
    >
      <q-list>
        <q-item-label header> Menu</q-item-label>
        <q-expansion-item
          expand-separator
          icon="filter_alt"
          label="Filtros"
          default-opened
        >
          <q-expansion-item
            :header-inset-level="1"
            :content-inset-level="1"
            expand-separator
            label="Filtros de localização"
            default-opened
          >
            <div class="row q-pa-md">
              <div class="q-mt-sm">
                <span>Estado: </span>
                <q-select
                  class="selectSize q-mt-sm"
                  dense
                  outlined
                  v-model="drawer.estado"
                  :options="estadosOptions"
                />
              </div>

              <div class="q-mt-sm">
                <span>Rodovia: </span>
                <q-select
                  class="selectSize q-mt-sm"
                  dense
                  outlined
                  v-model="drawer.rodovia"
                  :options="ceOptions"
                />
              </div>
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Defeitos"
            :header-inset-level="1"
            :content-inset-level="1"
            default-opened
          >
            <div class="row q-pa-md">
              <span>Defeitos: </span>
              <q-select
                class="selectSize q-mt-sm"
                dense
                outlined
                v-model="drawer.defeito"
                :options="defeitosOptions"
              />
              <q-banner
                v-if="drawer.nenhumFiltroSelecionado"
                inline-actions
                dense
                rounded
                class="bg-orange q-mt-lg text-bold text-white"
              >
                Selecione pelo menos um filtro!
              </q-banner>
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Periodo"
            :header-inset-level="1"
            :content-inset-level="1"
            default-opened
          >
            <div class="row q-pa-md">
              <span>Periodo: </span>
              <q-date v-model="state.date"> </q-date>
            </div>
          </q-expansion-item>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="location_on"
          label="Informações"
          caption="Informações sobre o marcador"
          default-opened
        >
          <galeria></galeria>
        </q-expansion-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, reactive } from "vue";
import galeria from "../components/galeria.vue";
import { useComponentStore } from "../stores/component-store";

const drawer = useComponentStore();

export default defineComponent({
  name: "MainLayout",
  components: {
    galeria,
  },
  setup() {
    const state = reactive({
      cidade: null,
      date: null,
    });
    const estadosOptions = ["CE"];

    const defeitosOptions = ["Selecione", "Rachadura", "Remendo", "Panela"];

    const ceOptions = [
      "Selecione",
      "CE - 025",
      "CE - 040",
      "CE - 060",
      "CE - 187",
      "CE - 317",
      "CE - 321",
    ];
    const options = {
      "Aquiraz, CE": ["Selecione", "CE - 025", "CE - 040"],
      "Fortaleza, CE": ["Selecione", "CE - 025", "CE - 040", "CE - 060"],
      "Graça, CE": ["Selecione", "CE - 321"],
      "Ubajara, CE": ["Selecione", "CE - 317", "CE - 187"],
    };

    return {
      drawer,
      state,
      estadosOptions,
      defeitosOptions,
      options,
      ceOptions,
    };
  },
});
</script>

<style scoped>
.selectSize {
  width: 220px;
}
</style>
