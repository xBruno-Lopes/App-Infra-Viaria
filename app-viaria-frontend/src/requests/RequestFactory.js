import DefeitosResquest from "./DefeitosResquest";

const requests = {
  defeitos: DefeitosResquest,
};

export const RequestFactory = {
  get: (name) => requests[name],
};
