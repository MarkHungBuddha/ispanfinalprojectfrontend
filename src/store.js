import { createStore } from 'vuex';

export default createStore({
    state: {
        isLoggedIn: false,
        wishlist: []
    },
    mutations: {
        setLoginStatus(state, status) {
            state.isLoggedIn = status;
        },
        setWishList(state, wishlist) {
            state.wishlist = wishlist;
        }
    },
    actions: {
        updateLoginStatus({ commit }, status) {
            commit('setLoginStatus', status);
        }
    }
});
