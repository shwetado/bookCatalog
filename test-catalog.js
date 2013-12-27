var assert = require('assert');
var catalog = require('./catalog-lib.js').catalog;
var fs = require('./mockFs.js').fs;
var test={};
var input = "isbn:12;price:247;author:RK Narayan;title:Swami and Friends;publisher:Indian Co.;tag:Comedy";

test.getObject_should_convert_object_to_an_object_with_key_as_isbn = function(){
	assert.deepEqual({
		12: 	{
					isbn: 12,
					price: 247,
					author: 'RK Narayan',
					title: 'Swami and Friends',
					publisher: 'Indian Co.',
					tag: 'Comedy'
				}
	},catalog.getObject(input));	
};

test.add_a_new_book_to_inventory = function(){
	fs.data = "isbn:13;price:247;author:RK Narayan;title:Swami and Friends;publisher:Indian Co.";
	fs.data1 ='{\"12\":{\"isbn\":\"12\",\"price\":\"247\"}}';
	catalog.fs=fs;
	assert.equal("isbn->13 price->247 author->RK Narayan title->Swami and Friends publisher->Indian Co. added successfully!",catalog.addBook(fs.data));
};

test.add_another_new_book_to_inventory = function(){
	fs.data = "isbn:13;price:247;author:RK Narayan;title:Swami and Friends;publisher:Indian Co.";
	catalog.fs=fs;
	assert.equal("isbn->13 price->247 author->RK Narayan title->Swami and Friends publisher->Indian Co. added successfully!",catalog.addBook(fs.data));
};

test.appending_data_into_file = function(){
	fs.data = "isbn:15;price:452;author:Abc;title:lmn;publisher:xyz Co.;tag:tragedy";
	catalog.fs=fs;
	assert.equal(68,catalog.appendData(input));
};

test.write_data_into_file = function(){
	fs.data = "isbn:15;price:452;author:Abc;title:lmn;publisher:xyz Co.;tag:tra";
	catalog.fs=fs;
	assert.equal(64,catalog.writeData(input));
};

test.read_data_from_file = function(){
	fs.data1 = "isbn:123";
	catalog.fs=fs;
	assert.equal("isbn:123",catalog.readData(fs.data));
};

test.list_all_data = function(){
	fs.data1 = '{\"12\":{\"isbn\":\"12\",\"price\":\"247\"},\"123\":{\"isbn\":\"123\",\"price\":\"247\"}}';
	catalog.fs=fs;
	assert.equal("ISBN PRICE AUTHOR TITLE PUBLISHER TAG\n"+"12 247\n123 247",catalog.listAll(fs.data))
};

test.bookInventory_should_be_filename = function(){
	assert.deepEqual({
		fileName: 'bookInventory',
		option: []},catalog.getParameters(["bookInventory"]));
};

test.bookInventory_should_be_filename_and_add_as_option = function(){
	assert.deepEqual({
		fileName:'bookInventory',
		option:['add']},catalog.getParameters(["bookInventory","add"]));
};

test.bookInventory_should_be_filename_and_remove_as_option = function(){
	assert.deepEqual({
		fileName:'bookInventory',
		option:['remove']},catalog.getParameters(["bookInventory","remove"]));
};

test.bookInventory_should_be_filename_and_list_as_option = function(){
	assert.deepEqual({
		fileName:'bookInventory',
		option:['list']},catalog.getParameters(["bookInventory","list"]));
};

test.catalog_bookInventory_with_remove = function(){
	assert.deepEqual({
		add: false,
		remove: true,
		list: false,
		search: false,
		"searchField":false,
    	update: false,
    	tag: false},catalog.getUserInput(["remove"]));
};

test.catalog_bookInventory_with_add = function(){
	assert.deepEqual({
		"add": true,
		"remove": false,
		"list": false,
		"search": false,
		"searchField":false,
    	update: false,
    	tag: false},catalog.getUserInput(["add"]));
};

test.catalog_bookInventory_with_list = function(){
	assert.deepEqual({
		"add":false,
		"remove":false,
		"list":true,
		"search":false,
		"searchField":false,
    	update: false,
    	tag: false},catalog.getUserInput(["list"]));
};

