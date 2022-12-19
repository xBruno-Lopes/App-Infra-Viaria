import { defineStore } from "pinia";

export const useComponentStore = defineStore("main", {
  state: () => ({
    makerClasse: null,
    markeDate: null,
    makerEndereco: null,
    makerImg: null,
    leftDrawerOpen: false,
    makerLocalizacao: null,
    ceBanabuiu: "",
    ceQuixada: "",
    ceFortaleza: "",
  }),
  actions: {
    fecthMarkerData(classe, date, endereco, img, localizacao) {
      (this.makerClasse = classe),
        (this.markeDate = date),
        (this.makerEndereco = endereco),
        (this.makerImg = img);
      this.makerLocalizacao = localizacao;
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
    getCEBnb(state) {
      return state.ceBanabuiu;
    },
    getCEQui(state) {
      return state.ceQuixada;
    },
    getCEFor(state) {
      return state.ceFortaleza;
    },
  },
});
