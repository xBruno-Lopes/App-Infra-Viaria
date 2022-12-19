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

    <q-drawer v-model="drawer.leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu</q-item-label>
        <q-expansion-item expand-separator icon="filter_alt" label="Filtros">
          <div class="row q-pa-md">
            <div>
              <span>Cidade: </span>
              <q-select
                class="selectSize"
                dense
                outlined
                v-model="cidade"
                :options="cidadesOptions"
              />
            </div>
            <div v-if="cidade === 'Banabuiú'" class="q-mt-sm">
              <span>CE: </span>
              <q-select
                class="selectSize"
                dense
                outlined
                v-model="drawer.ceBanabuiu"
                :options="ceBanabuiuOptions"
              />
            </div>
            <div v-if="cidade === 'Quixadá'" class="q-mt-sm">
              <span>CE: </span>
              <q-select
                class="selectSize"
                dense
                outlined
                v-model="drawer.ceQuixada"
                :options="ceQuixadaOptions"
              />
            </div>
            <div v-if="cidade === 'Fortaleza'" class="q-mt-sm">
              <span>CE: </span>
              <q-select
                class="selectSize"
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
import { defineComponent, ref } from "vue";
import galeria from "../components/galeria.vue";
import { useComponentStore } from "../stores/component-store";

const drawer = useComponentStore();

export default defineComponent({
  name: "MainLayout",
  components: {
    galeria,
  },
  setup() {
    const cidade = ref(null);
    const cidadesOptions = ["Banabuiú", "Quixadá", "Fortaleza"];

    const ceBanabuiuOptions = ["CE-368", "CE-266"];

    const ceQuixadaOptions = ["CE-060", "CE-265"];

    const ceFortalezaOptions = ["CE-025", "CE-040"];

    return {
      drawer,
      cidade,
      cidadesOptions,
      ceBanabuiuOptions,
      ceQuixadaOptions,
      ceFortalezaOptions,
    };
  },
});
</script>

<style scoped>
.selectSize {
  width: 250px;
}
</style>
