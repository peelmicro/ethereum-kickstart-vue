<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 md8>
        <h3>Campaign Show</h3>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md8>
        <v-layout 
          row
          v-for="item in items"
          :key="item.id"     
          class="mb-2"      
        >
          <v-flex xs12>
            <v-card>
                <v-layout row>
                  <v-flex xs12>
                    <v-card-title primary-title>
                      <div>
                        <h5>{{item.header}}</h5>
                        <div class="grey--text">{{item.meta}}</div>
                        <div>{{item.description}}</div>
                      </div>
                    </v-card-title>
                  </v-flex>              
                </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>   
      <v-flex ml-2 xs12 md4>
        <ContributeForm :address="address"></ContributeForm>       
      </v-flex>         
    </v-layout>
  </v-container>
</template>

<script>
import Campaign from '../../ethereum/campaign'
import web3 from '../../ethereum/web3'
import ContributeForm from '../../components/ContributeForm'
export default {
  async asyncData ({ params }) {
    const campaign = Campaign(params.address)

    const summary = await campaign.methods.getSummary().call()
    const mininumContribution = summary[0]
    const balance = summary[1]
    const requestsCount = summary[2]
    const approversCount = summary[3]
    const manager = summary[4]
    return {
      address: params.address,
      mininumContribution,
      balance,
      requestsCount,
      approversCount,
      manager,
      items: [
        {
          header: manager,
          meta: 'Address of Manager',
          description: 'The manager created this campaign and can create requests to withdraw money.'
        },
        {
          header: mininumContribution,
          meta: 'Minimum Contribution (wei)',
          description: 'You must contribute at least this much wei to become an approver.'
        },
        {
          header: requestsCount,
          meta: 'Number of Requests',
          description: 'A request tries to withdraw money from the contract. Request must be approved by approvers.'
        },
        {
          header: approversCount,
          meta: 'Number of approvers',
          description: 'Number of people who have already donated money to this campaign.'
        },
        {
          header: web3.utils.fromWei(balance, 'ether'),
          meta: 'Campaign Balance (ether)',
          description: 'The balance is how much money this campaign has left to spend.'
        }
      ]
    }
  },
  components: {
    ContributeForm
  }
}
</script>
