import web3 from './web3'
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x3244E35071b5d51ce5B08a04789B51F67C5EFAEf'
)

export default instance
