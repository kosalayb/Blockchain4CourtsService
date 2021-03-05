
function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('head').item(0).appendChild(script); 
  
} 

include('server.js');


$(document).ready(function () { 


    $("#view").click(function (){

      // adding values to table
      var table = document.getElementById('viewTable');
    

      //reading events
      instance.getPastEvents('AddCourtCasesEvent',
        {
              fromBlock: 0,
              toBlock: 'latest'
        },
        (error, events)=>{
          console.log(events[0]);
          console.log("number of events :"+events.length);
          let len=events.length;

          for(let i=len-1; i>=0;i--){

            tmp = events[i];

            var row = document.createElement('tr');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');
            var td5 = document.createElement('td');


            var btn= document.createElement("button");
            btn.setAttribute('content', 'test content');
            btn.setAttribute('class', 'btn');
            btn.setAttribute("id","id"+i);
            var txt = document.createTextNode("Details");//creat text on button
            btn.appendChild(txt);//attached text on button


            //adding records to table
            td1.innerHTML=tmp.returnValues['title'];
            td2.innerHTML=tmp.returnValues['date'];
            td3.innerHTML=tmp.returnValues['citation'];
            td4.innerHTML=tmp.returnValues['url'];
            td5.appendChild(btn);


            row.appendChild(td1);
            row.appendChild(td2);
            row.appendChild(td3);
            row.appendChild(td4);
            row.appendChild(td5);
            table.children[0].appendChild(row);


            btn.onclick = function(){
              //alert(event.srcElement.id);
              var _id=event.srcElement.id;
              var n=_id.slice(2);// delete the first two characters
              var tmp=events[n];
              //var data=JSON.stringify(tmp);
              console.log(tmp);
              var ts=tmp.returnValues['timestamp'];
              var tstime = new Date(ts*1000).toTimeString();

              var para = document.createElement("P");
              para.innerHTML="Transaction Hash :"+tmp['transactionHash']+"<br>"
                      +"Block Hash :" + tmp['blockHash'] +"<br>"
                      +"Block Number :"+ tmp['blockNumber']+"<br>"
                      +"Contract Address :"+tmp['address']+"<br>"
                      +"Document Hash :"+tmp.returnValues['hash']+"<br>"
                      +"Block Creation Time :"+tstime ;

              var winPrint = window.open('', '', 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
              winPrint.document.write(para.innerHTML);
              winPrint.focus();
              
            };

          }//end for


        } //events

      );






    });//end view click



});//end document