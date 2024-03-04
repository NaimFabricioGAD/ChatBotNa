// import BotWhatsapp from "@bot-whatsapp/bot";
// import ProviderWS from "@bot-whatsapp/provider/baileys";
// export default BotWhatsapp.createProvider(ProviderWS);
const BotWhatsapp = require("@bot-whatsapp/bot");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
module.exports = BotWhatsapp.createProvider(BaileysProvider);
