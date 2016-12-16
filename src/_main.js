

var file = {
		loc: '',
		pages: [],
		curPage: 0,
		pageTotal: 0
	},
	active = 0,
	regfilename = /([^\/]+)(?=\.\w+$)/
	//regparenth = / *\([^)]*\) */g

Object.observe(file, function(changes){
	for(var i = 0; i < changes.length; i++){
		if(changes[i].type === 'update'){
			if(changes[i].name === 'loc'){
				if(!file.loc){
					closeFile()
				}
				else{
					// Change cursor
					document.body.classList.add('fileOpen')
					var title = file.loc.match(regfilename)[0].trim()
					fileTitle.innerText = title
					document.title = title
					wakeTopUI()

					addBookmark(file.loc, file.curPage)
					pageTotal.innerText = file.pageTotal
					loadPage()

				}
				loader.style.display = 'none'

			}
			else if(changes[i].name === 'curPage'){
				if(file.curPage !== -1){
					updateBookmark()
					if((typeof changes[i].oldValue === 'number') && changes[i].oldValue > file.curPage){
						loadPage(true)
					}
					else{
						loadPage()
					}
				}
			}
		}
	}
})

var page = document.getElementById('page').getContext('2d'),
	pageCont = document.getElementById('pageCont'),
	pageNum = document.getElementById('pageNum'),
	pageTotal = document.getElementById('pageTotal'),
	fileTitle = document.getElementById('fileTitle')





var dirFiles = [],
	dirFilesOn = 0
function loadPrevNext(direction){
	var dir = file.loc.split('/')
	dir.pop()
	dir = dir.join('/')

	console.log('searching dir ' + dir)

	recurlist(dir, filetypes, function(res){
		
		for(var i = 0; i < res.length; i++){
			res[i] = res[i].replace(regslashes, '/')
			if(file.loc == res[i]){
				dirFilesOn = i
			}
		}
		dirFiles = res

		if(direction === 1){
			dirFilesOn++
			if(dirFilesOn < dirFiles.length){
				load(dirFiles[dirFilesOn])
			}
		}
		else{
			dirFilesOn--
			if(dirFilesOn >= 0){
				load(dirFiles[dirFilesOn])
			}
		}
	})
}



function closeFile(){
	bottomUI.classList.remove('fadeOut')
	topUI.classList.remove('fadeOut')
	document.body.classList.remove('fileOpen')
	document.title = 'Smarter Comic Book Viewer'
	page.canvas.width = 0
	page.canvas.height = 0
}


var loader = document.getElementById('loader')
function load(f, fromBookmark){
	document.getElementById('waitMsg').style.display = 'none'
	loader.style.display = 'block'
	closeFile()
	rmdir('temp', function(){
		unpack(f, function(list){

			f = f.replace(regslashes, '/')


			var total = 0
			function imageLoad(){
				total++
				if(total === list.length){

					if(typeof fromBookmark !== 'number'){
						fromBookmark = addBookmark(f)
					}


					file.loc = f
					file.pages = arr
					file.curPage = -1
					file.curPage = fromBookmark
					file.pageTotal = list.length


				}
			}

			// Create image elements
			var arr = []
			for(var i = 0; i < list.length; i++){
				arr[i] = new Image()
				var str = list[i].split('/')
				for(var ii = str.length; ii--;){
					str[ii] = encodeURIComponent(str[ii])
				}
				arr[i].src = '../' + str.join('/')
				arr[i].onload = imageLoad
			}



		})
	})
}



var bottomUI = document.getElementById('bottomUI'),
	topUI = document.getElementById('topUI')
function wakeBottomUI(){
	bottomUI.classList.remove('fadeOut')
	setTimeout(wakeBottomUITime, 25)
}
function wakeBottomUITime(){
	bottomUI.classList.add('fadeOut')
}
function wakeTopUI(){
	topUI.classList.remove('fadeOut')
	setTimeout(wakeTopUITime, 25)
}
function wakeTopUITime(){
	topUI.classList.add('fadeOut')
}

function nextPage(){
	if(file.curPage < file.pageTotal - 1){
		file.curPage++
	}
}
function prevPage(){
	if(file.curPage > 0){
		file.curPage--
	}
}


function zoomIn(){
	zoomMod += 10
	page.canvas.style.maxWidth = zoomMod + '%'
	if(page.canvas.width < window.innerWidth){
		page.canvas.style.width = (page.canvas.width * (zoomMod / 100)) + 'px'
	}
}
function zoomOut(){
	zoomMod -= 10
	page.canvas.style.maxWidth = zoomMod + '%'
	if(page.canvas.width < window.innerWidth){
		page.canvas.style.width = (page.canvas.width * (zoomMod / 100)) + 'px'
	}
}


function loadPage(back){
	if(zoomMod !== 100){
		zoomMod = 100
		page.canvas.style.maxWidth = '100%'
		page.canvas.style.width = 'auto'
	}

	page.canvas.height = file.pages[file.curPage].height
	page.canvas.width = file.pages[file.curPage].width
	page.drawImage(file.pages[file.curPage], 0, 0)

	pageNum.innerText = file.curPage + 1
	wakeBottomUI()

	if(!back){
		pageCont.scrollTop = 0
	}
	else{
		pageCont.scrollTop = page.canvas.height
	}

}

// Clear cache on close
var isClosing = false
win.on('close', function(){
	if(isClosing === true || !localStorage){
		return
	}
	isClosing = true
	win.hide()
	localStorage.winState = JSON.stringify(winState)
	gui.App.clearCache()
	win.close(true)
})



// Check on startup
if (gui.App.argv.length) {
	load(gui.App.argv[0]);
}
else if(bookmarks.length){
	//load(bookmarks[bookmarks.length - 1][0], bookmarks[bookmarks.length - 1][1])
}

gui.App.on('open', function(path) {
	load(path)
})

// Hack: win.focus() won't work if nw.js "thinks" it's in focus when it isn't

if(winState.dev){
	win.showDevTools()
}
win.on('loaded', function(){
	setTimeout(function(){
		win.show()
	}, 25)
})