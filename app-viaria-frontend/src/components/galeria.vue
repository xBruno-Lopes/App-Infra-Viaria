<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-md">
    <div v-if="dataStore.makerClasse !== null">
      <div><b>Classe:</b> {{ dataStore.makerClasse }}</div>
      <div><b>Data:</b> {{ dataStore.markeDate }}</div>
      <div><b>Endereço:</b> {{ dataStore.makerEndereco }}</div>
      <div>
        <b>Localização:</b> {{ dataStore.makerLocalizacao.lat }},
        {{ dataStore.makerLocalizacao.lng }}
      </div>
      <img
        spinner-color="white"
        style="height: 270px; max-width: 270px"
        alt=""
        :src="strapiApi + dataStore.makerImg"
      />
    </div>
    <div v-else>
      <div>Sem informações, por favor clique em um marcador!</div>
      <img
        spinner-color="white"
        style="height: 270px; max-width: 270px"
        alt=""
        :src="emptyData"
      />
    </div>
  </div>
</template>

<script>
import { useComponentStore } from "../stores/component-store";

import noImg from "../assets/no-img.jpg";
const strapiApi = "http://localhost:1337";

const dataStore = useComponentStore();
export default {
  setup() {
    const emptyData = noImg;
    return { emptyData, strapiApi, dataStore };
  },
};
</script>
