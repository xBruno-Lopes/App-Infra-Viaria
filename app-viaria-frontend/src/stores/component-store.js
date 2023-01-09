import { defineStore } from "pinia";

export const useComponentStore = defineStore("main", {
  state: () => ({
    markerClasse: null,
    markerDate: null,
    markerEndereco: null,
    markerImg: null,
    leftDrawerOpen: false,
    markerLocalizacao: null,
    cidade: "Fortaleza, CE",
    defeito: "Selecione",
    rodovia: "Selecione",
    nenhumFiltroSelecionado: false
  }),
  actions: {
    fecthMarkerData(classe, date, endereco, img, localizacao) {
      (this.markerClasse = classe),
        (this.markerDate = date),
        (this.markerEndereco = endereco),
        (this.markerImg = img);
      this.markerLocalizacao = localizacao;
    },
    markerDrawerControl() {
      if (this.leftDrawerOpen === false) this.leftDrawerOpen = true;
    },
    ToolbarDrawerControl() {
      if (this.leftDrawerOpen) {
        this.leftDrawerOpen = false;
      } else {
        this.leftDrawerOpen = true;
      }
    },
  },
  getters: {
    getRodovia(state) {
      return state.rodovia;
    },
    getCidade(state) {
      return state.cidade;
    },
    getDefeito(state) {
      return state.defeito;
    },
    getNenhumFiltro(state) {
      return state.nenhumFiltroSelecionado;
    }
  },
});
