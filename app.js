// (1) seccion de importanciones 
const axios = require('axios').default;
const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const API_SERVICIOS = {
    "1": 'https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado/habilidad/',
    "2": 'https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado/ultimoAporte/',
    "3": 'https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado/ultimaConstancia/',
    "4": 'https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado/deudas/',
    "5": 'https://ccpapurimac.sacpro.pe/intranet/public/api/colegio/actividades',
    "6": 'https://ccpapurimac.sacpro.pe/intranet/public/api/colegio/requisitos',
    "7": 'https://ccpapurimac.sacpro.pe/intranet/public/api/colegio/cuentasBancarias'
}
const API = 'https://cipapurimac.sacpro.pe/publico/estadocip/'

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let opciones1 = [
    "0:Consultar otro colegiado",
]

let opciones2 =[
    "1: Consultar habilidad",
    "2: Consultar último aporte",
    "3: Última constancia de habilidad",
    "4: Consultar deudas"
]

let opciones3 =[
    "5: Consultar proximas actividades",
    "6: Requisitos de colegiatura",
    "7: Cuentas bancarias",
    "8: Salir"
]

let opciones4 =[
    "1:Listar servicios",
    "2:Es todo, gracias"
]

const flowServicio1 = addKeyword("###_FLOW_SERVI1_###")
.addAnswer("indicanos tu numero de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic}) => {

        const respuesta = await axios(API_SERVICIOS["1"]+ctx.body) 
        
        let respuestaPersonalizada= respuesta.data.data

        await flowDynamic(respuestaPersonalizada)
        return;
    },
)

const flowServicio2 = addKeyword(["###_FLOW_SERVI2_###"])
.addAnswer("indicanos tu numero de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic}) => {

        const respuesta = await axios(API_SERVICIOS["2"]+ctx.body) 
        
        let respuestaPersonalizada= respuesta.data.data

        await flowDynamic(respuestaPersonalizada)
        return;
    },
)

const flowServicio3 = addKeyword(["###_FLOW_SERVI3_###"])
.addAnswer("indicanos tu numero de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic}) => {

        const respuesta = await axios(API_SERVICIOS["3"]+ctx.body) 
        
        let respuestaPersonalizada= respuesta.data.data

        await flowDynamic(respuestaPersonalizada)
        return;
    },
)

const flowServicio4 = addKeyword(["###_FLOW_SERVI4_###"])
.addAnswer("indicanos tu numero de colegiatura",
    {capture:true},
    
    async(ctx,{flowDynamic}) => {

        const respuesta = await axios(API_SERVICIOS["4"]+ctx.body) 
        
        let respuestaPersonalizada= respuesta.data.data

        await flowDynamic(respuestaPersonalizada)
        return;
    },
)

const flowServicio5 = addKeyword(["###_FLOW_SERVI5_###"])
.addAnswer("😎 Las próximas actividades son: ",null,
    async(ctx,{flowDynamic}) => {

        const respuesta = await axios(API_SERVICIOS["5"]) 
        console.log(respuesta)
        let respuestaPersonalizada= respuesta.data.data

        await flowDynamic(respuestaPersonalizada)
        return;
    },
)

const flowServicio6 = addKeyword(["###_FLOW_SERVI6_###"])
.addAnswer("🤗ingresa al siguiente enlace para conocer los requisitos de colegiatura 😉",null,
    async(ctx,{flowDynamic}) => {

        const respuesta = await axios(API_SERVICIOS["6"]) 

        let respuestaPersonalizada= respuesta.data.data

        await flowDynamic(respuestaPersonalizada)
        return;
    },
)

const flowServicio7 = addKeyword(["###_FLOW_SERVI7_###"])
.addAnswer("Estas son las cuentas bancarias :", null,
    async(ctx,{flowDynamic}) => {

        const respuesta = await axios(API_SERVICIOS["7"]) 
        console.log(API_SERVICIOS["7"])
        let respuestaPersonalizada= respuesta.data.data

        await flowDynamic(respuestaPersonalizada)
        
    },
)

const flowVacio = addKeyword("####_VACIOOOOOOO_###")
  .addAnswer("No te he entendido!🤔, porfavor escriba un numero de la lista", null, async (ctx, { gotoFlow }) => {
    return gotoFlow(flowBienvenida,2);
});

// const flowContinuar = addKeyword("###_continue???_###")
// .addAnswer(["¿Deseas continuar con tu atencion?"," 1. ✅Si","2. No 🛑",
// {capture:true},
//     async(ctx,{gotoFlow})=>{
//     if (ctx.body==='1'){
//         return gotoFlow(flowBienvenida,1)
//     }else if(ctx.body==='2') {
//         return gotoFlow(flowDespedida)
//     }
//     }
// ])

const flowDespedida = addKeyword("###_FLOW_SERVI7_###")
.addAnswer(["Gracias por contactar al Ilustre Colegio de Abogados de Apurimac😁"])
.addAnswer("Espero haberte ayudado con tu consulta 🫡🤗 *OlivIA* te decea un buen día. 😅",null,
    async(ctx, {endFlow})=>{
        return endFlow();
    }
)


const flowBienvenida =addKeyword(EVENTS.WELCOME)
.addAnswer(["🤖BIENVENIDO👌mi nombre es *OlivIA* 😘 gracias por contactar al Ilustre Colegio de Abogados de Apurimac"])
.addAnswer("¿Te gustaria conocer sobre los servicios que tenemos para ti?🧐")
.addAnswer((opciones2.concat(opciones3)),
{capture:true},
async (ctx, {gotoFlow}) => {
    if (ctx.body === '1') {
        return gotoFlow(flowServicio1)
    }else if (ctx.body === '2' ){
        return gotoFlow(flowServicio2)
    }else if (ctx.body === '3'){
        return gotoFlow(flowServicio3)
    }else if (ctx.body === '4'){
        return gotoFlow(flowServicio4)
    }else if (ctx.body === '5'){
        return gotoFlow(flowServicio5)
    }else if (ctx.body === '6'){
        return gotoFlow(flowServicio6)
    }else if (ctx.body === '7'){
        return gotoFlow(flowServicio7)
    }else if (ctx.body === '8'){
        return gotoFlow(flowDespedida)
    }else{
        return gotoFlow(flowVacio)
    } 
    
}
)

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (2) definimos funciones principales 
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([
        flowBienvenida,
        flowServicio1,
        flowServicio2,
        flowServicio3,
        flowServicio4,
        flowServicio5,
        flowServicio6,
        flowServicio7,
        flowDespedida,
        flowVacio,
        // flowContinuar
    ])
    const adapterProvider = createProvider(BaileysProvider)

 
    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
