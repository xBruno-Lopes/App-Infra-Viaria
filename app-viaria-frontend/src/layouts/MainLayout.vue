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
          @click="store.ToolbarDrawerControl"
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
            @click="store.markerDrawerControl"
          />
          <q-route-tab
            name="tabelaDeDefeitos"
            label="Tabela de Defeitos"
            to="/tabela"
            exact
            @click="store.tabDrawerControl(), closePopUpOnchangeTab()"
          />
          <q-route-tab
            name="importarDados"
            label="Importar Dados"
            to="/importarDados"
            exact
            @click="store.tabDrawerControl(), closePopUpOnchangeTab()"
          />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="store.leftDrawerOpen"
      show-if-above
      bordered
      :width="400"
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
                  v-model="store.estado"
                  :options="estadosOptions"
                />
              </div>

              <div class="q-mt-sm">
                <span>Rodovia: </span>
                <q-select
                  class="selectSize q-mt-sm"
                  dense
                  outlined
                  v-model="store.rodovia"
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
              <q-select
                class="selectSize"
                dense
                outlined
                v-model="store.defeito"
                :options="defeitosOptions"
              />
              <q-banner
                v-if="store.nenhumFiltroSelecionado"
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
              <q-input
                readonly
                class="dateInputSize q-mr-md"
                dense
                outlined
                v-model="store.periodoInicial"
                label="Inicial"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        mask="DD/MM/YYYY"
                        v-model="store.periodoInicial"
                        :title="
                          store.periodoInicial
                            ? store.periodoInicial
                            : 'Selecione uma data'
                        "
                        :subtitle="
                          store.periodoInicial
                            ? store.periodoInicial
                            : 'Nenhuma data selecionada'
                        "
                        :locale="pt_br"
                        :options="
                          (date) =>
                            store.periodoFinal
                              ? date >=
                                store.periodoFinal
                                  .split('/')
                                  .reverse()
                                  .join('/')
                              : true
                        "
                      >
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="row q-pa-md">
              <q-input
                readonly
                class="dateInputSize q-mr-md"
                dense
                outlined
                v-model="store.periodoFinal"
                label="Final"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        mask="DD/MM/YYYY"
                        v-model="store.periodoFinal"
                        :title="
                          store.periodoFinal
                            ? store.periodoFinal
                            : 'Selecione uma data'
                        "
                        :subtitle="
                          store.periodoFinal
                            ? store.periodoFinal
                            : 'Nenhuma data selecionada'
                        "
                        :locale="pt_br"
                        :options="
                          (date) =>
                            store.periodoInicial
                              ? date >=
                                store.periodoInicial
                                  .split('/')
                                  .reverse()
                                  .join('/')
                              : true
                        "
                      >
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
          <div class="q-pa-md">
            <div v-if="store.markerClasse !== null">
              <div><b>Classe:</b> {{ traduzDefeito(store.markerClasse) }}</div>
              <div><b>Data:</b> {{ formatarData(store.markerDate) }}</div>
              <div><b>Endereço:</b> {{ store.markerEndereco }}</div>
              <div>
                <b>Localização:</b> <br />
                Latitude: {{ store.markerLocalizacao.lat }} <br />
                Longitude: {{ store.markerLocalizacao.lng }}
              </div>
              <!-- Image Zoom HTML -->
              <div class="image q-mt-sm">
                <img
                  @click="openPopUp"
                  :src="strapiApi + store.markerImg"
                  alt="Imagem Rodovia"
                />
              </div>
            </div>
            <div v-else>
              <div>
                Sem informações, por favor use o filtro e clique em um marcador!
              </div>
            </div>
          </div>
        </q-expansion-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
      <div class="popup-image">
        <span @click="closePopUp">&times;</span>
        <img :src="strapiApi + store.markerImg" alt="Imagem Rodovia" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { formatarData, traduzDefeito } from "src/util/util";
import { useComponentStore } from "../stores/component-store";

const store = useComponentStore();

export default defineComponent({
  name: "MainLayout",
  setup() {
    const strapiApi = "http://localhost:1337";
    const pt_br = {
      days: "Domingo_Segunda_Terça_Quarta_Quinta_Sexta_Sábado".split("_"),
      daysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sab".split("_"),
      months:
        "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split(
          "_"
        ),
      monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
      firstDayofWeek: 1,
      format24h: true,
      pluralDay: "dias",
    };
    const estadosOptions = ["CE"];

    const defeitosOptions = ["Selecione", "Rachadura", "Remendo", "Panela"];

    const ceOptions = [
      "Selecione",
      "CE - 010",
      "CE - 156",
      "CE - 422",
      "CE - 471",
    ];

    function openPopUp() {
      document.querySelector(".popup-image").style.display = "block";
      store.tabDrawerControl();
    }

    function closePopUp() {
      document.querySelector(".popup-image").style.display = "none";
      store.markerDrawerControl();
    }

    function closePopUpOnchangeTab() {
      document.querySelector(".popup-image").style.display = "none";
    }

    return {
      store,
      estadosOptions,
      defeitosOptions,
      ceOptions,
      pt_br,
      strapiApi,
      formatarData,
      traduzDefeito,
      openPopUp,
      closePopUp,
      closePopUpOnchangeTab,
    };
  },
});
</script>

<style scoped>
.selectSize {
  width: 220px;
}
.dateInputSize {
  width: 130px;
  max-width: 130px;
}
.image {
  width: 350px;
  height: 250px;
  box-shadow: 0 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  cursor: pointer;
}
.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.2s linear;
}

.image:hover img {
  transform: scale(1.1);
}
.popup-image {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.9);
  height: 100%;
  width: 100%;
  z-index: 100;
  display: none;
}
.popup-image span {
  position: absolute;
  top: 5%;
  right: 10%;
  font-size: 60px;
  font-weight: bolder;
  color: #fff;
  cursor: pointer;
  z-index: 100;
}
.popup-image img {
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 5px solid #fff;
  border-radius: 5px;
  width: 1100px;
  object-fit: cover;
}

@media (max-width: 750px) {
  .popup-image img {
    width: 95%;
  }
}
</style>
