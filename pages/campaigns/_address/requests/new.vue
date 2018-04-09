<template>
  <v-container>
    <nuxt-link :to="`/campaigns/${this.address}/requests`">Back</nuxt-link>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h2>Create a Request</h2>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateRequest">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field
                name="description"
                label="description"
                id="description"
                v-model="description"
                required
              ></v-text-field>
              <v-text-field
                name="value"
                label="Amount in Ether"
                id="value"
                v-model="value"
                suffix="Ether"
                required
              ></v-text-field>
              <v-text-field
                name="recipient"
                label="Recipient"
                id="recipient"
                v-model="recipient"
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
              >Create!</v-btn>
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
      address: '',
      value: '',
      description: '',
      recipient: ''
    }
  },
  computed: {
    formIsValid () {
      return (
        this.value !== '' && this.description !== '' && this.recipient !== ''
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
    async onCreateRequest () {
      if (!this.formIsValid) {
        return
      }
      if (this.address === '') {
        this.address = this.$route.params.address
      }
      await this.$store.dispatch('createRequest', {
        address: this.address,
        value: this.value,
        description: this.description,
        recipient: this.recipient
      })
      if (!this.error) {
        this.$router.push(`/campaigns/${this.address}/requests`)
      }
    }
  },
  mounted () {
    this.$store.commit('setError', false)
    this.$store.commit('setErrorMessage', '')
    this.address = this.$route.params.address
  }
}
</script>
