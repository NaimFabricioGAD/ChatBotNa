// (1) seccion de importanciones 
const axios = require('axios').default;
const { createBot, createProvider, createFlow, addKeyword, EVENTS, addAnswer } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const API_SERVICIOS = {
	1: "https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado?servicio=habilidad&codigo=",
	2: "https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado?servicio=ultimoAporte&codigo=",
	3: "https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado?servicio=ultimaConstancia&codigo=",
	4: "https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado?servicio=deudas&codigo=",
	5: "https://ccpapurimac.sacpro.pe/intranet/public/api/colegio?servicio=actividades",
	6: "https://ccpapurimac.sacpro.pe/intranet/public/api/colegio?servicio=requisitos",
	7: "https://ccpapurimac.sacpro.pe/intranet/public/api/colegio?servicio=cuentasBancarias",
	8: "https://ccpapurimac.sacpro.pe/intranet/public/api/chatbot",
	9: "https://ccpapurimac.sacpro.pe/intranet/public/api/chatbot_encuesta",
	10: "https://ccpapurimac.sacpro.pe/intranet/public/api/agremiado?servicio=celular&codigo="
};


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
    "8: Contactar con humano",
    "9: Salir"
]

async function solicitudAxios(servicioValor="",codigoValor="", codigoUrlBaseServicio="" ){

    const miHeaders = {
        'Authorization': 'Bearer 86252fde-da3b-4c0b-b336-53aca7a7148e'
    };

    const miParams = {
        servicio: servicioValor,
        codigo: codigoValor,
    };

    let dataEnvio = { headers: miHeaders, params: miParams }

    let url = API_SERVICIOS[codigoUrlBaseServicio] + codigoValor; 

    const respuesta = await axios.get(url, dataEnvio)
                        .then(response => {
                            console.log(response.data)
                            return response.data;
                        })

    return respuesta.data
}

function logChatBot(servicioValor="", celularValor="",  colegioValor=""){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer 86252fde-da3b-4c0b-b336-53aca7a7148e");

    var formdata = new FormData();
    formdata.append("celular", celularValor);
    formdata.append("servicio", servicioValor);
    formdata.append("colegio", colegioValor);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch(API_SERVICIOS[8], requestOptions)
}

const flowServicio1 = addKeyword("###_FLOW_SERVI1_###")
.addAnswer("indicanos tu numero de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("habilidad",ctx.body, "1" )

        await flowDynamic(respuestaPersonalizada)
        logChatBot("habilidad", ctx.from, ctx.body)
        return gotoFlow(flowContinuar)
    },
)

const flowServicio2 = addKeyword(["###_FLOW_SERVI2_###"])
.addAnswer("indicanos tu numero de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("ultimoAporte",ctx.body, "2" )


        await flowDynamic(respuestaPersonalizada)
        logChatBot("ultimoAporte", ctx.from, ctx.body)
        return gotoFlow(flowContinuar)
        
        
    },
)

const flowServicio3 = addKeyword(["###_FLOW_SERVI3_###"])
.addAnswer("indicanos tu numero de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("ultimaConstancia",ctx.body, "3" )

        await flowDynamic(respuestaPersonalizada)
        logChatBot("ultimaConstancia", ctx.from, ctx.body)
        return gotoFlow(flowContinuar)
        
    },
)

const flowServicio4 = addKeyword(["###_FLOW_SERVI4_###"])
.addAnswer("indicanos tu numero de colegiatura",
    {capture:true},
    
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("deudas",ctx.body, "4" )

        await flowDynamic(respuestaPersonalizada)
        logChatBot("deudas", ctx.from, ctx.body)
        return gotoFlow(flowContinuar)
    },
)

const flowServicio5 = addKeyword(["###_FLOW_SERVI5_###"])
.addAnswer("😎 Las próximas actividades son: ",null,
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("actividades","", "5" )

        await flowDynamic(respuestaPersonalizada)
        logChatBot("actividades", ctx.from)
        return gotoFlow(flowContinuar)
    },
)

const flowServicio6 = addKeyword(["###_FLOW_SERVI6_###"])
.addAnswer("🤗ingresa al siguiente enlace para conocer los requisitos de colegiatura 😉",null,
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("requisitos","", "6" )
        

        await flowDynamic(respuestaPersonalizada)
        logChatBot("requisitos", ctx.from)
        return gotoFlow(flowContinuar)
    },
)

const flowServicio7 = addKeyword(["###_FLOW_SERVI7_###"])
.addAnswer("Estas son las cuentas bancarias :", null,
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("cuentasBancarias","", "7" )

        await flowDynamic(respuestaPersonalizada)
        logChatBot("cuentasBancarias", ctx.from)
        return gotoFlow(flowContinuar)
        
    },
)

const flowVacio = addKeyword("####_VACIOOOOOOO_###")
  .addAnswer("No te he entendido!🤔, porfavor escriba un numero de la lista", null, async (ctx, { gotoFlow }) => {
    return gotoFlow(flowBienvenida,2);
});

const flowContinuar = addKeyword("###_continue_###")
.addAnswer(
    ["¿Deseas continuar con tu atencion?","1. ✅Si","2. 🛑No "],
    {capture:true, delay:3000},
    async(ctx,{gotoFlow})=>{
     if (ctx.body=='1'){
        return gotoFlow(flowBienvenida,1)
        }else if(ctx.body=='2') {
            return gotoFlow(flowDespedida)
        }
    },
)

const flowDespedida = addKeyword("###_FLOW_SERVI7_###")
.addAnswer(["Gracias por contactar al Ilustre Colegio de Abogados de Apurimac😁"])
.addAnswer("Espero haberte ayudado con tu consulta 🫡🤗 *GremIA* te decea un buen día. 😅",null,
    async(ctx, {endFlow})=>{
        return endFlow();
    }
)

const flowSecretariaVacio = addKeyword("___###____")
.addAnswer("😉👌A continuacion te contactaremos con nuestro personal, espere porfavor")
.addAnswer("recuerda escribir *inicializar* para volver a hablar con *GremIA*")
.addAction({ capture: true }, async (ctx, { gotoFlow})=> {
    if((ctx.body).toLowerCase().trim()=="inicializar"){
        return gotoFlow(flowBienvenida);
    }else{
        return gotoFlow(flowSecretariaVacio,2)
    }
}
)



const flowBienvenida =addKeyword([EVENTS.WELCOME,])
.addAnswer(["🤖BIENVENIDO👌mi nombre es *GremiIA* 😘 gracias por contactar al Ilustre Colegio de Abogados de Apurimac"])
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
        logChatBot("Atención secretaria", ctx.from)
        return gotoFlow(flowSecretariaVacio)
    }else if (ctx.body === '9') {
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
        flowSecretariaVacio,
        flowContinuar
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
