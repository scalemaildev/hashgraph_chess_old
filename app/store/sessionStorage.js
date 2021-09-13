/* State */
export const state = () => ({
    ACCOUNT_ID: '',
    PRIVATE_KEY: '',
    ACTIVE_PANEL: 'loadingPanel',
    LOCK_BUTTON: false,
    MATCHES: {},
});

/* MUTATIONS */
export const mutations = {
    SET_ACCOUNT_ID(state, accountId) {
        state.ACCOUNT_ID = accountId;
    },
    SET_PRIVATE_KEY(state, privateKey) {
        state.PRIVATE_KEY = privateKey;
    },
    TOGGLE_LOCK_BUTTON(state, bool) {
        state.LOCK_BUTTON = bool;
    },
    SET_ACTIVE_PANEL(state, newPanel) {
        state.ACTIVE_PANEL = newPanel;
    },
    CREATE_MATCH_OBJECT(state, newMatchData) {
        this._vm.$set(state.MATCHES, newMatchData.topicId, {
            player1: newMatchData.player1,
            player2: newMatchData.player2,
            messages: [],
            moves: []
        });
    },
    SEE_MATCHES(state) {
        console.log(state.MATCHES);
    },
    PUSH_MESSAGE(state, context) {
        state.MATCHES[context.topicId].messages.append(context.message);
    },    
};

/* Actions */
export const actions = {
    async INIT_HASHGRAPH_CLIENT({ commit }, context) {
        const response = await this.dispatch(
            'ASYNC_EMIT', {
                eventName: 'initHashgraphClient',
                accountId: context.accountId,
                privateKey: context.privateKey
            });

        if (response.result == 'SUCCESS') {
            commit('SET_ACCOUNT_ID', context.accountId);
            commit('SET_PRIVATE_KEY', context.privateKey);
            commit('TOGGLE_LOCK_BUTTON', true);
        }
        
        return response;
    },

    async UNSET_CLIENT({ commit }) {
        // dispatch a method to clear the client server-side
        const response = await this.dispatch('ASYNC_EMIT', {
            'eventName': 'unsetClient'
        });

        if (response.result == 'SUCCESS') {
            commit('SET_ACCOUNT_ID', '');
            commit('SET_PRIVATE_KEY', '');
            commit('TOGGLE_LOCK_BUTTON', false);
            commit('SET_ACTIVE_PANEL', 'startPanel');
        } else {
            console.error(response.responseMessage);
        }
    },

    async CREATE_NEW_TOPIC() {
        let response = await this.dispatch('ASYNC_EMIT', {
            eventName: 'createNewTopic'
        });
        return response;
    },

    async CREATE_MATCH({ commit }, context) {
        const response = await this.dispatch('sessionStorage/CREATE_NEW_TOPIC');

        if (response.result == 'SUCCESS') {
            let newMatchData = {
                messageType: 'matchCreation',
                topicId: response.newTopicId,
                player1: context.player1,
                player2: context.player2,
            };
            
            this.dispatch('ASYNC_EMIT', {
                eventName: 'sendHCSMessage',
                context: newMatchData
            });
        }

        // always return the response
        return response;
    },

    async SUBSCRIBE_TO_TOPIC({ commit }, topicId) {
        window.$nuxt.$root.mainSocket.emit('subscribeToTopic', {
            topicId: topicId
        });
    },

    PROCESS_MESSAGE({ commit }, data) {
        let message = JSON.parse(data.contents);

        switch(message.messageType) {
        case 'matchCreation':
            commit('CREATE_MATCH_OBJECT', message);
            break;
        default:
            console.log('Got unknown message type: ' + message.messageType);
        }
    },
};

/* GETTERS */
export const getters = {
    MATCH_DATA: (state) => {
        return state.MATCHES;
    },
};
