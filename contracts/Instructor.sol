pragma solidity ^0.5.16;

contract Instructor {
    
   string fName;
   uint age;
   
   function setInstructor(string memory _fName, uint _age) public {
       fName = _fName;
       age = _age;
   }
   
   function getInstructor() public view returns (string memory, uint) {
       return (fName, age);
   }
    
}