import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0xf53A9794C00Ec4E74a675D6BB408DeBFE311Ce9F'
)

export default instance
