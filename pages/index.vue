<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 md9>
        <h3>Open Campaigns</h3>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 md9>
        <v-layout 
          row
          v-for="campaign in campaigns"
          :key="campaign.id"     
          class="mb-2"      
        >
          <v-flex xs12>
            <v-card>
                <v-layout row>
                  <v-flex xs12>
                    <v-card-title primary-title>
                      <div>
                        <h5>{{campaign.id}}</h5>
                      </div>
                    </v-card-title>
                    <v-card-actions>
                      <v-btn class="info" :to="`/campaigns/${campaign.id}`">
                        <v-icon left light>arrow_forward</v-icon>
                        View Campaign
                      </v-btn>
                    </v-card-actions>
                  </v-flex>              
                </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>   
       <v-flex xs12 md3>
        <v-btn class="primary" to="/campaigns/new">
          <v-icon left>add_circle</v-icon>
          Create Campaing
        </v-btn>         
      </v-flex>         
    </v-layout>
  </v-container>
</template>

<script>
import factory from '../ethereum/factory'
export default {
  async asyncData () {
    let campaigns = await factory.methods.getDeployedCampaigns().call()
    campaigns = campaigns.length
      ? campaigns.map(address => {
        return {
          id: address
        }
      })
      : {}
    return {
      campaigns
    }
  }
}
</script>