test.searching_A_record_via_bookCatalog = function(){
    var input = {
		add: false,
		remove: false,
		list: false,
		search: true,
		searchByField: false,
		searchRecord:'Swa',
    	update: false,
    	tag: false};
	var text = "13 247 RK Narayan Swami and Friends Indian Co.";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["search","swa"]));
};

test.catalog_bookInventory_with_search = function(){
	assert.deepEqual({
		"add":false,
		"remove":false,
		"list":false,
		"search":true,
		"searchRecord":"sh",
		"searchField":false,
    	update: false,
    	tag: false},catalog.getUserInput(["search","sh"]));
};

test.when_searching_by_title_catalog_bookInventory_with_search = function(){
	assert.deepEqual({
		"add":false,
		"remove":false,
		"list":false,
		"search":true,
		"searchField":true,
		"field":"title",
		"searchRecord":"lemon",
    	update: false,
    	tag: false},catalog.getUserInput(["search","-title","lemon"]));
};

test.searching_by_title_field = function(){
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"},\"12\":{\"isbn\":\"12\",\"price\":\"247\"},\"123\":{\"isbn\":\"123\",\"price\":\"247\"}}"; 
    var input = {
		"add":false,
		"remove":false,
		"list":false,
		"search":true,
		"searchField":true,
		"field":"title",
		"searchRecord":"Swami",
    	update: false,
    	tag: false};
	var text = "13 247 RK Narayan Swami and Friends Indian Co.";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"},\"12\":{\"isbn\":\"12\",\"price\":\"247\"},\"123\":{\"isbn\":\"123\",\"price\":\"247\"}}";
	assert.equal(text,catalog.bookCatalog(input,["search","-title","Swami"]));
};

test.when_searching_by_title_catalog_bookInventory_with_search_when_book_is_not_there = function(){
	assert.deepEqual({
		"add":false,
		"remove":false,
		"list":false,
		"search":true,
		"searchField":true,
		"field":"title",
		"searchRecord":"less",
    	update: false,
    	tag: false},catalog.getUserInput(["search","-title","less"]));
};

test.when_searching_by_author_of_book_when_book_not_there = function(){
	assert.deepEqual({
		"add":false,
		"remove":false,
		"list":false,
		"search":true,
		"searchField":true,
		"field":"author",
		"searchRecord":"sam",
    	update: false,
    	tag: false},catalog.getUserInput(["search","-author","sam"]));
};

test.catalog_bookInventory_with_search_should_return_searched_Record = function(){
	var args = ["search","Swa"]
	var input = {
		add: false,
		remove: true,
		list: false,
		search: false,
		"searchField":false,
		"searchRecord":"Swa",
    	update: false,
    	tag: false};
	var text = "13 247 RK Narayan Swami and Friends Indian Co.";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.searchBook(input,args));
};

test.list_All_lists_all_the_current_Records_present_in_inventory = function(){
	var text = "12 247\n13 247 RK Narayan Swami and Friends Indian Co.\n123 247";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"},\"12\":{\"isbn\":\"12\",\"price\":\"247\"},\"123\":{\"isbn\":\"123\",\"price\":\"247\"}}";
};

test.catalog_bookInventory_with_search_when_book_not_present = function(){
	var input = {
		add: false,
		remove: false,
		list: false,
		search: true,
		"searchField":true,
		"field":"author",
		"searchRecord":"heaven",
    	update: false,
    	tag: false};
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual("------------No Book Found------------",catalog.bookCatalog(input,["search","-author","heaven"]));
};

test.listing_All_records_in_inventory_via_bookCatalog = function(){
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"},\"12\":{\"isbn\":\"12\",\"price\":\"247\"},\"123\":{\"isbn\":\"123\",\"price\":\"247\"}}"; 
    var input = {
		add: false,
		remove: false,
		list: true,
		search: false,
    	update: false,
    	tag: false};
	var text = "12 247\n13 247 RK Narayan Swami and Friends Indian Co.\n123 247";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"},\"12\":{\"isbn\":\"12\",\"price\":\"247\"},\"123\":{\"isbn\":\"123\",\"price\":\"247\"}}";
	assert.deepEqual("ISBN PRICE AUTHOR TITLE PUBLISHER TAG\n"+text,catalog.bookCatalog(input,["list"]));
};

