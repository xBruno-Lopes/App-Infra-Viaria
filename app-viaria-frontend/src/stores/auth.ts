import { defineStore } from "pinia";
import Cookie from "js-cookie";
import { v4 as uuid } from "uuid";
import { api } from "src/boot/axios";
import { User } from "src/types/User";
import { Token } from "src/types/Token";

const cookieName = "infra-viaria";
let encryptionToken = Cookie.get(cookieName) || uuid();
Cookie.set(cookieName, encryptionToken, {
  secure: false,
  expires: 1,
});

function addHours(data: Date, hours: number) {
  data.setTime(data.getTime() + hours * 60 * 60 * 1000);
  return data;
}

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      token: "",
      token_update_date: new Date(0),
      user: {
        roles: [""],
      },
    };
  },
  actions: {
    login(authData: User) {
      return new Promise<void>((resolve) => {
        api
          .post("/auth/local", {
            identifier: authData.identifier,
            password: authData.password,
          })
          .then((res) => {
            const { jwt } = res.data;
            const date = new Date();

            this.updateToken({ token: jwt, date: date });

            Cookie.set(cookieName, encryptionToken, {
              secure: true,
              expires: addHours(date, 1),
            });

            api
              .get("/users/me", {
                params: {
                  populate: "role",
                },
              })
              .then((res) => {
                const date = new Date();
                const { role } = res.data;

                encryptionToken = uuid();

                this.updateRoles([role.name]);
                this.updateToken({ token: jwt, date: date });

                Cookie.set(cookieName, encryptionToken, {
                  secure: true,
                  expires: addHours(date, 1),
                });
              });
          })
          .finally(() => resolve());
      });
    },

    logout() {
      this.removeToken();
    },

    updateToken(tokenData: Token) {
      this.token = tokenData.token;
      this.token_update_date = tokenData.date;

      Cookie.set(cookieName, encryptionToken, {
        secure: true,
        expires: addHours(new Date(tokenData.date), 1),
      });
    },

    updateRoles(roles: string[]) {
      this.user.roles = [];
      this.user.roles = roles;
    },

    removeToken() {
      this.token = "";
      this.user.roles = [];
      this.token_update_date = new Date(0);

      sessionStorage.clear();
      Cookie.remove(cookieName);
    },
  },
  getters: {
    isAuthenticated: (state) => {
      return state.token !== "" && state.token !== undefined;
    },
    isValidDateToken: (state) => {
      return new Date() <= addHours(new Date(state.token_update_date), 1);
    },
    getToken: (state) => {
      return state.token;
    },
    getUser: (state) => {
      return state.user;
    },
    isAdministrador: (state) => {
      return state.user.roles.includes("ADMINISTRADOR");
    },
    isUsuario: (state) => {
      return state.user.roles.includes("USUARIO");
    },
  },
});
