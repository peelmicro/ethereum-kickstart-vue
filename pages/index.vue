<template>
  <h1>First Campaign: {{ campaigns[0] }}</h1>
</template>

<script>
import factory from '../ethereum/factory'
export default {
  async asyncData () {
    const campaigns = await factory.methods.getDeployedCampaigns().call()
    console.log(campaigns)
    return {
      campaigns
    }
  }
}
</script>
