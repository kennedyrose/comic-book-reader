





var mb = new gui.Menu({type:"menubar"}),
	item
mb.createMacBuiltin("Smarter Comic Book Viewer")
mb.removeAt(1)
mb.removeAt(1)

// File menu
item = new gui.MenuItem({
	type: 'normal',
	label: 'File'
}, 1)
item.submenu = new gui.Menu()
item.submenu.append(new gui.MenuItem({
	label: 'Open...',
	key: 'o',
	click: function(){
		open.click()
	}
}))
item.submenu.append(new gui.MenuItem({
	label: 'Open most recent',
	key: 'r',
	click: function(){
		var l = bookmarks.length
		if(l){
			load(bookmarks[l - 1][0])
		}
	}
}))
var openRecent = new gui.MenuItem({
	label: 'Open Recent'
})
item.submenu.append(openRecent)

function buildRecent(){
	var submenu = new gui.Menu(),
		fn

	for(var i = bookmarks.length, n = 10; n--;){
		i--
		if(i === -1){
			break
		}
		submenu.append(new gui.MenuItem({
			label: bookmarks[i][0],
			click: recentClick(bookmarks[i][0])
		}))
	}
	submenu.append(new gui.MenuItem({ type: 'separator' }))
	submenu.append(new gui.MenuItem({
		label: 'Clear items',
		click: clearBookmarks,
		enabled: bookmarks.length ? true : false
	}))


	openRecent.submenu = submenu
}
function recentClick(loc){
	return function(){
		load(loc)
	}
}
buildRecent()

item.submenu.append(new gui.MenuItem({
	label: 'Opening Containing Folder',
	click: function(){
		console.log(file.loc)
		gui.Shell.showItemInFolder(file.loc)
	}
}))
item.submenu.append(new gui.MenuItem({ type: 'separator' }))
item.submenu.append(new gui.MenuItem({
	label: 'Previous File',
	key: '[',
	modifiers: '',
	click: loadPrevNext
}))
item.submenu.append(new gui.MenuItem({
	label: 'Next File',
	key: ']',
	modifiers: '',
	click: function(){
		loadPrevNext(1)
	}
}))
item.submenu.append(new gui.MenuItem({ type: 'separator' }))
item.submenu.append(new gui.MenuItem({
	label: 'Close File',
	key: 'w',
	click: function(){
		file.loc = ''
		file.pages = []
		file.curPage = -1
		file.pageTotal = 0
		bottomUI.classList.remove('fadeOut')
		topUI.classList.remove('fadeOut')
	}
}))
mb.append(item)


// Page menu
item = new gui.MenuItem({
	type: 'normal',
	label: 'Page'
}, 1)
item.submenu = new gui.Menu()
item.submenu.append(new gui.MenuItem({
	label: 'Previous Page',
	key: ',',
	modifiers: '',
	click: prevPage
}))
item.submenu.append(new gui.MenuItem({
	label: 'Next Page',
	key: '.',
	modifiers: '',
	click: nextPage
}))
item.submenu.append(new gui.MenuItem({ type: 'separator' }))
item.submenu.append(new gui.MenuItem({
	label: 'First Page',
	click: function(){
		file.curPage = 0
	}
}))
item.submenu.append(new gui.MenuItem({
	label: 'Last Page',
	click: function(){
		file.curPage = file.pageTotal - 1
	}
}))
item.submenu.append(new gui.MenuItem({ type: 'separator' }))
item.submenu.append(new gui.MenuItem({
	label: 'Zoom In',
	key: '+',
	modifiers: '',
	click: function(){
		zoomMod += 10
		page.canvas.style.maxWidth = zoomMod + '%'
	}
}))
item.submenu.append(new gui.MenuItem({
	label: 'Zoom Out',
	key: '-',
	modifiers: '',
	click: function(){
		zoomMod -= 10
		page.canvas.style.maxWidth = zoomMod + '%'
	}
}))
item.submenu.append(new gui.MenuItem({ type: 'separator' }))
item.submenu.append(new gui.MenuItem({
	label: 'Info',
	key: 'i',
	modifiers: '',
	click: function(){
		wakeTopUI()
		wakeBottomUI()
	}
}))
mb.append(item)


// Window menu
item = new gui.MenuItem({
	type: 'normal',
	label: 'Window'
}, 1)
item.submenu = new gui.Menu()
item.submenu.append(new gui.MenuItem({
	label: 'Minimize',
	key: 'm',
	click: function(){
		win.minimize()
	}
}))
item.submenu.append(new gui.MenuItem({
	label: 'Fullscreen',
	key: 'f',
	click: function(){
		win.toggleFullscreen()
	}
}))
mb.append(item)


// Help menu
item = new gui.MenuItem({
	type: 'normal',
	label: 'Help'
}, 1)
item.submenu = new gui.Menu()
item.submenu.append(new gui.MenuItem({
	label: 'Check for Updates...',
	click: checkUpdates
}))
item.submenu.append(new gui.MenuItem({
	label: 'Reload',
	click: function(){
		win.reload()
	}
}))
item.submenu.append(new gui.MenuItem({
	label: 'Debug Console',
	key: 'd',
	click: function(){
		win.showDevTools()
	}
}))
mb.append(item)





win.menu = mb


