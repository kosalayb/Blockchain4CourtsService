const Instructor = artifacts.require("./contracts/Instructor.sol");

// contract("Instructor", accounts => {

// 	  it("should store the name:kosala and age:22", async () => {

// 		    const instructor = await Instructor.deployed();

// 		    // Set instructor name and age
// 		    await instructor.setInstructor('kosala',22, { from: accounts[0] });

// 		    // Get instructor name and age
// 		    var data = await instructor.getInstructor.call();

// 		    assert.equal(data[0], 'kosala' , "Name was stored");
// 		    assert.equal(data[1], 22 , "Age was stored");

// 	  });

// });

contract("Instructor", function(accounts) { 

	//write all tests of contract Instructor here
	it("should store name:kosala age:22", function(){
		return Instructor.deployed().then(function(instance){
			instance.setInstructor('kosala',22, { from: accounts[0] });
			return instance.getInstructor.call();
		}).then(function(data){
			assert.equal(data[0],'kosala' , "Name wasn't stored");
			assert.equal(data[1], 22 , "Age wasn't stored");
		});

	});

  
});