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

const TOKEN_API_SACPRO = "86252fde-da3b-4c0b-b336-53aca7a7148e";
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
			Authorization: `Bearer ${TOKEN_API_SACPRO}`,
		};

    const miParams = {
        servicio: servicioValor,
        codigo: codigoValor,
    };

    let dataEnvio = { headers: miHeaders, params: miParams }

    let url = API_SERVICIOS[codigoUrlBaseServicio] + codigoValor; 

    const respuesta = await axios.get(url, dataEnvio)
                        .then(response => {
                            return response.data;
                        })

    return respuesta.data
}

function grabarLogChatBot(servicioValor="", celularValor="",  colegioValor=""){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN_API_SACPRO}`);

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

function grabarLogChatBotEncuesta(fuiUtil="", celularValor=""){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${TOKEN_API_SACPRO}`);

    var formdata = new FormData();
    formdata.append("fui_util", fuiUtil);
    formdata.append("celular", celularValor);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch(API_SERVICIOS[9], requestOptions)
}

const flowServicio1 = addKeyword("###_FLOW_SERVI1_###")
.addAnswer(
    "indícanos tu número de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("habilidad",ctx.body, "1" )

        await flowDynamic(respuestaPersonalizada)
        grabarLogChatBot("habilidad", ctx.from, ctx.body)
        return gotoFlow(flowContinuar)
    },
)

const flowServicio2 = addKeyword(["###_FLOW_SERVI2_###"])
.addAnswer("indícanos tu número de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("ultimoAporte",ctx.body, "2" )


        await flowDynamic(respuestaPersonalizada)
        grabarLogChatBot("ultimoAporte", ctx.from, ctx.body)
        return gotoFlow(flowContinuar)
        
        
    },
)

const flowServicio3 = addKeyword(["###_FLOW_SERVI3_###"])
.addAnswer("indícanos tu número de colegiatura",
    {capture:true},
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("ultimaConstancia",ctx.body, "3" )

        await flowDynamic(respuestaPersonalizada)
        grabarLogChatBot("ultimaConstancia", ctx.from, ctx.body)
        return gotoFlow(flowContinuar)
        
    },
)

const flowServicio4 = addKeyword(["###_FLOW_SERVI4_###"])
.addAnswer("indícanos tu número de colegiatura",
    {capture:true},
    
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("deudas",ctx.body, "4" )

        await flowDynamic(respuestaPersonalizada)
        grabarLogChatBot("deudas", ctx.from, ctx.body)
        return gotoFlow(flowContinuar)
    },
)

const flowServicio5 = addKeyword(["###_FLOW_SERVI5_###"])
.addAnswer("😎 Las próximas actividades son: ",null,
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("actividades","", "5" )

        await flowDynamic(respuestaPersonalizada)
        grabarLogChatBot("actividades", ctx.from)
        return gotoFlow(flowContinuar)
    },
)

const flowServicio6 = addKeyword(["###_FLOW_SERVI6_###"])
.addAnswer("🤗ingresa al siguiente enlace para conocer los requisitos de colegiatura 😉",null,
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("requisitos","", "6" )
        

        await flowDynamic(respuestaPersonalizada)
        grabarLogChatBot("requisitos", ctx.from)
        return gotoFlow(flowContinuar)
    },
)

const flowServicio7 = addKeyword(["###_FLOW_SERVI7_###"])
.addAnswer("Estas son las cuentas bancarias :", null,
    async(ctx,{flowDynamic,gotoFlow}) => {

        let respuestaPersonalizada = await solicitudAxios("cuentasBancarias","", "7" )

        await flowDynamic(respuestaPersonalizada)
        grabarLogChatBot("cuentasBancarias", ctx.from)
        return gotoFlow(flowContinuar)
        
    },
)

const flowVacio = addKeyword("####_VACIOOOOOOO_###")
  .addAnswer(
    "No te he entendido!🤔, porfavor escriba un numero de la lista", 
    null, 
    async (ctx, { gotoFlow }) => {
    return gotoFlow(flowBienvenida,2);
});

const flowContinuar = addKeyword("###_continue_###")
.addAnswer(
    ["¿Deseas continuar con tu atencion?","1. ✅Si","2. 🛑No "],
    {capture:true, delay:3000},
    async(ctx,{gotoFlow})=>{
        if (ctx.body=='1'){
            return gotoFlow(flowBienvenida,1)
        }        
        if(ctx.body=='2') {
            return gotoFlow(flowDespedida)
        }
        return gotoFlow(flowVacio)
    },
)

const flowDespedida = addKeyword("###_FLOW_SERVI7_###")
	.addAnswer([
		"Gracias por contactarnos, espero haberte ayudado con tu consulta",
	])
	.addAnswer(
		"Si te fui util, escribe *Si* o de lo contrario *No*",
		{ capture: true },
		async (ctx, { endFlow }) => {

            let respuesta = ctx.body.toLowerCase().trim();
            if (respuesta == "si") {
                grabarLogChatBotEncuesta(ctx.body, ctx.from, ctx.body);
            }
            if (respuesta == "no") {
                grabarLogChatBotEncuesta(ctx.body, ctx.from, ctx.body);
            }

            //aqui agregar flowDynamic con texto ("Listo, hasta la próxima y que tengas un buen día 😉") y luego que se finalice con endFlow
			return endFlow();
		}
	);



const flowSecretariaVacio = addKeyword("___###____")
.addAnswer("😉👌A continuación te contactaremos con nuestro personal, espere porfavor..")
.addAnswer("Recuerda escribir *BOT* para volver a hablar con *GremIA*")
.addAction({ capture: true }, async (ctx, { gotoFlow})=> {
    if (ctx.body.toLowerCase().trim() == "BOT") {
			return gotoFlow(flowBienvenida);
		} else {
			return gotoFlow(flowSecretariaVacio, 2);
		}
}
)



const flowBienvenida = addKeyword([EVENTS.WELCOME])
	.addAnswer([
		"BIENVENIDO👌 soy *GremIA*🤖 gracias por contactar al Colegio de Contadores Públicos de Apurímac",
	])
	.addAnswer(
		"Tenemos los siguientes servicios para ti, escribe el número que desees 🫡"
	)
	.addAnswer(
		opciones2.concat(opciones3),
		{ capture: true },
		async (ctx, { gotoFlow }) => {
			if (ctx.body === "1") {
				return gotoFlow(flowServicio1);
			} else if (ctx.body === "2") {
				return gotoFlow(flowServicio2);
			} else if (ctx.body === "3") {
				return gotoFlow(flowServicio3);
			} else if (ctx.body === "4") {
				return gotoFlow(flowServicio4);
			} else if (ctx.body === "5") {
				return gotoFlow(flowServicio5);
			} else if (ctx.body === "6") {
				return gotoFlow(flowServicio6);
			} else if (ctx.body === "7") {
				return gotoFlow(flowServicio7);
			} else if (ctx.body === "8") {
				grabarLogChatBot("Atención secretaria", ctx.from);
				return gotoFlow(flowSecretariaVacio);
			} else if (ctx.body === "9") {
				return gotoFlow(flowDespedida);
			} else {
				return gotoFlow(flowVacio);
			}
		}
	);

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
