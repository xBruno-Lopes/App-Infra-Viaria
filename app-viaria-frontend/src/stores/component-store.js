import { defineStore } from "pinia";
import { RequestFactory } from "src/requests/RequestFactory";

const defeitosRequest = RequestFactory.get("defeitos");

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
    modelDefeitos: null,
    contentTable: new Set(),
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
    filtrarPorClasse() {
      this.contentTable.clear();
      defeitosRequest
        .findByClasse(this.modelDefeitos.toLowerCase())
        .then((res) => {
          res.data.data.map((elem) => {
            this.contentTable.add(
              JSON.stringify({
                endereco: elem.attributes.endereco,
                defeitos: elem.attributes.classe,
                quantidade: 25,
              })
            );
          });
        });
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
    getContentTable(state) {
      const data = [...state.contentTable].map((item) => {
        if (typeof item === "string") return JSON.parse(item);
        else if (typeof item === "object") return item;
      });
      return data;
    },
  },
});
