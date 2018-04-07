<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 md8>
        <h3>Campaign Show</h3>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md7>
        <v-layout 
          v-for="item in items"
          :key="item.id"     
          class="mb-2"      
        >
          <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <div>
                  <h5>{{item.header}}</h5>
                  <div class="grey--text">{{item.meta}}</div>
                  <div>{{item.description}}</div>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>   
      <v-flex ml-2 xs12 md5>
        <v-card>
          <v-card-title primary-title>
            <ContributeForm :address="address"></ContributeForm>  
          </v-card-title>
        </v-card>     
      </v-flex>         
    </v-layout>
  </v-container>
</template>

<script>
import web3 from '@/ethereum/web3'
import ContributeForm from '@/components/ContributeForm'
export default {
  data () {
    return {
      address: null
    }
  },
  async asyncData ({ store, params }) {
    await store.dispatch('updateCampaign', params.address)
    return {
      address: params.address
    }
  },
  computed: {
    items () {
      var currentCampaign = this.$store.getters.loadedCampaign(this.address)
      let items = []
      if (currentCampaign !== undefined && currentCampaign.manager !== undefined) {
        items = [
          {
            header: currentCampaign.manager,
            meta: 'Address of Manager',
            description: 'The manager created this campaign and can create requests to withdraw money.'
          },
          {
            header: currentCampaign.mininumContribution,
            meta: 'Minimum Contribution (wei)',
            description: 'You must contribute at least this much wei to become an approver.'
          },
          {
            header: currentCampaign.requestsCount,
            meta: 'Number of Requests',
            description: 'A request tries to withdraw money from the contract. Request must be approved by approvers.'
          },
          {
            header: currentCampaign.approversCount,
            meta: 'Number of approvers',
            description: 'Number of people who have already donated money to this campaign.'
          },
          {
            header: web3.utils.fromWei(currentCampaign.balance, 'ether'),
            meta: 'Campaign Balance (ether)',
            description: 'The balance is how much money this campaign has left to spend.'
          }
        ]
      }
      return items
    }
  },
  components: {
    ContributeForm
  },
  async mounted () {
    this.$store.commit('setError', false)
    this.$store.commit('setErrorMessage', '')
    var currentCampaign = this.$store.getters.loadedCampaign(this.address)
    if (currentCampaign === undefined && currentCampaign.manager === undefined && this.address !== null) {
      await this.$store.dispatch('updateCampaign', this.address)
    }
  }
}
</script>
