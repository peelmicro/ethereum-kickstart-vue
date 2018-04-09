<template>
  <v-container>
    <v-layout row justify-end>
        <v-btn 
          class="primary" 
          :to="`/campaigns/${this.address}/requests/new`"
          :disabled="loading"
        >Add Request</v-btn>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <h3>Requests</h3>
      </v-flex>
    </v-layout>      
    <v-layout row>
      <v-flex xs12>
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loading"
          class="elevation-1"
        >
          <template 
            slot="items" 
            slot-scope="props"
          >
            <td :class="itemClass('text-xs-left', props.item)" >{{ props.item.id }}</td>
            <td :class="itemClass('text-xs-left', props.item)" >{{ props.item.description }}</td>
            <td :class="itemClass('text-xs-right', props.item)" >{{ toEther(props.item.value) }}</td>
            <td :class="itemClass('text-xs-left', props.item)" >{{ props.item.recipient }}</td>
            <td :class="itemClass('text-xs-center', props.item)" >{{ props.item.approvalCount}}/{{approversCount}}</td>
            <td class="justify-center">
              <v-btn 
                color="success" 
                @click="onApprove(props.item.id)" 
                v-if="!props.item.complete"
                :disabled="(!(props.item.id === currentId && isOnApprove) && loading) 
                  || (props.item.approvalCount>=approversCount)"
                :loading="props.item.id === currentId && isOnApprove && loading"
              >
                Approve
              </v-btn>
            </td>            
            <td class="justify-center">
              <v-btn 
                color="info" 
                @click="onFinalize(props.item.id)"
                v-if="!props.item.complete"
                :disabled="(!(props.item.id === currentId && isOnfinalize) && loading) 
                  || !readyToFinalize(props.item.approvalCount)"
                :loading="props.item.id === currentId && isOnfinalize && loading"                
              >
                Finalize
              </v-btn>
            </td>            
          </template>
          <template slot="footer">
            <td colspan="100%">
              <strong>Found {{ items.length }} requests.</strong>
            </td>
          </template>
        </v-data-table>  
      </v-flex>         
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>       
        <v-alert type="error" dismissible v-model="error">
          {{errorMessage}}
        </v-alert>
      </v-flex>
    </v-layout>    
  </v-container>
</template>

<script>
import web3 from '@/ethereum/web3'
export default {
  data () {
    return {
      address: null,
      isOnApprove: false,
      isOnfinalize: false,
      currentId: null,
      headers: [
        { text: 'ID', align: 'left', sortable: true, value: 'id' },
        { text: 'Description', align: 'left', value: 'description' },
        { text: 'Amount', align: 'right', value: 'value' },
        { text: 'Recipient', align: 'left', value: 'recipient' },
        { text: 'Approval Count', align: 'center', sortable: false, value: 'approvalCount' },
        { text: 'Approve', align: 'center', sortable: false, value: 'approve' },
        { text: 'Finalize', align: 'center', sortable: false, value: 'finalize' }
      ]
    }
  },
  async asyncData ({ store, params }) {
    await store.dispatch('updateCampaign', params.address)
    await store.dispatch('setRequests', params.address)
    return {
      address: params.address
    }
  },
  computed: {
    items () {
      var currentCampaign = this.$store.getters.loadedCampaign(this.address)
      return (
        currentCampaign === undefined || currentCampaign.requests === undefined
          ? []
          : currentCampaign.requests
      )
    },
    approversCount () {
      var currentCampaign = this.$store.getters.loadedCampaign(this.address)
      return (
        currentCampaign === undefined || currentCampaign.requests === undefined
          ? 0
          : currentCampaign.approversCount
      )
    },
    errorMessage: {
      get () {
        return this.$store.getters.errorMessage
      },
      set (newValue) {
        this.$store.commit('setErrorMessage', newValue)
      }
    },
    loading () {
      return this.$store.getters.loading
    },
    error: {
      get () {
        return this.$store.getters.error
      },
      set (newValue) {
        this.$store.commit('setError', newValue)
      }
    }
  },
  methods: {
    async onApprove (id) {
      this.isOnApprove = true
      this.currentId = id
      await this.$store.dispatch('approveRequest', {
        address: this.address,
        id
      })
      this.isOnApprove = false
      this.currentId = null
    },
    async onFinalize (id) {
      this.isOnfinalize = true
      this.currentId = id
      await this.$store.dispatch('finalizeRequest', {
        address: this.address,
        id
      })
      this.isOnfinalize = false
      this.currentId = null
    },
    toEther (fromWei) {
      return web3.utils.fromWei(fromWei, 'ether')
    },
    readyToFinalize (approvalCount) {
      return approvalCount > this.approversCount / 2
    },
    itemClass (fixclass, item) {
      const color = item.complete ? 'grey--text' : this.readyToFinalize(item.approvalCount) ? 'green--text' : ''
      return `${fixclass} ${color}`
    }
  },
  async mounted () {
    this.$store.commit('setError', false)
    this.$store.commit('setErrorMessage', '')
    var currentCampaign = this.$store.getters.loadedCampaign(this.address)
    if ((currentCampaign === undefined || currentCampaign.manager === undefined ||
      currentCampaign.requests === undefined) && this.address !== null) {
      if (currentCampaign === undefined || currentCampaign.manager === undefined) {
        await this.$store.dispatch('updateCampaign', this.address)
      }
      if (currentCampaign.requests === undefined) {
        await this.$store.dispatch('setRequests', this.address)
      }
    }
  }
}
</script>
