<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        Open Campaigns
      </v-flex>
    </v-layout>
    <v-layout 
      row 
      wrap
      v-for="campaign in campaigns"
      :key="campaign.id"     
      class="mb-2" 
      >
      <v-flex xs12 md8>
        <v-card class="info">
            <v-layout row>
              <v-flex xs12>
                <v-card-title primary-title>
                  <div>
                    <h5>{{campaign.id}}</h5>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat>
                    <v-icon left light>arrow_forward</v-icon>
                    View Campaign
                  </v-btn>
                </v-card-actions>
              </v-flex>              
            </v-layout>
        </v-card>
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
    console.log(campaigns)
    return {
      campaigns
    }
  }
}
</script>
