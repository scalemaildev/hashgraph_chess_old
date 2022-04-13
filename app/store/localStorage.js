/* State */
export const state = () => ({
    PRIVATE_KEY: '',
    ACCOUNT_ID: '',
    PAIRING_STRING: '',
    HC_TOPIC: '',
    PAIRED_WALLET: {}
});

/* Mutations */
export const mutations = {
    SET_PRIVATE_KEY(state, newPrivateKey) {
        state.PRIVATE_KEY = newPrivateKey;
    },
    SET_ACCOUNT_ID(state, newAccountId) {
        state.ACCOUNT_ID = newAccountId;
    },
    SET_PAIRING_STRING(state, newPairingString) {
        state.PAIRING_STRING = newPairingString;
    },
    SET_HC_TOPIC(state, newTopicId) {
        state.HC_TOPIC = newTopicId;
    },
    SET_PAIRED_WALLET(state, newWalletData) {
        state.PAIRED_WALLET = newWalletData;
    },
    CLEAR_HC_DATA(state) {
        state.PRIVATE_KEY = '';
        state.ACCOUNT_ID = '';
        state.PAIRING_STRING = '';
        state.HC_TOPIC = '';
        state.PAIRED_WALLET = {};
    },
    CHECK_HC_DATA(state) {
        if(!!state.PRIVATE_KEY && !!state.ACCOUNT_ID && !!state.PAIRING_STRING && !!state.HC_TOPIC && !!state.PAIRED_WALLET){
            this.commit('sessionStorage/SET_WALLET_CONNECTED', {}, { root: true });
        } else {
            // clear any leftover data in fields
            this.commit('localStorage/CLEAR_HC_DATA', {}, { root: true });
        }
    },
};
