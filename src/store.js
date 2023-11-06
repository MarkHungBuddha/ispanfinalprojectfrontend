import {createStore} from 'vuex';

export default createStore({
    state: {
        isLoggedIn: false,
        apiCallFinished: false,
        wishlist: [],
        memberId: null,
    },
    getters: {
        memberId: state => state.memberId,
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
        },
        setOrderData(state, data) {
            state.orderData = data;
        },
        clearOrderData(state) {
            state.orderData = null;
        },
        SET_MEMBER_ID(state, memberId) {
            state.memberId = memberId;
        },

    },
    actions: {
        updateLoginStatus({commit}, status) {
            commit('setLoginStatus', status);
        },
        // 添加這個 action
        updateApiCallStatus({commit}, status) {
            commit('setApiCallFinished', status);
        },
        saveOrderData({commit}, data) {
            commit('setOrderData', data);
        },
        removeOrderData({commit}) {
            commit('clearOrderData');
        },
        updateMemberId(context, memberId) {
            context.commit('SET_MEMBER_ID', memberId);
        },

    }
});