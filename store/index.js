import Vuex from 'vuex'
import factory from '@/ethereum/factory'
import Campaign from '@/ethereum/campaign'
import web3 from '@/ethereum/web3'

const createStore = () => {
  return new Vuex.Store({
    state: {
      campaigns: [],
      loading: false,
      errorMessage: '',
      error: '',
      accounts: []
    },
    mutations: {
      setCampaigns (state, payload) {
        state.campaigns = payload
      },
      setLoading (state, payload) {
        state.loading = payload
      },
      updateCampaign (state, payload) {
        const campaign = state.campaigns.find(campaign => {
          return campaign.address === payload.address
        })
        if (payload.mininumContribution) {
          campaign.mininumContribution = payload.mininumContribution
        }
        if (payload.balance) {
          campaign.balance = payload.balance
        }
        if (payload.requestsCount) {
          campaign.requestsCount = payload.requestsCount
        }
        if (payload.approversCount) {
          campaign.approversCount = payload.approversCount
        }
        if (payload.manager) {
          campaign.manager = payload.manager
        }
      },
      setErrorMessage (state, payload) {
        state.errorMessage = payload
      },
      setError (state, payload) {
        state.error = payload
      },
      setAccounts (state, payload) {
        state.accounts = payload
      }
    },
    actions: {
      async nuxtServerInit ({ dispatch }) {
        await dispatch('setCampaigns')
      },
      async setCampaigns ({commit}) {
        let campaigns = await factory.methods.getDeployedCampaigns().call()
        campaigns = campaigns.length
          ? campaigns.map(address => {
            return {
              address: address
            }
          })
          : {}
        commit('setCampaigns', campaigns)
      },
      async updateCampaign ({commit}, payload) {
        commit('setLoading', true)
        const campaign = Campaign(payload)
        const summary = await campaign.methods.getSummary().call()
        const currentCampaign = {
          address: payload,
          mininumContribution: summary[0],
          balance: summary[1],
          requestsCount: summary[2],
          approversCount: summary[3],
          manager: summary[4]
        }
        commit('updateCampaign', currentCampaign)
        commit('setLoading', false)
      },
      async setAccounts ({commit}) {
        commit('setLoading', true)
        const accounts = await web3.eth.getAccounts() // From Metamask
        commit('setAccounts', accounts)
        commit('setLoading', false)
      },
      async contribute ({dispatch, commit, getters}, payload) {
        let accounts = getters.accounts
        if (accounts.length === 0) {
          await dispatch('setAccounts')
        }
        commit('setLoading', true)
        commit('setErrorMessage', '')
        commit('setError', false)
        accounts = getters.accounts
        try {
          const campaign = Campaign(payload.address)
          await campaign.methods
            .contribute()
            .send({
              from: accounts[0], // First Account
              value: web3.utils.toWei(payload.value, 'ether')
            })
          await dispatch('updateCampaign', payload.address)
        } catch (err) {
          commit('setErrorMessage', err.message.split('\n', 1).join(''))
          commit('setError', true)
        }
        commit('setLoading', false)
      },
      async createCampaign ({dispatch, commit, getters}, payload) {
        let accounts = getters.accounts
        if (accounts.length === 0) {
          await dispatch('setAccounts')
        }
        commit('setLoading', true)
        commit('setErrorMessage', '')
        commit('setError', false)
        accounts = getters.accounts
        try {
          await factory.methods
            .createCampaign(payload.minimumContribution)
            .send({
              from: accounts[0] // First Account
            })
          await dispatch('setCampaigns')
        } catch (err) {
          commit('setErrorMessage', err.message.split('\n', 1).join(''))
          commit('setError', true)
        }
        commit('setLoading', false)
      }
    },
    getters: {
      loadedCampaigns: (state) => {
        return state.campaigns
      },
      loadedCampaign: (state) => (payload) => {
        return state.campaigns.find(campaign => campaign.address === payload)
      },
      loading: (state) => {
        return state.loading
      },
      accounts: (state) => {
        return state.accounts
      },
      errorMessage: (state) => {
        return state.errorMessage
      },
      error: (state) => {
        return state.error
      }
    }
  })
}

export default createStore
