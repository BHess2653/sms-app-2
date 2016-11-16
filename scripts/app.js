var itemList = new Firebase('https://test-23aef.firebaseio.com/list');

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Saves Item to todo list
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function saveToList(event) {
    if (event.which == 13 || event.keyCode == 13) { // when user presses Enter, It will attempt to save the data
        var itemName = document.getElementById('itemName').value.trim();
        if (itemName.length > 0) {
            saveToFB(itemName);
        }
        document.getElementById('itemName').value = '';
        return false;
    }
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Saves Item from todo list to firebase DB
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function saveToFB(itemName) {
    // this will save data to FB database
    itemList.push({
        name: itemName
    });
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Refresh UI
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += '<p data-key="' + list[i].key + '">' + list[i].name + ' ' + genLinks(list[i].key, list[i].name) + '</p>';
    };
    document.getElementById('itemList').innerHTML = lis;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Creates edit and Delete links at the end of todo items
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function genLinks(key, mvName) {
    var links = '';
    links += '<a href="javascript:edit(\'' + key + '\',\'' + mvName + '\')"> Edit</a> | ';
    links += '<a href="javascript:del(\'' + key + '\',\'' + mvName + '\')"> X </a>';
    return links;
};

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Edit Function
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function edit(key, mvName) {
    var itemName = prompt("Update the item name", mvName);
    if (itemName && itemName.length > 0) {
        var updateListRef = buildEndPoint(key);
        updateListRef.update({
            name: itemName
        });
    }
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// Delete Function
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
function del(key, mvName) {
    var response = confirm("Remove \"" + mvName + "\" from the list?");
    if (response == true) {
        var deleteListRef = buildEndPoint(key);
        deleteListRef.remove();
    }
}

function buildEndPoint (key) {
	return new Firebase('https://test-23aef.firebaseio.com/list/' + key);
}

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// This gets fired on inital load as well as when ever there is a change in the data
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
itemList.on("value", function(snapshot) {
    var data = snapshot.val();
    var list = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            name = data[key].name ? data[key].name : '';
            if (name.trim().length > 0) {
                list.push({
                    name: name,
                    key: key
                })
            }
        }
    }
    // refresh the UI
    refreshUI(list);
});
