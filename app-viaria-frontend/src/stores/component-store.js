import { defineStore } from "pinia";
import { RequestFactory } from "src/requests/RequestFactory";

const defeitosRequest = RequestFactory.get("defeitos");

export const useComponentStore = defineStore("main", {
  state: () => ({
    markerClasse: null,
    markerDate: null,
    markerEndereco: null,
    markerImg: null,
    leftDrawerOpen: false,
    makerLocalizacao: null,
    cidade: "Fortaleza, CE",
    defeito: "Selecione",
    rodovia: "Selecione",
    nenhumFiltroSelecionado: false,
    contentTable: new Set(),
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
