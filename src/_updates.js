function checkUpdates(){
	var http = require('http'),
		fs = require('fs')

	// Check version
	fs.readFile('package.json', 'utf8', function(err, data){
		var version = JSON.parse(data).version,
			versionSplit = version.split('-')

		// Check most current version (check both version and os)

		var xmlhttp = new XMLHttpRequest()
		var url = 'http://www.smartergames.com/bin/comicbookviewier/' + versionSplit[0] + '/'

		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var obj = JSON.parse(xmlhttp.responseText)


				if(obj.version === version){
					return alert('Your version of Smarter Comic Book Viewer is up to date!')
				}


				// If redirect link, open up browser to that link
				if(obj.link){
					gui.Shell.openExternal(obj.link)
					gui.App.quit()
				}
				else if(obj.installer){
					if(obj.installer.indexOf('http') === -1){
						obj.installer = url + obj.installer
					}



					var request = http.get(obj.installer, function(res){
						var data = ''
						res.setEncoding('binary')

						var rln = 0,
							ln = res.headers['content-length']


						res.on('data', function(chunk){
							rln+=chunk.length
							console.log(Math.round(rln/ln*100))
							//update UI

							data += chunk
						})  
						res.on('end', function(){               
							console.log('File saved.')

							var fileName = obj.installer.split(regslashes).pop()

							fs.writeFile(path + 'temp/' + fileName, data, 'binary', function(err){
								if(err){
									console.log(err)
									alert('Something went wrong downloading the latest version. Please try again later!')
								}
								else{
									gui.Shell.openItem(path + 'temp/' + fileName)
									gui.App.quit()
								}
							})
						})  
					})




				}
			}
		}
		xmlhttp.open("GET", url + 'package.json', true)
		xmlhttp.send()


	})

}