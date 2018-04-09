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
export default {
  props: ['address'],
  data () {
    return {
      value: ''
    }
  },
  computed: {
    formIsValid () {
      return (
        this.value !== ''
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
    async onContribute () {
      if (!this.formIsValid) {
        return
      }
      await this.$store.dispatch('contribute', {
        address: this.address,
        value: this.value
      })
      this.value = ''
    }
  }
}
</script>
