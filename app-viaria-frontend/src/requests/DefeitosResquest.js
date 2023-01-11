import Request from "./Resquest";

const resource = "/defeitos";

export default {
  findAll() {
    return Request.get(`${resource}?populate=imagem`);
  },

  findOne(id) {
    return Request.get(`${resource}/${id}?populate=imagem`);
  },
  findByClasse(classe) {
    return Request.get(`${resource}?filters[classe][$eq]=${classe}`);
  },

  findByCidadeAndRodovia(filters){
    let rodovia = filters.rodovia;
    let defeito = filters.defeito;

    if(rodovia === "Selecione")
      rodovia = ""

    if (defeito === "Selecione") defeito = "";
    else if (defeito === "Rachadura") defeito = "crack";
    else if (defeito === "Remendo") defeito = "patche";
    else if (defeito === "Panela") defeito = "pothole";

    return Request.get(`${resource}?filters[$and][1][endereco][$contains]=${rodovia}&}&filters[$and][2][classe][$contains]=${defeito}&populate=imagem`);
  }
};
