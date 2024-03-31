//=============================================================================
// INI IMPORTACIONES
//=============================================================================
require("dotenv").config();

const {
	addKeyword,
	EVENTS,
} = require("@bot-whatsapp/bot");

const axios = require("axios").default;
// FIN IMPORTACIONES


//=============================================================================
// INI INICIALIZANDO VARIABLES
//=============================================================================
const TOKEN_API_SACPRO = process.env.TOKEN_API_SACPRO;
const BASE_URL_API = process.env.BASE_URL_API;

const API_SERVICIOS = {
	1: BASE_URL_API + "/api/agremiado?servicio=habilidad&codigo=",
	2: BASE_URL_API + "/api/agremiado?servicio=ultimoAporte&codigo=",
	3: BASE_URL_API + "/api/agremiado?servicio=ultimaConstancia&codigo=",
	4: BASE_URL_API + "/api/agremiado?servicio=deudas&codigo=",
	5: BASE_URL_API + "/api/colegio?servicio=actividades",
	6: BASE_URL_API + "/api/colegio?servicio=requisitos",
	7: BASE_URL_API + "/api/colegio?servicio=cuentasBancarias",
	8: BASE_URL_API + "/api/colegio?servicio=enviarVoucher",
	97: BASE_URL_API + "/api/agremiado?servicio=celular&codigo=",
	98: BASE_URL_API + "/api/chatbot",
	99: BASE_URL_API + "/api/chatbot_encuesta"
};

let opciones1 = ["👉 *0:* Consultar otro colegiado"];

let opciones2 = [
	"👉 *A:* Consultar habilidad",				//1
	"👉 *B:* Consultar último aporte",			//2
	"👉 *C:* Última constancia de habilidad",	//3
	"👉 *D:* Consultar deudas",					//4
];

let opciones3 = [
	"👉 *E:* Consultar próximas actividades",	//5
	"👉 *F:* Requisitos de colegiatura",			//6
	"👉 *G:* Cuentas bancarias",					//7
	"👉 *H:* Enviar voucher de pago",			//8
	"👉 *I:* Contactar con secretaría",			//9
	"👉 *J:* Salir",								//10
];
//FIN INICIALIZANDO VARIABLES


//=============================================================================
//INI DEFINIENDO FUNCIONES
//=============================================================================
async function solicitudAxios(
	servicioValor = "",
	codigoValor = "",
	codigoUrlBaseServicio = ""
) {
	const miHeaders = {
		Authorization: `Bearer ${TOKEN_API_SACPRO}`,
	};

	const miParams = {
		servicio: servicioValor,
		codigo: codigoValor,
	};

	let dataEnvio = { headers: miHeaders, params: miParams };

	let url = API_SERVICIOS[codigoUrlBaseServicio] + codigoValor;

	const respuesta = await axios.get(url, dataEnvio).then((response) => {
		return response.data;
	});

	return respuesta.data;
}

function grabarLogChatBot(
	servicioValor = "",
	celularValor = "",
	colegioValor = ""
) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${TOKEN_API_SACPRO}`);

	var formdata = new FormData();
	formdata.append("celular", celularValor);
	formdata.append("servicio", servicioValor);
	formdata.append("colegio", colegioValor);

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: formdata,
		redirect: "follow",
	};

	fetch(API_SERVICIOS[98], requestOptions);
}

function grabarLogChatBotEncuesta(fuiUtil = "", celularValor = "") {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${TOKEN_API_SACPRO}`);

	var formdata = new FormData();
	formdata.append("fui_util", fuiUtil);
	formdata.append("celular", celularValor);

	var requestOptions = {
		method: "POST",
		headers: myHeaders,
		body: formdata,
		redirect: "follow",
	};

	fetch(API_SERVICIOS[99], requestOptions);
}
//FIN DEFINIENDO FUNCIONES



