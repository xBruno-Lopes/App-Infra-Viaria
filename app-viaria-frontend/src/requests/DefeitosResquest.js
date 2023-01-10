import Resquest from "./Resquest";

const resource = "/defeitos";

export default {
  findAll() {
    return Resquest.get(`${resource}?populate=imagem`);
  },
  findByClasse(classe) {
    return Resquest.get(`${resource}?filters[classe][$eq]=${classe}`);
  },
};
