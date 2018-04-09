import Vue from 'vue'
import Vuex from 'vuex'
import factory from '@/ethereum/factory'
import Campaign from '@/ethereum/campaign'
import web3 from '@/ethereum/web3'
// import _ from 'lodash'
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
        // state.campaigns = _.mapKeys(payload, 'address')
        state.campaigns = payload
      },
      setLoading (state, payload) {
        state.loading = payload
      },
      updateCampaign (state, payload) {
        const index = state.campaigns.findIndex(
          campaign => campaign.address === payload.address
        )
        let campaign = state.campaigns[index]
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
        if (payload.approversCount) {
          campaign.approversCount = payload.approversCount
        }
        if (payload.requestCount) {
          campaign.requestCount = payload.requestCount
        }
        if (payload.requests !== undefined) {
          campaign.requests = payload.requests
        }
        Vue.set(state.campaigns, index, campaign)
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
      async updateCampaign ({commit, getters}, payload) {
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
      async createRequest ({dispatch, commit, getters}, payload) {
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
            .createRequest(
              payload.description,
              web3.utils.toWei(payload.value, 'ether'),
              payload.recipient
            )
            .send({
              from: accounts[0] // First Account
            })
          const currentCampaign = getters.loadedCampaign(payload.address)
          let requests = currentCampaign.requests !== undefined ? currentCampaign.requests : []
          requests = requests.push({
            index: requests.length,
            description: payload.description,
            value: payload.value,
            recipient: payload.recipient,
            approvalCount: 0,
            complete: false
          })
          commit('updateCampaign', {
            address: payload.address,
            requestCount: requests.length,
            requests
          })
        } catch (err) {
          commit('setErrorMessage', err.message.split('\n', 1).join(''))
          commit('setError', true)
        }
        commit('setLoading', false)
      },
      async approveRequest ({dispatch, commit, getters}, payload) {
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
            .approveRequest(
              payload.id
            )
            .send({
              from: accounts[0] // First Account
            })
          const currentCampaign = getters.loadedCampaign(payload.address)
          let requests = currentCampaign.requests
          let request = currentCampaign.requests.find((request) => {
            return request.id === payload.id
          })
          if (request && request['approvalCount']) {
            request['approvalCount']++
          }
          commit('updateCampaign', {
            address: payload.address,
            requests
          })
        } catch (err) {
          commit('setErrorMessage', err.message.split('\n', 1).join(''))
          commit('setError', true)
        }
        commit('setLoading', false)
      },
      async finalizeRequest ({dispatch, commit, getters}, payload) {
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
            .finalizeRequest(
              payload.id
            )
            .send({
              from: accounts[0] // First Account
            })
          const currentCampaign = getters.loadedCampaign(payload.address)
          let requests = currentCampaign.requests
          let request = currentCampaign.requests.find((request) => {
            return request.id === payload.id
          })
          if (request && request['approvalCount']) {
            request['complete'] = true
          }
          commit('updateCampaign', {
            address: payload.address,
            requests
          })
          commit('setLoading', false)
        } catch (err) {
          commit('setErrorMessage', err.message.split('\n', 1).join(''))
          commit('setError', true)
        }
        commit('setLoading', false)
      },
      async setRequests ({commit}, payload) {
        commit('setLoading', true)
        const campaign = Campaign(payload)
        const approversCount = await campaign.methods.approversCount().call()
        let requestCount = await campaign.methods.getRequestCount().call()
        requestCount = parseInt(requestCount)
        let requests = []
        if (requestCount > 0) {
          const originalRequests = await Promise.all(
            Array(requestCount)
              .fill()
              .map((element, index) => {
                return campaign.methods.requests(index).call()
              })
          )
          requests = originalRequests.map((request, index) => {
            return {
              id: index,
              description: request.description,
              value: request.value,
              recipient: request.recipient,
              approvalCount: request.approvalCount,
              complete: request.complete
            }
          })
        }
        const currentCampaign = {
          address: payload,
          approversCount,
          requestCount,
          requests
        }
        commit('updateCampaign', currentCampaign)
        commit('setLoading', false)
      }
    },
    getters: {
      loadedCampaigns: (state) => {
        return state.campaigns
      },
      loadedCampaign: (state) => (payload) => {
        // return state.campaigns[payload]
        // return state.campaigns.map(address => state.campaigns[address])
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
