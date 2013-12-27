var catalog = {};
catalog.fs=require('fs');
catalog.getObject = function(input){
	var obj={};
	var key_input=input.split(";");
	var isbn=key_input[0].split(":");
	var object_input = '{\"'+input.replace(/:/g,'\":\"').replace(/;/g,'\",\"')+'\"}';
	obj[isbn[1]]=JSON.parse(object_input);
	return obj;
};
catalog.objectToString = function(RecordISBN,obj1){
	var readData = [];
	RecordISBN.map(function(isbn){
		var RecordObject=obj1[isbn];
		var RecordField=Object.keys(RecordObject);
		var RecordData=RecordField.map(function(field){
			return RecordObject[field];
		}).join('~');
		readData.push(RecordData);
	});
	return readData;
};
catalog.removeBook = function(inputObject,key){
	var obj=catalog.readData(JSON.stringify(inputObject));
	obj = JSON.parse(obj);
	if(!obj[inputObject])
		return "No such book found.";		
	delete obj[inputObject];
	catalog.writeData(JSON.stringify(obj));
	return inputObject;	
};
var removeEmpty = function(element){
		return element;
};
catalog.addRecord = function(input){
	var fields = input.split(';');
	var fieldsToWrite = [];
	fields.forEach(function(element){
		var key = element.substr(0,element.indexOf(':')).trim(" ");
		var value = (element.substr(-(element.length-(element.indexOf(':')+1)))).trim(' ');
		if(key.length == element.length-1)
			value = "";
		if(key == 'isbn')
			fieldsToWrite[0] = key+':'+value;
		if(key == 'price')
			fieldsToWrite[1] = key+':'+value;
		if(key == 'author')
			fieldsToWrite[2] = key+':'+value;
		if(key == 'title')
			fieldsToWrite[3] = key+':'+value;
		if(key == 'publisher')
			fieldsToWrite[4] = key+':'+value;
		if(key == 'tags')
			fieldsToWrite[5] = key+':'+value;
	});
	return fieldsToWrite.filter(removeEmpty);
};
catalog.isPresent = function(dataKeys,inputKeys){
	for(var count = 0 ;count<dataKeys.length;count++)
		if(dataKeys[count] == inputKeys)
			return dataKeys[count];
};
catalog.updateRecord = function(args){
	if(args == "" || args == " " || !args)
		return "Give book details to update";
	if(args.indexOf("isbn") == -1 || args == "isbn" || args.indexOf('isbn:;') > -1)
		return "Book details cannot be updated without ISBN";
	args = args.trim();
	var text = catalog.readData();
	var dataObject = JSON.parse(text);
	var dataKeys = Object.keys(dataObject);
	var input = catalog.addRecord(args);
	input = (input.join(';'));
	var inputObject = catalog.getObject(input);
	var inputKeys = Object.keys(inputObject);
	var keys = Object.keys(inputObject[inputKeys])
	var error = [];
	keys.forEach(function(x){
		if(catalog.isPresent(dataKeys,inputKeys))
			dataObject[inputKeys[0]][x]=inputObject[inputKeys[0]][x];
		else
			error.push("errrrorrrrrrr")	
	});
	if(error.length > 0)
		return "No such ISBN found."
	catalog.writeData(JSON.stringify(dataObject));
	var result = (dataObject[Object.keys(inputObject)])
	var resultKeys = Object.keys(result);
	var data = [];
	var last = (resultKeys).forEach(function(element){
		data.push(result[element]);
	});
	var display = ("Book Updated successfully as following:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n");
	return display+data.join(" ");
};
var addTag = function(args){
	var dataObject = JSON.parse(catalog.readData());
	var input = catalog.addRecord(args[2]).join(';');
	var inputObject = catalog.getObject(input);
	var inputKeys = Object.keys(inputObject);
	var keys = Object.keys(inputObject[inputKeys]);
	keys.forEach(function(x){
		var inputTags = (inputObject[inputKeys[0]][x].split(','));
		if(x!='isbn'){
			if(dataObject[inputKeys[0]][x]!=undefined)
				var dataTags = (dataObject[inputKeys[0]][x].split(','))
			var finalTags = [],tags = [];
			if(catalog.isPresent(Object.keys(dataObject),inputKeys)){
				if (dataTags != undefined) 
					finalTags.push(inputTags.join(','),dataTags.join(','));
				else
					finalTags.push(inputTags.join(','));				
				finalTags  = (finalTags.join(','));
				finalTags.split(',').forEach(function(x){
					if(x)
						tags.push(x);
				});
				dataObject[inputKeys[0]][x]=tags.join(',');
			}
		}
	});
	catalog.writeData(JSON.stringify(dataObject));
	var resultKeys = Object.keys((dataObject[Object.keys(inputObject)]));
	var data = [];
	var last = (resultKeys).forEach(function(element){
		data.push((dataObject[Object.keys(inputObject)])[element]);
	});
	var display = ("Tag added as following:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n");
	return display+data.join(" ");
};
var removeTag = function(args){
	var dataObject = JSON.parse(catalog.readData());
	var input = catalog.addRecord(args[2]).join(';');
	var inputObject = catalog.getObject(input);
	var inputKeys = Object.keys(inputObject);
	var keys = Object.keys(inputObject[inputKeys]);
	var tags = (args[2].slice(args[2].indexOf(';')+1,args[2].length));
	tags = (tags.split(':')[1]);
	keys.forEach(function(x){
		if(x!='isbn')
			if(catalog.isPresent(Object.keys(dataObject),inputKeys))
				if(dataObject[inputKeys[0]][x]!=undefined){
					dataObject[inputKeys[0]][x]=dataObject[inputKeys[0]][x].replace(tags,"").replace(/,/,"");
				}
	});
	catalog.writeData(JSON.stringify(dataObject));
	var result = (dataObject[Object.keys(inputObject)])
	var resultKeys = Object.keys(result);
	var data = [];
	var last = (resultKeys).forEach(function(element){
		if(result[element] != 'undefined')
			data.push(result[element]);
	});
	var display = ("Tag removed:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n");
	return display+data.join(" ");
};
catalog.tag = function(args){
	if(args[2] == "" || args[2] == " " || !args[2])
		return "Give tags to add or remove";
	if(args[2] == "isbn:" || args[2].indexOf("isbn:;") > -1 || args[2].indexOf("isbn") == -1 || args[2] == 'isbn')
		return "Book details cannot be modified without ISBN";
	if(args[1] == 'add')
		return addTag(args);
	if(args[1] == 'remove')
		return removeTag(args);
};
catalog.addBook = function(input){
	if(input == "" || input == " " || !input)
		return "Give book details to add";
	if(input == "isbn:" || input.indexOf("isbn:;") > -1 || input.indexOf("isbn") == -1 || input == 'isbn')
		return "Book details cannot be added without ISBN";
	input = input.trim();
	var Data=catalog.readData();
	var fieldsToWrite = catalog.addRecord(input);
	var obj1= JSON.parse(Data);
	var keys=Object.keys(obj1);
	var obj = catalog.getObject(fieldsToWrite.join(';'));
	var objField=Object.keys(obj);
	var isDuplicate=keys.some(function(x){
		return x == objField[0];
	});
	if(isDuplicate)	return "Duplicate ISBN number: "+objField+"!";
	obj1[objField[0]]=obj[objField[0]];
	catalog.writeData(JSON.stringify(obj1));
	var RecordISBN = Object.keys(obj1);
	var result = catalog.objectToString(RecordISBN,obj1);
	return (fieldsToWrite.join(' ').replace(/~/g," ").replace(/:/g,'->'))+" added successfully!";
};
catalog.listAll = function(){
	var obj=catalog.readData();
	obj = JSON.parse(obj);
	var RecordISBN=Object.keys(obj);
	var result=catalog.objectToString(RecordISBN,obj);
	if(result.length == 0)
		return "----------No Book Present----------";
	return ("ISBN PRICE AUTHOR TITLE PUBLISHER TAG\n"+result.join('\n').replace(/~/g," "));
};
catalog.searchByField = function(keys,obj1,input,searchResult){
	for(i=0;i<keys.length;i++){
		if(obj1[keys[i]][input.field]){
			var value = obj1[keys[i]][input.field];
			var search = input.searchRecord;
			if(value.indexOf(search)!= -1)
				searchResult.push(obj1[keys[i]]);
		}
	}
	var RecordISBN=Object.keys(searchResult);
	var result=catalog.objectToString(RecordISBN,searchResult);
	console.log("ISBN PRICE AUTHOR TITLE PUBLISHER TAG");
	return result.join("\n").replace(/~/g," ");
};
catalog.searchBook = function(input,args){	
	if(args.length == 1)
		return "Give data to search"
	if(input.searchRecord == "")
		return catalog.listAll();
	var text=catalog.readData();
	var obj1= JSON.parse(text);
	var keys=Object.keys(obj1);
	var searchResult=[];
	if(!input.searchField){
		var RecordISBN=Object.keys(obj1);
		var result=catalog.objectToString(RecordISBN,obj1);
		console.log("ISBN PRICE AUTHOR TITLE PUBLISHER TAG");
		var data = result.forEach(function(x){
			var searchString = input.searchRecord;
			if(x.indexOf(searchString) > -1)
				searchResult.push(x);
		});
		return searchResult.join("\n").replace(/~/g," ");
	}
	else
		return catalog.searchByField(keys,obj1,input,searchResult);
};
catalog.readData = function(data){
	return catalog.fs.readFileSync('bookInventory','UTF-8');
};
catalog.writeData = function(data){
	return catalog.fs.writeFileSync('bookInventory',data);
};
catalog.appendData = function(data){
	return catalog.fs.appendFileSync('bookInventory',data);
};
var doesNotStartWithminus = function(Data){
	if(Data!='bookInventory')
   		return Data.charAt(0) != '-';
};
catalog.getParameters = function(args){ 
    var input = {}; 
    input.fileName = "bookInventory";
    input.option =  args.filter(doesNotStartWithminus);
    return input; 
}; 
catalog.getUserInput = function(args){
    var result = {
    	add : false,
    	remove : false,
    	list : false,
    	search: false,
    	update: false,
    	tag: false
    }; 
    if(args[0] == 'add')
    	result.add = true;
    else if(args[0] == 'remove')
    	result.remove = true;
    else if(args[0] == 'list')
    	result.list = true;
    else if(args[0] == 'update')
    	result.update = true;
    else if(args[0] == 'tags')
    	result.tag  =true;
    else if(args[0] == 'search')
    	result.search = true;

    result.searchField=args.some(function(text){
    	return text.charAt(0) == '-';
	});
  	if(result.search){
		if(result.searchField){
			result.field=args[1].substring(1,args[1].length);
			if(args.length>2)	
				result.searchRecord=args[2].substring(0,args[2].length);
		}
		else
			result.searchRecord = args[1];
	}
    return result;
};
catalog.bookCatalog = function(input,args){
	if(args.indexOf('--help') > -1 || args.indexOf('--h') > -1)
		return catalog.fs.readFileSync('helpFile','UTF-8');
	if(input.list)
		return catalog.listAll();	
	if(input.add)
		return catalog.addBook(args[1]);
	if(input.remove){
		var record = catalog.removeBook(args[2]);
		if(record == "No such book found.")
			return record;
		return record+" removed successfully."
	}
	if(input.search){
		var searchResult=catalog.searchBook(input,args);
		return searchResult?searchResult:"------------No Book Found------------";
	}
	if(input.update)
		return catalog.updateRecord(args[1]);
	if(input.tag)
		return catalog.tag(args);
	return "Please specify an operation to perform";
};
exports.catalog = catalog;