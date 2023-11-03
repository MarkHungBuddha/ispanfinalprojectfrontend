import { createStore } from 'vuex';

export default createStore({
    state: {
        isLoggedIn: false,
        apiCallFinished: false,
        wishlist: []
    },
    mutations: {
        setLoginStatus(state, status) {
            state.isLoggedIn = status;
        },
        setWishList(state, wishlist) {
            state.wishlist = wishlist;
        },
        setApiCallFinished(state, payload) {
            state.apiCallFinished = payload;
        }

    },
    actions: {
        updateLoginStatus({ commit }, status) {
            commit('setLoginStatus', status);
        },
    // 添加這個 action
    updateApiCallStatus({ commit }, status) {
        commit('setApiCallFinished', status);
    }

    }
});
