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
export default {
  data () {
    return {
      minimumContribution: ''
    }
  },
  computed: {
    formIsValid () {
      return (
        this.minimumContribution !== ''
      )
    },
    errorMessage () {
      return this.$store.getters.errorMessage
    },
    loading () {
      return this.$store.getters.loading
    },
    error () {
      return this.$store.getters.error
    }
  },
  methods: {
    async onCreateCampaign () {
      if (!this.formIsValid) {
        return
      }
      await this.$store.dispatch('createCampaign', {
        minimumContribution: this.minimumContribution
      })
      if (!this.error) {
        this.$router.push('/')
      }
    }
  },
  mounted () {
    this.$store.commit('setError', false)
    this.$store.commit('setErrorMessage', '')
  }
}
</script>
