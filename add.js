
function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('head').item(0).appendChild(script); 
  
} 

include('server.js');




$(document).ready(function () { 
	build();
  clearRecords();
});


//This function check if the citation is already available on the blockchain
function citationAvailable(_events){

  var len=_events.length;
  var found=false;
  var citation=$("#citation").val();

   for(let i=len-1; i>=0;i--){
      var tmp=_events[i];
      var _citation=tmp.returnValues['citation'];
      var areEqual=citation.split(' ').join('').toLowerCase()===_citation.split(' ').join('').toLowerCase();
      if(areEqual){
        found=areEqual;
        break;
      }
   }
   return found;
}

//clear fields
function clearRecords(){
  $("#clearRecords").click(function (){
    $("#setData").trigger('reset');
  });
}


//build HTML file with data
function build(){

	$("#addRecords").click(async function (){

		var i;
    var _events;
		//Promises are asynchronous, meaning that the code above is not guaranteed (nor expected) to execute every line 
		//immediately after the previous.
		let ps=instance.getPastEvents('AddCourtCasesEvent',
			{
		        fromBlock: 0,
		        toBlock: 'latest'
			});

		ps.then((events)=>{
				console.log(events);
				i = events.length;
        _events=events;
		});

		await ps;

		var title =$("#title").val();
		var date=$("#date").val();
		var citation=$("#citation").val();
		var url=$("#url").val();
		//var tx;

    //check above fields are not empty
    if(title && date && citation && url){
      console.log("data fields :"+title+","+date+","+citation+","+url);
    }else{
      alert("Input fields are not completed ...");
      return;
    }

    //Check citation is already available on the blockchain
    if(citationAvailable(_events)){
      alert("This citation is already available on the blockchain");
      return;
    }

		var sha256Hash;

		//read data from url
		$.ajax({
			url:"http://localhost:8080/api/url?urlString="+url,
			type:"GET",
			cache:false,
			async: false,
			success:function(result){
				sha256Hash = CryptoJS.SHA256(result);
			},
			error: function(error){
				console.log(error);
			}
		});

		console.log("hash after ajax:"+sha256Hash);
		//alert("Hash is :"+sha256Hash.toString());


		// adding values to table
		table = document.getElementById('caseTable');
		var row = document.createElement('tr');
		var td1 = document.createElement('td');
		var td2 = document.createElement('td');
		var td3 = document.createElement('td');
		var td4 = document.createElement('td');
		var td5 = document.createElement('td');
		var td6 = document.createElement('td');

		td1.innerHTML = document.getElementById('title').value;
		td2.innerHTML = document.getElementById('date').value;
		td3.innerHTML = document.getElementById('citation').value;
		td4.innerHTML = document.getElementById('url').value;
		td6.innerHTML = sha256Hash.toString();

		btn = document.createElement("button");
		btn.setAttribute('content', 'test content');
		btn.setAttribute('class', 'btn');
		btn.setAttribute("id","id"+i);
		var txt = document.createTextNode("Details");//creat text on button
		btn.appendChild(txt);//attached text on button

		
		//adding to blockchain
		instance.methods.addCase(title, date, citation, url, sha256Hash.toString())
		 	.send({
		 		from: account,
		 		gas:1500000,
		 		gasPrice: '30000000000000'
		 	})
		 	.then(function(tx){
		 		// th=tx['transactionHash'];
		 		//td5.innerHTML = JSON.stringify(tx);
		 		td5.appendChild(btn);
		 		console.log("Transaction is:",tx);
		});

		row.appendChild(td1);
		row.appendChild(td2);
		row.appendChild(td3);
		row.appendChild(td4);
		row.appendChild(td5);
		row.appendChild(td6);
		table.children[0].appendChild(row);


		//reading events - fails if the block range contains > 10k events
		instance.getPastEvents('AddCourtCasesEvent',
			{
		        fromBlock: 0,
		        toBlock: 'latest'
			},
			(error, events)=>{
				//console.log(events[0]);
				console.log("lenth of events :"+events.length);

				btn.onclick = function(){
					var _id=event.srcElement.id;
					var n=_id.slice(2);// delete the first two characters
					var tmp=events[n];
					console.log("event to view :"+_id);
					//var data=JSON.stringify(tmp);

					//alert(data);
					// alert(tmp['transactionHash']);
					var ts=tmp.returnValues['timestamp'];
					var tstime = new Date(ts*1000).toTimeString();

					var para = document.createElement("P");
					para.innerHTML="Transaction Hash :"+tmp['transactionHash']+"<br>"
									+"Block Hash :" + tmp['blockHash'] +"<br>"
									+"Block Number :"+ tmp['blockNumber']+"<br>"
									+"Contract Address :"+tmp['address']+"<br>"
									+"Block Creation Time :"+tstime ;

					var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
					winPrint.document.write(para.innerHTML);
					winPrint.focus();
					//alert(event.srcElement.id);
				};


			}
		);


	});//end button click

}



// $(document).ready(function () { //ready() lets the function() available after the document is loaded -this is jQuery
// 	$("#submit").click(function (){

// 		console.log("clicked the submit button");
// 		var name =$("#name").val();
// 		var age=$("#age").val();

// 		instance.methods.setInstructor(name, age)
// 		 	.send({
// 		 		from: account,
// 		 		gas:1500000,
// 		 		gasPrice: '30000000000000'
// 		 	})
// 		 	.then(function(tx){
// 		 		console.log("Transaction",tx);
// 		});

// 		instance.getPastEvents('CreateInstructorEvent',
// 			{
// 		        fromBlock: 0,
// 		        toBlock: 'latest'
// 			},
// 			(error, events)=>{
// 				console.log("all events :"+events.length);
// 				let len=events.length;
// 				for(let i=len-1; i>=0;i--){
// 					tmp = events[i];
// 					tname=tmp.returnValues['fName'];
// 					tage=tmp.returnValues['age'];
// 					console.log(" Name: "+tname+" Age: "+tage);
// 				}
// 			}
// 		);

// 	});

//  });




// document.addEventListener('DOMContentLoaded', () => {
// 	instance.methods.getInstructor().call()
// 		.then(result => {
// 			console.log("result is",result);
// 			document.getElementById("instructor").innerHTML = result[0]+":"+result[1];
// 	});
// });