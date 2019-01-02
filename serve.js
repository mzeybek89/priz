const http 	   		 = require('http');
const querystring 	 = require('querystring');
const {run} 	 	 = require('./tplink');
const ping 			 = require('ping');
const hosts			 = ['192.168.1.10'];


const server = http.createServer((req,res)=>{
	console.log('Bir ' + req.method + ' isteğinde bulunuldu');
	res.writeHead(200,{'content-type':'text/html; charset=utf-8'});
	console.log("IP ==> "+req.connection.remoteAddress);
	console.log("URL ==> " + req.url);

	if(req.method==="POST"){  // sadece post isteklere izin ver
		if(req.url==="/zeybek"){  //sadece /zeybek url adresine izin ver

			hosts.forEach(function(host){  //ping atılacak hostları tara
				ping.sys.probe(host, function(isAlive){ //ping sonucu
					var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
					console.log(msg);

					run(isAlive).then((data)=>{  //isAlive true ise run() fonksiyonu sadece manuel kontrol için bilgi verir. Cihaza ping atılamazsa servera restart atar.
						res.end(data);
					});
					
				});
			});
		}
	}	
	
});

server.listen(3000);
