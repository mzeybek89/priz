	const tplink = require('tplink-cloud-api');
	const IFTTT = require('node-ifttt-maker');
	const ifttt = new IFTTT('your_ifttt_key');
	const event = 'monitor-1';

	
	let params;
	

	async function run(isAlive){

		if(isAlive){  //eğer servera ulaşılabiliyorsa cihazı kapatma. Manuel kontrol edilmesi için bilgi ver...
			params = {'value1': 'Cihaz Açık Manuel kontrol Gerekiyor :)'}

			ifttt
			.request({ event, params })
			.then((response) => {})
			.catch((err) => {});

			return false;
		}

		let myTPLink = await tplink.login('your_email_adress', 'your_password');
		let deviceList = await myTPLink.getDeviceList();
		//console.log(deviceList);
		
		   // device list döner
		//deviceList.map((dev)=>{			
		//	const deviceName = dev.deviceName;
		//	const status 	 = dev.status;				
		//});
		
		console.log('Cihaza Erişiliyor');
		const myPlug = myTPLink.getHS100("Plug"); //Cihaza Eriş
		
		console.log('Cihaz Kapanıyor');
		//await myPlug.powerOff(); //Cihazı Kapat

		params = {'value1': 'Cihaz Kapatılıyor, 60 sn bekletilecek'}

		ifttt
		.request({ event, params })
		.then((response) => {})
		.catch((err) => {});
		
		console.log('60 sn Bekleniyor');
		await new Promise (resolve => {
			setTimeout(resolve, 60000);
		});
		
		console.log('Cihaz Açılıyor');
		//await myPlug.powerOn();  //Cihazı Aç

		console.log('Cihazın durumu bilgisi alınıyor.');
		const status   = await myPlug.get_relay_state();  //cihazın son durumunu al
		
		console.log('Cihazın durumu:'+status);
		
		if (status==1)
		{
			params = {'value1': 'Sistem Yeniden Başlatıldı ...'}
		}
		else
		{
			params = {'value1': 'Sistem Başlatılırken HATA Oluştu'}
		}
		
		ifttt
		.request({ event, params })
		.then((response) => {})
		.catch((err) => {});
		
		return status.toString();
		
		
		
	}

	/*run().then((data)=>{
		return data;
	});*/

	
	
	module.exports.run = run;
