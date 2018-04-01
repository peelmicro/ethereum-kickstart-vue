<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h3>Open Campaigns</h3>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md9
        v-for="campaign in campaigns"
        :key="campaign.id"     
        class="mb-2"
        wrap
      >
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
      <v-flex xs12 md3>
        <v-btn>
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
    console.log(campaigns)
    return {
      campaigns
    }
  }
}
</script>
