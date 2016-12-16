var zoomMod = 100


var gui = require('nw.gui'),
	win = gui.Window.get()





// Drag & drop
window.ondragover = function(e) {
	e.preventDefault()
	return false
}
window.ondrop = function (e) {
	e.preventDefault();
	if (e.dataTransfer.files.length){
		load(e.dataTransfer.files[0].path)
	}
	return false
}

// Double click to turn pages
window.addEventListener('dblclick', function(e){

	if((e.clientX / window.innerWidth) < 0.5){
		if(file.curPage > 0){
			file.curPage--
		}
	}
	else if(file.curPage < file.pageTotal - 1){
		file.curPage++
	}
})


// Drag scrolling
var mouseCoords = {
		x: 0,
		y: 0,
		lastX: 0,
		lastY: 0,
		screenX: 0,
		screenY: 0
	},
	mouseDown = false,
	cursorHideDelay = 80,
	cursorHideTime = cursorHideDelay

window.addEventListener('mousedown', function(e){
	if(!file.loc){
		open.click()
		return
	}
	document.body.classList.add('grabbing')
	mouseCoords.x = e.clientX
	mouseCoords.y = e.clientY
	mouseCoords.screenX = pageCont.scrollLeft
	mouseCoords.screenY = pageCont.scrollTop
	mouseDown = true
	showCursor()
})
window.addEventListener('mousemove', function(e){
	if(mouseDown === true){
		pageCont.scrollTop = mouseCoords.screenY + (mouseCoords.y - e.clientY)
		pageCont.scrollLeft = mouseCoords.screenX + (mouseCoords.x - e.clientX)
	}
	if(mouseCoords.lastY !== e.screenY || mouseCoords.lastX !== e.screenX){
		mouseCoords.lastY = e.screenY
		mouseCoords.lastX = e.screenX
		showCursor()
	}
})
window.addEventListener('mouseup', function(e){
	document.body.classList.remove('grabbing')
	mouseDown = false
	showCursor()
})


function showCursor(){
	if(cursorHideTime <= 1){
		document.body.classList.remove('hideCursor')
	}
	cursorHideTime = cursorHideDelay
}

var scrollSpeed = 15,
	lastTime = 0,
	delta
function mainLoop(d){
	// Show/hide cursor
	if(cursorHideTime > 1){
		cursorHideTime--
	}
	else if(cursorHideTime === 1){
		cursorHideTime = 0
		document.body.classList.add('hideCursor')
	}


	if(keys[39] === true){
		pageCont.scrollLeft += scrollSpeed
	}
	else if(keys[37] === true){
		pageCont.scrollLeft -= scrollSpeed
	}
	if(keys[40] === true){
		pageCont.scrollTop += scrollSpeed
	}
	else if(keys[38] === true){
		pageCont.scrollTop -= scrollSpeed
	}

	requestAnimationFrame(mainLoop)
}
requestAnimationFrame(mainLoop)

// Open file dialog box
var open = document.getElementById('open')
open.accept = '.' + filetypes.join(',.')
open.addEventListener('change', function(e){
	load(this.value)
})

var keys = {}
document.body.addEventListener('keydown', function(e){
	var found = false
	if(!keys[e.keyCode]){
		switch(e.keyCode){


			case 33: // Page Up
				prevPage()
				break
			case 34: // Page Down
				nextPage()
				break

			case 219: // [
				loadPrevNext()
				break
			case 221: // ]
				loadPrevNext(1)
				break

			
			case 188: // , or <
				prevPage()
				break
			case 190: //. or >
				nextPage()
				break

			case 73: // I
				// Open file
				wakeTopUI()
				wakeBottomUI()
				break
			case 36: // Home
				file.curPage = 0
				break
			case 35: // End
				file.curPage = file.pageTotal - 1
				break

			case 37: // Left
				e.preventDefault()
				break
			case 38: // Up
				e.preventDefault()
				break
			case 39: // Right
				e.preventDefault()
				break
			case 40: // Down
				e.preventDefault()
				break

			case 187: case 107: // = or +
				// Zoom in
				zoomIn()
				break
			case 189: case 109: // - or _
				// Zoom out
				zoomOut()
				break

			default:
				found = true

		}
		if(found === false){
			keys[e.keyCode] = true
			e.preventDefault()
			return false
		}
	}
})


document.addEventListener('keyup', function(e){
	keys[e.keyCode] = false
})



