var pruneLength = 30

var bookmarks = localStorage.bookmarks
if(!bookmarks){
	bookmarks = []
	localStorage.bookmarks = JSON.stringify(bookmarks)
}
else{
	bookmarks = JSON.parse(bookmarks)
}

function clearBookmarks(){
	bookmarks.length = 0
	localStorage.bookmarks = JSON.stringify(bookmarks)
	buildRecent()
}

function addBookmark(loc, curPage){
	var found = false
	for(var i = bookmarks.length; i--;){
		if(bookmarks[i][0] == loc){
			// If found file, remove from array and put on end
			var sub = bookmarks.splice(i, 1)[0]
			bookmarks.push(sub)
			found = true
			break
		}
	}
	// If no bookmark is found, create one
	if(found === false){
		if(typeof curPage !== 'number'){
			curPage = 0
		}
		bookmarks.push([loc, curPage])
		pruneBookmarks()
		buildRecent()
		localStorage.bookmarks = JSON.stringify(bookmarks)
	}
	else{
		if(typeof curPage === 'number'){
			bookmarks[bookmarks.length - 1][1] = curPage
			localStorage.bookmarks = JSON.stringify(bookmarks)
		}
		else{
			curPage = bookmarks[bookmarks.length - 1][1]
		}
		buildRecent()
	}
	return curPage
}


function updateBookmark(){
	bookmarks[bookmarks.length - 1][1] = file.curPage
	localStorage.bookmarks = JSON.stringify(bookmarks)
}


function pruneBookmarks(){
	while(bookmarks.total > pruneLength){
		bookmarks.shift()
	}
}

