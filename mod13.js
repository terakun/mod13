document.onkeydown = gameSet;

var cnt=0;             //何問目か格納
var typStart,typEnd;   //開始時と終了時の時刻を格納
var probsize = 10;
var prob_str = "";
var input = "";
var ans = 0;
var miss_num = 0;
var elements;
var proboption = "";

var modulo = 13;
var lvalue = 0;
var rvalue = 0;
var op = 0;
var opstr = new Array("＋","ー","×","÷","^");
var opes = {
  ADD : 0,
  SUB : 1,
  MUL : 2,
  DIV : 3,
  POW : 4
};

function startShowing() {
   PassageID = setInterval('showPassage()',100);
}

function stopShowing() {
   clearInterval( PassageID );
}

function showPassage() {
  typEnd = new Date();
  var keika = typEnd - typStart;
  var sec = Math.floor( keika/1000 );
  var mes = "時間："+sec+"秒"+"<br>ミス:"+miss_num+"回";
  document.getElementById("timer").innerHTML = mes;
}

function xgcd(a, b) { 
   if (b == 0) {
     return [1, 0, a];
   }

   temp = xgcd(b, a % b);
   x = temp[0];
   y = temp[1];
   d = temp[2];
   return [y, x-y*Math.floor(a/b), d];
}

function rand(min,max){
  return Math.floor( Math.random() * (max + 1 - min) ) + min ;
}

function gen_prob(){
  lvalue = Math.floor( Math.random() * modulo ) ;
  rvalue = Math.floor( Math.random() * modulo ) ;

  switch (proboption){
    case "arithmetic":
      op = rand(0,3);
      break;
    case "all":
      op = rand(0,4);
      break;
    case "muldivpow":
      op = rand(2,4);
      break;
  }

  switch (op) {
    case opes.ADD:
      ans = ( lvalue + rvalue ) % modulo;
      break;
    case opes.SUB:
      ans = ( lvalue - rvalue + modulo ) % modulo;
      break;
    case opes.MUL:
      ans = ( lvalue * rvalue )%modulo;
      break;
    case opes.DIV:
      while(rvalue==0){
        rvalue = Math.floor( Math.random() * modulo ) ;
      }
      rvalue_inv = xgcd(rvalue,modulo)[0];
      ans = ( lvalue * (rvalue_inv+modulo) ) % modulo;
      break;
    case opes.POW:
      while(lvalue==0){
        lvalue = Math.floor( Math.random() * modulo ) ;
      }
      ans = 1;
      for(var i=0;i<rvalue;++i){
        ans = ans * lvalue % modulo;
      }
      break;
  }
  prob_str = String(lvalue) + opstr[op] + String(rvalue) + "=";
}

function show_prob(){
  document.getElementById("problemnumber").innerHTML = "No." + String(cnt+1) + "/" + String(probsize);
  document.getElementById("problem").innerHTML = prob_str + input ;
}

function gameSet(){
  cnt=0;
  typStart = new Date();

  document.onkeydown = typeGame;
  document.getElementById("start").innerHTML = "";
  elements = document.getElementsByName( "diff" ) ;

  for ( var a="", i=elements.length; i--; ) {
    if ( elements[i].checked ) {
      proboption = elements[i].value ;
      break ;
    }
  }
  gen_prob();
  show_prob();
  startShowing();

}

function typeGame(evt){
  var kc;
  if(document.all){
    kc = event.keyCode;
  }else{
    kc = evt.which;
  }
  if(input.length>=1 && kc == 13){
    if( Number(input) == ans ){
      cnt++;
      if ( cnt < probsize ){
        prob = gen_prob();
        input = "";
        show_prob();
      }else{
        typEnd = new Date();
        var keika = typEnd - typStart;
        var sec = Math.floor( keika/1000 );
        var fin="GAME終了　時間："+sec+"秒"+" ミス:"+miss_num+"回";
        document.onkeydown = gameSet;
        cnt = 0;
        miss_num = 0;
        input = "";
        prob_str = "";
        document.getElementById("start").innerHTML = "Enterでスタート";
        document.getElementById("timer").innerHTML = fin;
        stopShowing();
        typStart = typEnd;
      }
    }else{
      miss_num++;
      input = "";
      show_prob();
    }
  }
  if(kc == 8 && input.length >= 1){
    input = input.substr(0,input.length-1);
    show_prob();
  }

  if(48 <= kc && kc <= 57 && input.length <= 1 && input != "0" ){
    input += String(kc-48);
    show_prob();
  }
}

