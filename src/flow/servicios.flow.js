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
	9: BASE_URL_API + "/api/colegio?servicio=horarioAtencion",
	10: BASE_URL_API + "/api/colegio?servicio=infoExtra",
	97: BASE_URL_API + "/api/agremiado?servicio=celular&codigo=",
	98: BASE_URL_API + "/api/chatbot",
	99: BASE_URL_API + "/api/chatbot_encuesta",
};

let opciones1 = ["👉 *0:* Consultar otro colegiado"];

let opciones2 = [
	"👉 *A:* Consultar habilitación", 			//1
	"👉 *B:* Consultar último aporte", 			//2
	"👉 *C:* Última constancia de habilitación",//3
	"👉 *D:* Consultar deudas", 				//4
];

let opciones3 = [
	"👉 *E:* Consultar próximas actividades",	//5
	"👉 *F:* Requisitos de colegiatura",		//6
	"👉 *G:* Cuentas bancarias",				//7
	"👉 *H:* Enviar voucher de pago",			//8
	"👉 *I:* Horarios de atención",				//9
	"👉 *J:* Contactar con secretaría",			
	"👉 *K:* Información CONILA 2025",			//10	
	"👉 *X:* Salir",							
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
const flowServicio1 = addKeyword(EVENTS.ACTION).addAnswer(
	process.env.TXT_DNI_COLEGIATURA,
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

const flowServicio2 = addKeyword(EVENTS.ACTION).addAnswer(
	process.env.TXT_DNI_COLEGIATURA,
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

const flowServicio3 = addKeyword(EVENTS.ACTION).addAnswer(
	process.env.TXT_DNI_COLEGIATURA,
	{ capture: true },
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios(
			"ultimaConstancia",
			ctx.body,
			"3"
		);

		await flowDynamic([{ body: respuestaPersonalizada[0] }]);

		if (
			!respuestaPersonalizada[0].includes("No pertenece a esta sede") &&
			!(
				respuestaPersonalizada[1] !== undefined &&
				respuestaPersonalizada[1].includes(
					"No tiene ninguna constancia de habilidad"
				)
			)
		) {
			await flowDynamic([{ body: "Estoy obteniendo el PDF...⏳" }]);
			await flowDynamic([
				{
					body: "adjuntando pdf",
					media: respuestaPersonalizada[1],
					delay: 10,
				},
			]);
		} else {
			if (
				respuestaPersonalizada[1] !== undefined &&
				respuestaPersonalizada[1].includes(
					"No tiene ninguna constancia de habilidad"
				)
			) {
				await flowDynamic(respuestaPersonalizada[1]);
			}
		}

		grabarLogChatBot("ultimaConstancia", ctx.from, ctx.body);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio4 = addKeyword(EVENTS.ACTION).addAnswer(
	process.env.TXT_DNI_COLEGIATURA,
	{ capture: true },

	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("deudas", ctx.body, "4");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("deudas", ctx.from, ctx.body);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio5 = addKeyword(EVENTS.ACTION).addAnswer(
	"😎 Las próximas actividades son: ",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("actividades", "", "5");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("actividades", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio6 = addKeyword(EVENTS.ACTION).addAnswer(
	"Ingresa al siguiente enlace para conocer los requisitos de colegiatura 😉",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("requisitos", "", "6");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("requisitos", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio7 = addKeyword(EVENTS.ACTION).addAnswer(
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

const flowServicio8 = addKeyword(EVENTS.ACTION).addAnswer(
	"Ingresa al siguiente enlace para enviar tu voucher 😉",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("enviarVoucher", "", "8");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("enviarVoucher", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio9 = addKeyword(EVENTS.ACTION).addAnswer(
	"Nuestros horarios de atención son: ",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("horarioAtencion", "", "9");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("horarioAtencion", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowServicio10 = addKeyword(EVENTS.ACTION).addAnswer(
	"Información CONILA 2025: ",
	null,
	async (ctx, { flowDynamic, gotoFlow }) => {
		let respuestaPersonalizada = await solicitudAxios("infoExtra", "", "10");

		await flowDynamic(respuestaPersonalizada);
		grabarLogChatBot("infoExtra", ctx.from);
		return gotoFlow(flowContinuar);
	}
);

const flowVacio = addKeyword(EVENTS.ACTION).addAnswer(
	"No te entendí🤔. Porfavor, selecciona una opción de la lista:",
	null,
	async (ctx, { gotoFlow }) => {
		return gotoFlow(flowBienvenida, 2);
	}
);

const flowContinuar = addKeyword(EVENTS.ACTION).addAnswer(
	["¿Deseas volver a consultarme?", "👉 *S:* ✅Si", "👉 *N:* 🛑No "],
	{ capture: true, delay: 3000 },
	async (ctx, { gotoFlow }) => {
		let respuesta = ctx.body.toLowerCase().trim();

		if (respuesta == "si" || respuesta == "s") {
			return gotoFlow(flowBienvenida, 1);
		}
		if (respuesta == "no" || respuesta == "n") {
			return gotoFlow(flowDespedida);
		}
		return gotoFlow(flowVacio);
	}
);

const flowDespedida = addKeyword(EVENTS.ACTION)
	.addAnswer([
		"Gracias por contactarnos, espero haberte ayudado con tu consulta",
	])
	.addAnswer([
		"Hasta pronto",
	])
	/*.addAnswer(
		["Si te fui util porfavor calificame con:", "👉 *S:* ✅Si", "👉 *N:* 🛑No"],
		{ capture: true },
		async (ctx, { flowDynamic }) => {
			let respuesta = ctx.body.toLowerCase().trim();
			let despedidaFinal = "";
			
			if (respuesta == "si" || respuesta == "s") {
				despedidaFinal =
					"Me alegra haber sido de ayuda. Nos vemos la próxima vez y que tengas un día excelente 😉";
				grabarLogChatBotEncuesta("si", ctx.from);
			}
			if (respuesta == "no" || respuesta == "n") {
				despedidaFinal =
					"Espero ser más útil pronto para ti, estoy en mejora continua. ¡Hasta la próxima! y que tengas un día maravilloso 😉";
				grabarLogChatBotEncuesta("no", ctx.from);
			}

			await flowDynamic(despedidaFinal);
		}
	)*/ 
	// Nuevo paso para hacer endFlow
	.addAnswer(null, null, async (ctx, { endFlow }) => {
		// No hacemos flowDynamic aquí
		return endFlow();
	});

const flowSecretariaVacio = addKeyword(EVENTS.ACTION)
	.addAnswer(
		"😉👌A continuación te contactaremos con nuestro personal, espere porfavor.."
	)
	.addAnswer(
		"Recuerda escribir *BOT* para volver a hablar con la asistente virtual"
	)
	.addAction({ capture: true }, async (ctx, { gotoFlow }) => {

		const botPalabras = ["bot", "bot ", " bot"];

		// Crear una expresión regular que busque cualquiera de las palabras clave
		const botRegex = new RegExp(`\\b(${botPalabras.join("|")})\\b`, "i");

		// Procesar el texto de entrada que envió el usuario
		const textoUsuario = ctx.body.toLowerCase().trim();

		// Verificar si alguna de las palabras clave está presente
		if (botRegex.test(textoUsuario)) {
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

			//ini controlando palabras de despedida
			const despedidaPalabras = [
				"GRACIAS",
				"BYE",
				"ADIOS",
				"CHAO",
				"CHAU",
				"SALIR",
				"EXIT",
				"HASTA LUEGO",
				"HASTA PRONTO",
				"HASTA LA VISTA",
				"NOS VEMOS",
				"HASTA OTRA",
				"HASTA NUNCA",
				"HASTA SIEMPRE",
				"HASTA LA PROXIMA",
				"HASTA LUEGUITO",
			];

			// Crear una expresión regular que busque cualquiera de las palabras clave
			const despedidaRegex = new RegExp(
				`\\b(${despedidaPalabras.join("|")})\\b`,
				"i"
			);

			// Procesar el texto de entrada que envió el usuario
			const textoUsuario = ctx.body.trim().toUpperCase();

			// Verificar si alguna de las palabras clave está presente
			if (despedidaRegex.test(textoUsuario)) {
				return gotoFlow(flowDespedida);
			}
			//fin controlando palabras de despedida

			//resumen de servicios a seleccionar
			let resumenServicios = {
				A: flowServicio1,
				B: flowServicio2,
				C: flowServicio3,
				D: flowServicio4,
				E: flowServicio5,
				F: flowServicio6,
				G: flowServicio7,
				H: flowServicio8,
				I: flowServicio9,
				K: flowServicio10,
				X: flowDespedida,
			};

			if (resumenServicios.hasOwnProperty(textoUsuario)) {
				return gotoFlow(resumenServicios[textoUsuario]);
			} else if (textoUsuario == "J") {
				grabarLogChatBot("Contactar secretaria", ctx.from);
				return gotoFlow(flowSecretariaVacio);
			} else {
				return gotoFlow(flowVacio);
			}
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
	flowServicio9,
	flowServicio10,
	flowVacio,
	flowContinuar,
	flowDespedida,
	flowSecretariaVacio,
	flowBienvenida,
};
