var fs = require('fs'),
	exec = require('child_process').exec,
	os = require('os').platform()


// Regex
var regspace = / /g,
	regext = /\.([0-9a-z]+$)/i,
	regslashes = /[\\\/]/g

// Storage variables & permenant settings
var filetypes = ['zip', 'rar', 'cbz', 'cbr', 'cb7', '7z', 'cbt', 'tar', 'cba', 'ace'],
	imgtypes = ['jpg', 'jpeg', 'gif', 'png', 'bmp', 'svg', 'tif'],
	path = process.execPath.replace(regslashes, '/').replace(/[^\/]*$/, ''),
	safepath

if(os === 'win32'){
	safepath = path.replace(regspace, "\\ ")
}
else{
	path = path.split('/')
	path.pop()
	path.pop()
	path.pop()
	path.pop()
	path.pop()
	path = path.join('/') + '/Resources/app.nw/'
	safepath = path.replace(regspace, "\\ ")
}


// Delete directory and contents
function rmdir(dir, clbk, next){
	if(clbk === null || typeof clbk == 'undefined')
		clbk = function(err){}
	fs.readdir(dir, function(err, files) {
		if(err) return clbk(err)
		!function rmFile(err){
			if (err) return clbk(err)
			var filename = files.shift()
			if (filename === null || typeof filename == 'undefined'){
				if(next) fs.rmdir(dir, clbk)
				else clbk()
				return
			}
			var file = dir+'/'+filename;
			fs.lstat(file, function(err, stat){
				if (err) return clbk(err)
				if (stat.isDirectory())
					rmdir(file, rmFile, true)
				else
					fs.unlink(file, rmFile)
			})
		}()
	})
}


// Lists all supported files in a directory
function recurlist(dir, supported, done, recur) {
	if(!dir){
		return
	}
	var results = [],
		temp
	fs.readdir(dir, function(err, list) {
		if (err){
			return console.log(err)
		}
		var pending = list.length
		if (!pending) return done(results.sort(sorter))
		list.forEach(function(file) {
			file = dir + '/' + file.replace(regslashes, '/')
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					if(recur){
						recurlist(file, supported, function(res) {
							results = results.concat(res)
							if (!--pending) done(results)
						}, recur)
					}
					else if (!--pending) done(results.sort(sorter))
				}
				else{
					temp = file.match(regext)
					if(temp && supported.indexOf(temp[1].toLowerCase()) !== -1) results.push(file)
					if (!--pending) done(results.sort(sorter))
				}
			})
		})
	})
}







// Unpack to temp
function unpack(f, cb){
	var ext = f.split('.')
	ext = ext[ext.length - 1].toLowerCase()
	var str = f.split('.')
	str = str[str.length - 1].toLowerCase()

	// Unpacking method will change depending on type and os
	if (os == 'win32'){
		if (ext === 'rar' || ext === 'cbr') {
			str = '"' + path + 'dist/exec/win/UnRAR.exe" x ' + f + ' *.' + imgtypes.join(' *.') + ' ' + path + '/temp -y -r'
		}
		else {
			str = '"' + path + 'dist/exec/win/7za.exe" e ' + f + ' *.' + imgtypes.join(' *.') + ' -o' + path + '/temp -y -r'
		}
	}
	else{
		// Requires permissions to be set first
		if (str.indexOf('r') > -1) {
			//str = 'chmod 755 ' + safepath + 'exec/mac/rar/unrar'
			str = 'chmod 755 ' + safepath + 'dist/exec/mac/unar/unar'
			exec(str, function(err, stdout, stderr){
				if (stderr){
					error('Unsupported or corrupted file.')
					return console.log(stderr)
				}
				else if (err){
					error('Unsupported or corrupted file.')
					return console.log(err)
				}
				else {
					//str = safepath + 'exec/mac/rar/unrar x "' + f + '" *.' + imgtypes.join(' *.') + ' ' + safepath + '/temp'
					str = safepath + 'dist/exec/mac/unar/unar "' + f + '" *.' + imgtypes.join(' *.') + ' -o ' + safepath + '/temp'
					exec(str, function (err, stdout, stderr) {
						if (stderr){
							error('Unsupported or corrupted file.')
							return console.log(stderr)
						}
						else if (err){
							error('Unsupported or corrupted file.')
							return console.log(err)
						}
						else {
							recurlist('temp', imgtypes, cb, 1)
						}
					});
				}
			});

			return;
		}
		else {
			str = 'unzip "' + f + '" -d ' + safepath + '/temp';
		}
	}

	exec(str, function (err, stdout, stderr) {
		if (stderr){
			console.log(stderr)
		}
		if (err){
			error('Unsupported or corrupted file.')
			return console.log(err)
		}
		// Success
		else {
			recurlist('temp', imgtypes, cb, 1)
		}
	})
}


function sorter(a, b){
	var A = a.toLowerCase(),
		B = b.toLowerCase()
	if (A < B) return -1
	else if (A > B) return  1
	else return 0
}

function error(m){
	//alert(m)
}