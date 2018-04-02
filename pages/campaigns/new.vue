<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h2>Create a Campaing!</h2>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateCampaign">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="minimumContribution"
                label="minimum contribution"
                id="minimumContribution"
                v-model="minimumContribution"
                suffix="wei"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>
                
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>               
              <v-btn 
                class="primary" 
                :disabled="!formIsValid"
                :loading="loading"
                type="submit"
              >Create Campaign</v-btn>
            </v-flex>
          </v-layout>
        </form>
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
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
export default {
  data () {
    return {
      minimumContribution: '',
      errorMessage: '',
      loading: false,
      error: false
    }
  },
  computed: {
    formIsValid () {
      return (
        this.minimumContribution !== ''
      )
    }
  },
  methods: {
    async onCreateCampaign () {
      if (!this.formIsValid) {
        return
      }
      this.errorMessage = ''
      this.error = false
      this.loading = true
      try {
        const accounts = await web3.eth.getAccounts() // From Metamask
        await factory.methods
          .createCampaign(this.minimumContribution)
          .send({
            from: accounts[0] // First Account
          })
        this.$router.push('/')
      } catch (err) {
        this.errorMessage = err.message.split('\n', 1).join('')
        this.error = true
      }
      this.loading = false
    }
  }
}
</script>
