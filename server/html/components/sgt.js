
class SGT_template{
	/* constructor - sets up sgt object 
	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose: 
		- Instantiates a model and stores pre-made dom elements it this object
		- Additionally, will generate an object to store created students 
		  who exists in our content management system (CMS)
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	constructor( elementConfig ){
		this.model = elementConfig;
		console.log(this.model);
		this.data = {};
		this.test = $('.test');
		this.createdID = null;
		this.createStudent = this.createStudent.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.clearInputs = this.clearInputs.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.deleteStudent = this.deleteStudent.bind(this);
		this.clearInputs = this.clearInputs.bind(this);
		this.dealData = this.dealData.bind(this);
		this.sendDataToServer =this.sendDataToServer.bind(this);
		this.getDataFromServer = this.getDataFromServer.bind(this);
	}
	/* addEventHandlers - add event handlers to premade dom elements
	adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	addEventHandlers(){
		this.model.addButton.on('click',this.handleAdd);
		this.model.cancelButton.on('click', this.handleCancel);
		this.test.on('click', this.getDataFromServer);
	}
	/* clearInputs - take the three inputs stored in our constructor and clear their values
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes http://s-apis.learningfuze.com/sgt/get
	*/
	getDataFromServer(){			
		var ajaxObj ={
			url: 'api/grades',
			method: 'get',
			data: {
				api_key:'AJL1aI5ORd'
			},
			dataType: 'json',
			success: this.dealData,
			error: this.handleError
		}
		$.ajax(ajaxObj);
	}
	dealData(response){
		console.log('Response: ', response);
		if(response.success){
			for(var i=0; i < response.data.length; i++){
				var data = response.data[i]
				this.createStudent(data.id, data.name, data.course, data.grade, this.deleteStudent);
			}	
			return true;
		} else {
			console.log('You got errors from the server:', response.errors);
			return false;
		}
	}
	sendDataToServer(name, course, grade){
		var ajaxObj = {
			url: 'http://s-apis.learningfuze.com/sgt/create',
			method: 'post',
			data:{
				api_key: 'AJL1aI5ORd',
				name: name,
				course: course,
				grade: grade,
			},
			dataType: 'json',
			success: this.getDataFromServer,
			error: this.handleError
		}
		$.ajax(ajaxObj);
	}
	handleError(){
		console.log('cant not connect to server');
	}
	clearInputs(){
		this.model.courseInput.val('');
		this.model.gradeInput.val('');
		this.model.nameInput.val('');
	}
	/* handleCancel - function to handle the cancel button press
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel(){
		this.clearInputs();
	}
	/* handleAdd - function to handle the add button click
	purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd(){
		var course= this.model.courseInput.val();
		var grade = this.model.gradeInput.val();
		var name = this.model.nameInput.val();
		this.sendDataToServer(name, course, grade);
		this.clearInputs();
	}
	/* displayAllStudents - iterate through all students in the model
	purpose: 
		grab all students from model, 
		iterate through the retrieved list, 
		then render every student's dom element
		then append every student to the dom's display area
		then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllStudents(){
		this.model.displayArea.empty();
		for(var index in this.data){

			this.model.displayArea.append(this.data[index].render());
		}
		this.displayAverage();
			
	}
	/* displayAverage - get the grade average and display it
	purpose: grab the average grade from the model, and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

	displayAverage(){
		var grade = [];
		var total = 0;
		for(var index in this.data){
			grade.push(parseInt(this.data[index].data.grade));
		}
		grade.forEach( data =>{
			total += data;
		})
		var average = total / grade.length;
		this.model.averageArea.text(average.toFixed(2));
	}
	/* createStudent - take in data for a student, make a new Student object, and add it to this.data object

		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose: 
			If no id is present, it must pick the next available id that can be used
			when it creates the Student object, it must pass the id, name, course, grade, 
			and a reference to SGT's deleteStudent method
	params: 
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/
	createStudent(id,name, course, grade){

		if(this.doesStudentExist(id) || isNaN(grade)){
			return false;
		} 
		//else if(!id){
		// 	var data = this.data;
		// 	for(var id in data){
		// 		var last = parseInt(id);
		// 		id = last+1;
		// 	}
		// }
		if(name && course && !isNaN(grade) && !isNaN(id)){
			this.data[id] = new Student(id, name, course, grade, this.deleteStudent);
			this.displayAllStudents();
			return true;
		}
		
	}
	/* doesStudentExist - 
		determines if a student exists by ID.  returns true if yes, false if no
	purpose: 
			check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params: 
		id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(number){
		if(this.data.hasOwnProperty(number)){
			return true;
		}
		return false;
	}
	/* readStudent - 
		get the data for one or all students
	purpose: 
			determines if ID is given or not
			if ID is given, return the student by that ID, if present
			if ID is not given, return all students in an array
	params: 
		id: (number)(optional) the id of the student to search for, if any
	return: 
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
	readStudent(number){
		var studentarr = [];
		if(this.doesStudentExist(number) === true){
			return this.data[number];
		} else if (!number){
			for(var index in this.data){
				studentarr.push(this.data[index]);
			}
			return studentarr;
		} else {
			return false;
		}
	}
	/* updateStudent - 
		not used for now.  Will be used later
		pass in an ID, a field to change, and a value to change the field to
	purpose: 
		finds the necessary student by the given id
		finds the given field in the student (name, course, grade)
		changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params: 
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return: 
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent(id, field, value){

		if(this.doesStudentExist(id)){
			this.data[id].update(field, value);
		} else{
			return false;
		}

	}
	/* deleteStudent - 
		delete the given student at the given id
	purpose: 
			determine if the ID exists in this.data
			remove it from the object
			return true if successful, false if not
			this is often called by the student's delete button through the Student handleDelete
	params: 
		id: (number) the id of the student to delete
	return: 
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	deleteStudent(id){

		if(!isNaN(id) && this.doesStudentExist(id)){
			var parseId = parseInt(id);
			// delete this.data[parseId];
			var ajaxObj ={
				url: 'http://s-apis.learningfuze.com/sgt/delete',
				method: 'post',
				data:{
					api_key: 'AJL1aI5ORd',
					student_id: parseId
				},
				success: this.getDataFromServer,
				error: this.handleError
			}
			$.ajax(ajaxObj);
			return true;
		} else {

			return false;
		}
		
	}
}