test.check_while_adding_whether_the_isbn_is_present_or_not = function(){
	fs.data = "isbn:13;price:247;author:RK Narayan;title:Swami and Friends;publisher:Indian Co.;tag:Comedy";
	catalog.fs=fs;
	assert.equal("Duplicate ISBN number: 13!",catalog.addBook(fs.data));
};

test.adding_a_record_via_bookCatalog = function(){
	fs.data = "isbn:1003;price:247"; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "isbn->1003 price->247 added successfully!";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.adding_data_only_space_into_the_book_inventory_should_give_error_msg = function(){
	fs.data = " "; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "Give book details to add";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.when_the_series_of_input_data_is_changed_adding_a_record_via_bookCatalog = function(){
	fs.data = "price:247;isbn:11111"; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "isbn->11111 price->247 added successfully!";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.when_only_add_given_with_no_parameters__should_give_error_msg = function(){
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "Give book details to add";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add"]));
};

test.removing_a_record_via_bookCatalog = function(){
	fs.data = "1003"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: true,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "1003";	
	fs.data1 = "{\"1003\":{\"isbn\":\"1003\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text+" removed successfully.",catalog.bookCatalog(input,["remove","-isbn",fs.data]));
};

test.delete_a_book_from_inventory = function(){
	catalog.fs=fs;
	fs.data1 ='{\"12\":{\"isbn\":\"12\",\"price\":\"247\"},\"123\":{\"isbn\":\"123\",\"price\":\"247\"}}';
	assert.deepEqual(12,catalog.removeBook(12));
};

test.when_book_is_not_there_delete_a_book_from_inventory = function(){
	catalog.fs=fs;
	fs.data1 ='{\"12\":{\"isbn\":\"12\",\"price\":\"247\"},\"123\":{\"isbn\":\"123\",\"price\":\"247\"}}';
	assert.deepEqual("No such book found.",catalog.removeBook(10002));
};

test.when_record_is_not_there_removing_a_record_via_bookCatalog = function(){
	fs.data = "0000000"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: true,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "0000000";	
	fs.data1 = "{\"1003\":{\"isbn\":\"1003\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual("No such book found.",catalog.bookCatalog(input,["remove","-isbn",fs.data]));
};

test.listing_All_records_in_inventory_via_bookCatalog_when_file_empty = function(){
	fs.data1 = "{}"; 
    var input = {
		add: false,
		remove: false,
		list: true,
		search: false,
    	update: false,
    	tag: false};
	var text = "----------No Book Present----------";
	fs.data1 = "{}";
	assert.deepEqual(text,catalog.bookCatalog(input,["list"]));
};

test.adding_empty_string_into_the_book_inventory_should_give_error_msg = function(){
	fs.data = ""; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "Give book details to add";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.when_trying_to_add_only_isbn_into_the_book_inventory = function(){
	fs.data = "isbn:"; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "Book details cannot be added without ISBN";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.when_adding_an_empty_field_into_the_book_inventory = function(){
	fs.data = "isbn:00000;price:897;author:"; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "isbn->00000 price->897 author-> added successfully!";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.when_with_Any_other_field_trying_to_add_only_isbn_into_the_book_inventory = function(){
	fs.data = "isbn:;price:76"; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "Book details cannot be added without ISBN";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};	

test.when_isbn_is_not_given_and_trying_to_add_only_isbn_into_the_book_inventory = function(){
	fs.data = "price:76;author:admmmm"; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "Book details cannot be added without ISBN";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};	

test.adding_only_$isbn$_inot_the_book_inventory_should_give_error_msg = function(){
	fs.data = "isbn"; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "Book details cannot be added without ISBN";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"price\":\"247\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.for_filtering_empty_records_while_adding_book_into_the_book_inventory = function(){
	fs.data = "isbn:00000;author:happy"; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "isbn->00000 author->happy added successfully!";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.for_triming_blank_while_adding_book_into_the_book_inventory = function(){
	fs.data = "     isbn:00000;author:happy    "; 
    catalog.fs =fs;
    var input = {
		add: true,
		remove: false,
		list: false,
		search: false,
    	update: false,
    	tag: false};
	var text = "isbn->00000 author->happy added successfully!";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["add",fs.data]));
};

test.displaying_help = function(){
	fs.data1 = "help"; 
    catalog.fs =fs;
	assert.deepEqual("help",catalog.bookCatalog(input,["--help"]));
};

test.updating_record_into_the_book_inventory = function(){
	fs.data = "isbn:13;author:happy"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Book Updated successfully as following:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n13 happy Swami and Friends Indian Co."
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\",\"title\":\"Swami and Friends\",\"publisher\":\"Indian Co.\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.updating_when_multiple_records_present_into_the_book_inventory = function(){
	fs.data = "isbn:45;price:100"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Book Updated successfully as following:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 100";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.update_having_empty_string_as_parameter_into_the_book_inventory = function(){
	fs.data = ""; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Give book details to update";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.update_having_space_as_parameter_into_the_book_inventory = function(){
	fs.data = " "; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Give book details to update";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.update_when_no_parameter_is_specified_into_the_book_inventory = function(){
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Give book details to update";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update"]));
};

test.update_when_data_given_is_not_in_particular_order_into_the_book_inventory = function(){
	fs.data = "price:1287;author:abc xyz;isbn:45"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Book Updated successfully as following:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 1287 abc xyz";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.update_when_many_blanks_Are_present_in_input = function(){
	fs.data = "       price:1287;author:abc xyz;isbn:45      "; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Book Updated successfully as following:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 1287 abc xyz";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.update_when_no_such_isbn_is_present_in_input = function(){
	fs.data = "price:1287;author:abc xyz;isbn:89"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "No such ISBN found.";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.update_when_isbn_is_not_specified_in_input = function(){
	fs.data = "price:1287;author:abc xyz"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Book details cannot be updated without ISBN";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.update_only_$isbn$_specified_in_input = function(){
	fs.data = "isbn"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Book details cannot be updated without ISBN";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.update_when_isbn_is_given_but_value_is_not_specified_in_input = function(){
	fs.data = "isbn:;"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: true,
    	tag: false};
	var text = "Book details cannot be updated without ISBN";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["update",fs.data]));
};

