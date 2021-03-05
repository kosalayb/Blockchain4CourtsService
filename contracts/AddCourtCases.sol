pragma solidity ^0.5.16;

contract AddCourtCases {
    
   string public title;
   string public date;
   string public citation;
   string public url;
   string public hash;

   event AddCourtCasesEvent(
   		string title,
   		string date,
      string citation,
      string url,
      string hash,
      uint256 timestamp
   );
   
   function addCase(string memory _title, string memory _date, string memory _citation, string memory _url, string memory _hash) public {
       title = _title;
       date =_date;
       citation = _citation;
       url = _url;
       hash=_hash;
       emit AddCourtCasesEvent(_title, _date, _citation, _url, _hash, block.timestamp);
   } 
   
   function getCourtCase() public view returns (string memory, string memory, string memory, string memory, string memory) {
       return (title, date, citation, url, hash);
   }
    
}