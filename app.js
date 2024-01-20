// (1) seccion de importanciones 
const axios = require('axios').default;
const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
// gracias por contactar el ilustre colegio de abogados de apurimac 😊
// escriba: 
 //--> A : para consultar su habilidad 😎
// --> B : para ver ultima constancia de habilidad 😂
// --> C : para ver su ultimo aporte 😒
// gracias por contactarnos, te esperamos cuando gustes 😊😊😊😊
const API = 'https://cipapurimac.sacpro.pe/publico/estadocip/'

const flowConsulta=addKeyword(['1'])
.addAnswer("Parece que deseas saber si eres un colegiado habilitado o no 😁Para ello indicanos tu numero de colegiatura 😁",
    {capture:true},
    async(ctx,{flowDynamic}) => {
        //if(false){}
        console.log(API+ctx.body);
        const respuesta = await axios(API+ctx.body) 
        let opciones = {
            "0":"colegiado no existe",
            "1":"colegiado habilitado",
            "2":"colegiado no habilitado",
            "3":"colegiado fallecido"
        }
        let respuestaPersonalizada= opciones[respuesta.data]
        console.log(respuesta.data);
        await flowDynamic(respuestaPersonalizada)
        return;
    },
    
)

const flowInicial = addKeyword (EVENTS.WELCOME)
.addAnswer(["😊BIENVENIDO👌gracias por contactar al ilustre colegio de abogados de apurimac 😊"])
.addAnswer(
    [
        "🫡 te presentamos nuestro ChaTbot oficial que puede resolver tus consultas",
        "Para comenzar con tu consulta, elige una de las opciones que preparamos para ti 😉",
        " 1 --> consultar su habilidad😎",
        " 2 --> ultima constancia de habilidad🤨",
        " 3 --> ver ultimo aporte🤑",
        
    ],
    {capture:true},
    async(ctx,{fallBack})=> {
        if (!['1','2','3'].includes(""+ctx.body)){
            return fallBack([
                "Lo siento no te etendi😒 porfavor elige una de nuestras opciones" ,
                " ",
                " 1  -> consultar su habilidad😎",
                " 2  -> ultima constancia de habilidad🤨",
                " 3  -> ver ultimo aporte🤑",
            ])
        }
    },
    [flowConsulta]
)

// (2) definimos funciones principales 
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowInicial,flowConsulta])
    const adapterProvider = createProvider(BaileysProvider)

 
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
