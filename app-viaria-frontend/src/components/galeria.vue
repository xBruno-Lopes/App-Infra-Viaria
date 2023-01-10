<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="q-pa-md">
    <div v-if="dataStore.markerClasse !== null">
      <div><b>Classe:</b> {{ traduzDefeito(dataStore.markerClasse) }}</div>
      <div><b>Data:</b> {{ formatarData(dataStore.markerDate) }}</div>
      <div><b>Endereço:</b> {{ dataStore.markerEndereco }}</div>
      <div>
        <b>Localização:</b> <br/> 
        Latitude: {{ dataStore.markerLocalizacao.lat }} <br/>
        Longitude: {{ dataStore.markerLocalizacao.lng }}
      </div>
      <img
        spinner-color="white"
        style="height: 270px; max-width: 300px; width:300px"
        alt=""
        :src="strapiApi + dataStore.markerImg"
      />
    </div>
    <div v-else>
      <div>Sem informações, por favor use o filtro!</div>
    </div>
  </div>
</template>

<script>
import { useComponentStore } from "../stores/component-store";
import { formatarData, traduzDefeito } from "src/util/util";

//import noImg from "../assets/no-img.jpg";
const strapiApi = "http://localhost:1337";

const dataStore = useComponentStore();
export default {
  setup() {
    //const emptyData = noImg;



    return { strapiApi, dataStore, formatarData, traduzDefeito };
  },
};
</script>