test.adding_A_tag_to_an_existing_book_in_inventory = function(){
	fs.data = "isbn:45;tags:novel"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: false,
    	tag: true};
	var text = "Tag added as following:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 87 novel";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["tags","add",fs.data]));
};

test.removing_A_tag_from_an_existing_book_in_inventory = function(){
	fs.data = "isbn:45;tags:novel"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: false,
    	tag: true};
	var text = "Tag removed:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 87 ";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\",\"tags\":\"novel\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["tags","remove",fs.data]));
};

test.removing_multiple_tags_from_an_existing_book_in_inventory = function(){
	fs.data = "isbn:45;tags:novel,tragedy"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: false,
    	tag: true};
	var text = "Tag removed:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 87 Comedy";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\",\"tags\":\"novel,tragedy,Comedy\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["tags","remove",fs.data]));
};

test.removing_tag_when_tag_Absent_from_an_existing_book_in_inventory = function(){
	fs.data = "isbn:45;tags:novel"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: false,
    	tag: true};
	var text = "Tag removed:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 87";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["tags","remove",fs.data]));
};

test.adding_multiple_tags_to_an_existing_book_in_inventory = function(){
	fs.data = "isbn:45;tags:novel,comedy"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: false,
    	tag: true};
	var text = "Tag added as following:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 87 novel,comedy,tragedy";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\",\"tags\":\"tragedy\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["tags","add",fs.data]));
};

test.removing_1_tag_when_multiple_are_present_from_an_existing_book_in_inventory = function(){
	fs.data = "isbn:45;tags:novel"; 
    catalog.fs =fs;
    var input = {
		add: false,
		remove: false,
		list: false,
		search: false,
		update: false,
    	tag: true};
	var text = "Tag removed:\n\nISBN PRICE AUTHOR TITLE PUBLISHER TAG\n45 87 horror,Comedy";
	fs.data1 = "{\"13\":{\"isbn\":\"13\",\"author\":\"RK Narayan\"},\"45\":{\"isbn\":\"45\",\"price\":\"87\",\"tags\":\"novel,horror,Comedy\"}}";
	assert.deepEqual(text,catalog.bookCatalog(input,["tags","remove",fs.data]));
};

exports.test = test;