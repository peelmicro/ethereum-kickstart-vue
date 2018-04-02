<template>
  <div>
    <form @submit.prevent="onContribute">
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            name="value"
            label="Amount to Contribute"
            id="value"
            v-model="value"
            suffix="ether"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>               
          <v-btn 
            class="primary" 
            :disabled="!formIsValid"
            :loading="loading"
            type="submit"
          >Contribute!</v-btn>
        </v-flex>
      </v-layout>
    </form>
    <v-alert type="error" dismissible v-model="error">
      {{errorMessage}}
    </v-alert>
  </div>
</template>

<script>
import Campaign from '../ethereum/campaign'
import web3 from '../ethereum/web3'
export default {
  props: ['address'],
  data () {
    return {
      value: '',
      errorMessage: '',
      loading: false,
      error: false
    }
  },
  computed: {
    formIsValid () {
      return (
        this.value !== ''
      )
    }
  },
  methods: {
    async onContribute () {
      if (!this.formIsValid) {
        return
      }
      this.errorMessage = ''
      this.error = false
      this.loading = true
      try {
        const campaign = Campaign(this.address)
        const accounts = await web3.eth.getAccounts() // From Metamask

        await campaign.methods
          .contribute()
          .send({
            from: accounts[0], // First Account
            value: web3.utils.toWei(this.value, 'ether')
          })
        // this.$router.replace(`/campaigns/${this.address}`) 02/04/2018 does not work
        this.$router.go({path: `/campaigns/${this.address}`, force: true})
      } catch (err) {
        this.errorMessage = err.message.split('\n', 1).join('')
        this.error = true
      }
      this.loading = false
    }
  }
}
</script>
