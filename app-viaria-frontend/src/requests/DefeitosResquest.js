import Resquest from "./Resquest";

const resource = "/defeitos";

export default {
  findAll() {
    return Resquest.get(`${resource}?populate=imagem`);
  },
  findOne() {
    return Resquest.get(`${resource}?populate=imagem`);
  },
};