//=============================================================================
// INI SERVICIOS
//=============================================================================
const flowServicio1 = addKeyword("###_FLOW_SERVI1_###").addAnswer(
	"Bríndeme su número de colegiatura",
	{ capture: true },
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios(
			"habilidad",
			ctx.body,
			"1"
		);

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("habilidad", ctx.from, ctx.body);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio2 = addKeyword(["###_FLOW_SERVI2_###"]).addAnswer(
	"Bríndeme su número de colegiatura",
	{ capture: true },
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios(
			"ultimoAporte",
			ctx.body,
			"2"
		);

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("ultimoAporte", ctx.from, ctx.body);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio3 = addKeyword(["###_FLOW_SERVI3_###"]).addAnswer(
	"Bríndeme su número de colegiatura",
	{ capture: true },
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios(
			"ultimaConstancia",
			ctx.body,
			"3"
		);
		
		await flowDynamic([{ body: respuestaPersonalizada[0] }]);

		if (!respuestaPersonalizada[0].includes("No pertenece a esta sede")) {
			await flowDynamic([{ body: "Estoy obteniendo el PDF...⏳" }]);
			await flowDynamic([
				{
					body: "adjuntando pdf",
					media: respuestaPersonalizada[1],
					delay: 10,
				},
			]);
		}
			
		grabarLogChatBot("ultimaConstancia", ctx.from, ctx.body);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio4 = addKeyword(["###_FLOW_SERVI4_###"]).addAnswer(
	"Bríndeme su número de colegiatura",
	{ capture: true },

	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("deudas", ctx.body, "4");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("deudas", ctx.from, ctx.body);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio5 = addKeyword(["###_FLOW_SERVI5_###"]).addAnswer(
	"😎 Las próximas actividades son: ",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("actividades", "", "5");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("actividades", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio6 = addKeyword(["###_FLOW_SERVI6_###"]).addAnswer(
	"Ingresa al siguiente enlace para conocer los requisitos de colegiatura 😉",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("requisitos", "", "6");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("requisitos", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio7 = addKeyword(["###_FLOW_SERVI7_###"]).addAnswer(
	"Estas son las cuentas bancarias :",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios(
			"cuentasBancarias",
			"",
			"7"
		);

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("cuentasBancarias", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio8 = addKeyword(["###_FLOW_SERVI8_###"]).addAnswer(
	"Ingresa al siguiente enlace para enviar tu voucher 😉",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("enviarVoucher", "", "8");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("enviarVoucher", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowVacio = addKeyword("####_VACIOOOOOOO_###").addAnswer(
	"No te entendí🤔. Porfavor, selecciona un número de la lista:",
	null,
	async (ctx, { gotoFlow }) => {
		return gotoFlow(flowBienvenida, 2);
	}
);

const flowContinuar = addKeyword("###_continue_###").addAnswer(
	["¿Deseas volver a consultarme?", "1. ✅Si", "2. 🛑No "],
	{ capture: true, delay: 3000 },
	async (ctx, { gotoFlow }) => {
		if (ctx.body == "1") {
			return gotoFlow(flowBienvenida, 1);
		}
		if (ctx.body == "2") {
			return gotoFlow(flowDespedida);
		}
		return gotoFlow(flowVacio);
	}
);

const flowDespedida = addKeyword("###_FLOW_SERVI7_###")
	.addAnswer([
		"Gracias por contactarnos, espero haberte ayudado con tu consulta",
	])
	.addAnswer(
		["Si te fui util calificame con:", "1: ✅Si", "2: 🛑No"],
		{ capture: true },
		async (ctx, { endFlow, flowDynamic }) => {
			let respuesta = ctx.body.toLowerCase().trim();
			let despedidaFinal = "";
			if (respuesta == "si" || respuesta == "1") {
				despedidaFinal =
					"Me da gusto haberte ayudado 😌. Hasta la próxima! y que tengas un día maravilloso 😉";
				grabarLogChatBotEncuesta("si", ctx.from);
			}
			if (respuesta == "no" || respuesta == "2") {
				despedidaFinal =
					"Espero ser más útil pronto para ti, estoy en mejora continua. Hasta la próxima! y que tengas un día maravilloso 😉";
				grabarLogChatBotEncuesta("no", ctx.from);
			}

			await flowDynamic(despedidaFinal);

			return endFlow();
		}
	);

const flowSecretariaVacio = addKeyword("___###____")
	.addAnswer(
		"😉👌A continuación te contactaremos con nuestro personal, espere porfavor.."
	)
	.addAnswer("Recuerda escribir *BOT* para volver a hablar la asistente virtual")
	.addAction({ capture: true }, async (ctx, { gotoFlow }) => {
		if (ctx.body.toLowerCase().trim() == "bot") {
			return gotoFlow(flowBienvenida);
		} else {
			return gotoFlow(flowSecretariaVacio, 2);
		}
	});

const flowBienvenida = addKeyword([EVENTS.WELCOME])
	.addAnswer([
		"¡Hola! Soy la asistente virtual del " + process.env.NOMBRE_CLIENTE + " 🤖",
	])
	.addAnswer(
		["Elige una de estas alternativas para poder ayudarte:"].concat(
			opciones2.concat(opciones3)
		),
		{ capture: true },
		async (ctx, { gotoFlow }) => {
			
			let opcionSeleccionada = ctx.body.toUpperCase().trim();

			let resumenServicios = {
				A: flowServicio1,
				B: flowServicio2,
				C: flowServicio3,
				D: flowServicio4,
				E: flowServicio5,
				F: flowServicio6,
				G: flowServicio7,
				H: flowServicio8,
				I: () => {
					grabarLogChatBot("Contactar secretaria", ctx.from);
					return gotoFlow(flowSecretariaVacio);
				},
				J: flowDespedida
			};

			if(resumenServicios.hasOwnProperty(opcionSeleccionada)){
				return gotoFlow(resumenServicios[opcionSeleccionada]);
			}else{
				return gotoFlow(flowVacio);
			}

			// if (opcionSeleccionada === "1") {
			// 	return gotoFlow(resumenServicios.A);
			// } else if (opcionSeleccionada === "2") {
			// 	return gotoFlow(resumenServicios.B);
			// } else if (opcionSeleccionada === "3") {
			// 	return gotoFlow(resumenServicios.C);
			// } else if (opcionSeleccionada === "4") {
			// 	return gotoFlow(resumenServicios.D);
			// } else if (opcionSeleccionada === "5") {
			// 	return gotoFlow(resumenServicios.E);
			// } else if (opcionSeleccionada === "6") {
			// 	return gotoFlow(resumenServicios.F);
			// } else if (opcionSeleccionada === "7") {
			// 	return gotoFlow(resumenServicios.G);
			// } else if (opcionSeleccionada === "8") {
			// 	return gotoFlow(resumenServicios.H);
			// } else if (opcionSeleccionada === "9") {
			// 	grabarLogChatBot("Contactar secretaria", ctx.from);
			// 	return gotoFlow(flowSecretariaVacio);
			// } else if (opcionSeleccionada === "10") {
			// 	return gotoFlow(flowDespedida);
			// } else {
			// 	return gotoFlow(flowVacio);
			// }
		}
	);

//FIN SERVICIOS;


module.exports = {
	flowServicio1,
	flowServicio2,
	flowServicio3,
	flowServicio4,
	flowServicio5,
	flowServicio6,
	flowServicio7,
	flowServicio8,
	flowVacio,
	flowContinuar,
	flowDespedida,
	flowSecretariaVacio,
	flowBienvenida,
};
