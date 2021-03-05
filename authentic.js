

function include(file) { 
  
  var script  = document.createElement('script'); 
  script.src  = file; 
  script.type = 'text/javascript'; 
  script.defer = true; 
  
  document.getElementsByTagName('head').item(0).appendChild(script); 
  
} 

include('server.js');


//This function finds hash of content in a URL
function findHashFromURL(url){
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

    return sha256Hash;
}


async function getEvents(){

    var _events;

    //Promises are asynchronous, meaning that the code above is not guaranteed (nor expected) to execute every line 
    //immediately after the previous.
    //A promise may be in one of 3 possible states: fulfilled, rejected, or pending
    //A promise is an object which can be returned synchronously from an asynchronous function
    var ps = instance.getPastEvents('AddCourtCasesEvent',
      {
            fromBlock: 0,
            toBlock: 'latest'
      }
    );

    ps.then( (events)=>{
          _events=events;
         // console.log("events :"+events);
        }
    );

    await ps;

    return _events;
}


$(document).ready(function() { 

    //process the promise return from getEvents() function
    var _events = getEvents();
    var _result;

    _events.then(function(result){
      _result=result;
      console.log(_result);
    }, 
    function(err){
      console.error("err :"+err);
    });

    var comp;
    var lbl=document.getElementById('comp');

    //after submit button click
    $("#checkAuthentic").click(function(){

        //1. find dh2 from the new URL
        var url=$("#input2").val(); 
        var dh2=findHashFromURL(url);
        console.log("dh2 :"+ dh2);

        //2.find document hash(dh1) for the citation from blockchain
        var _citation=$("#input1").val(); 
        console.log("input citation :"+_citation);
        
        var len=_result.length;
        var _bcitation, tmp, dh1;

        for(let i=len-1; i>=0;i--){

          tmp = _result[i];
          _bcitation=tmp.returnValues['citation'];

          if(_citation === _bcitation){
             dh1=tmp.returnValues['hash'];
             break;
          }

        }//end for


        console.log(_result);
        console.log(dh1);

        if(dh1==dh2){
          comp=" True";
          lbl.innerHTML="This is an authentic document";
          $("#picture").attr("src","tick.gif");
        }else{
          comp=" False";
          lbl.innerHTML="This is not an authentic document";
          $("#picture").attr("src","cross.gif");
        }

        
      //  alert("Trusted document :" +comp);

    });//end of submit button click async function



});

