// (1) seccion de importaciones 
const { createBot, createFlow } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const provider = require("./src/provider");
const database = require("./src/database");
const {
	flowServicio1,
	flowServicio2,
	flowServicio3,
	flowServicio4,
	flowServicio5,
	flowServicio6,
	flowServicio7,
	flowVacio,
	flowContinuar,
	flowDespedida,
	flowSecretariaVacio,
	flowBienvenida
} = require("./src/flow/servicios.flow");


// (2) definimos funciones principales 
const main = async () => {

    const misFlows = createFlow([
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

    
    createBot({
			flow: misFlows,
			provider: provider,
			database: database,
		});

    QRPortalWeb()
}

//(3) ejecutamos funcion principal
main()
