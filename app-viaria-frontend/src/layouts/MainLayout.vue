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

        <q-toolbar-title> App Infra Viária </q-toolbar-title>
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
        <q-expansion-item expand-separator icon="filter_alt" label="Filtros">
          <q-expansion-item
            :header-inset-level="1"
            :content-inset-level="1"
            expand-separator
            label="Cidades/CE"
          >
            <div class="row q-pa-md">
              <div>
                <span>Cidade: </span>
                <q-select
                  class="selectSize q-mt-sm"
                  dense
                  outlined
                  v-model="state.cidade"
                  :options="cidadesOptions"
                />
              </div>
              <div v-if="state.cidade === 'Banabuiú'" class="q-mt-sm">
                <span>CE: </span>
                <q-select
                  class="selectSize q-mt-sm"
                  dense
                  outlined
                  v-model="drawer.ceBanabuiu"
                  :options="ceBanabuiuOptions"
                />
              </div>
              <div v-if="state.cidade === 'Quixadá'" class="q-mt-sm">
                <span>CE: </span>
                <q-select
                  class="selectSize q-mt-sm"
                  dense
                  outlined
                  v-model="drawer.ceQuixada"
                  :options="ceQuixadaOptions"
                />
              </div>
              <div v-if="state.cidade === 'Fortaleza'" class="q-mt-sm">
                <span>CE: </span>
                <q-select
                  class="selectSize q-mt-sm"
                  dense
                  outlined
                  v-model="drawer.ceFortaleza"
                  :options="ceFortalezaOptions"
                />
              </div>
            </div>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            label="Defeitos"
            :header-inset-level="1"
            :content-inset-level="1"
          >
            <div class="row q-pa-md">
              <span>Defeitos: </span>
              <q-select
                class="selectSize q-mt-sm"
                dense
                outlined
                v-model="state.defeitos"
                :options="defeitosOptions"
              />
              <q-btn color="primary" push no-caps class="q-mt-sm">
                Buscar
              </q-btn>
            </div>
          </q-expansion-item>
        </q-expansion-item>
        <q-expansion-item
          expand-separator
          icon="location_on"
          label="Informações"
          caption="Informações sobre o marcador"
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
      defeitos: null,
      cidade: null,
    });
    const cidadesOptions = ["Banabuiú", "Quixadá", "Fortaleza"];

    const defeitosOptions = ["Crack", "Patch"];

    const ceBanabuiuOptions = ["CE-368", "CE-266"];

    const ceQuixadaOptions = ["CE-060", "CE-265"];

    const ceFortalezaOptions = ["CE-025", "CE-040"];

    return {
      drawer,
      state,
      cidadesOptions,
      defeitosOptions,
      ceBanabuiuOptions,
      ceQuixadaOptions,
      ceFortalezaOptions,
    };
  },
});
</script>

<style scoped>
.selectSize {
  width: 220px;
}
</style>
