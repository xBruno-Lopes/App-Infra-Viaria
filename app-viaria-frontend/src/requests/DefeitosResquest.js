import Resquest from "./Resquest";

const resource = "/defeitos";

export default {
  findAll() {
    return Resquest.get(`${resource}?populate=imagem`);
  },

  findOne(id) {
    return Resquest.get(`${resource}/${id}?populate=imagem`);
  },

  findByCidadeAndRodovia(filters){
    const cidade = filter.cidade;
    const rodovia = filters.rodovia;

    if(rodovia === null && cidade !== null )
      return Request.get(`${resource}?filters[cidade][$eq]=${cidade}`);
    if(cidade === null && rodovia !== null)
      return Request.get(`${resource}?filters[endereco][$eq]=${rodovia}`);

    return Request.get(`${resource}?filters[$and][0][cidade][$eq]=${cidade}&filters[$and][1][${rodovia}]`);
  }
};
