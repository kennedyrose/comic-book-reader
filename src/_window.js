
// Get bounds
var screenW = gui.Screen.Init().screens[0].bounds,
	screenH = screenW.height - 50
screenW = screenW.width - 50

var winState = localStorage.winState
if(!winState){
	winState = {
		x: win.x,
		y: win.y,
		w: win.width,
		h: win.height,
		max: 0,
		dev: 0
	}
}
else{
	winState = JSON.parse(winState)

	// If it will clip out of monitor, don't change sizes
	var winClip = false
	if((winState.x + winState.w) > screenW){
		winState.x = (screenW / 2) - (winState.w / 2)
		if((winState.x + winState.w) > screenW){
			winClip = true
		}
	}
	if((winState.y + winState.h) > screenH){
		winState.y = (screenH / 2) - (winState.h / 2)
		if((winState.y + winState.h) > screenH){
			winClip = true
		}
	}

	if(winClip === false){
		win.x = winState.x
		win.y = winState.y
		win.width = winState.w
		win.height = winState.h
	}
	if(winState.max){
		win.toggleFullscreen()
	}
}

if(win.y < 0){
	win.y = 50
	if(win.height + 125 > screenH){
		win.height = screenH - 75
	}
}
if(win.x < 0){
	win.x = 50
	if(win.width + 125 > screenW){
		win.width = screenW - 75
	}
}


// Observe for changes
var resizeTimeout
setTimeout(function(){

	win.on('move', function(){
		winState.x = win.x
		winState.y = win.y
	})
	win.on('devtools-opened', function(){
		winState.dev = 1
	})
	win.on('devtools-closed', function(){
		winState.dev = 0
	})

	window.addEventListener('resize', function(){
		clearTimeout(resizeTimeout)
		resizeTimeout = setTimeout(function(){
			if(win.isFullscreen){
				winState.max = 1
				return
			}
			winState.max = 0
			winState.w = win.width
			winState.h = win.height
		})
	})
}, 1000)
