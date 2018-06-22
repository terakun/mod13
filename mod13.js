document.onkeydown = set_game;

let cnt=0;          
let typStart,typEnd;
let probsize = 10;
let prob_str = "";
let input = "";
let ans = 0;
let miss_num = 0;
let elements;
let proboption = "";

let modulo = 13;
let lvalue = 0;
let rvalue = 0;

let op = 0;
let opstr = new Array("+","-","\\times","\\div","^");
let opes = {
  ADD : 0,
  SUB : 1,
  MUL : 2,
  DIV : 3,
  POW : 4
};

let modes = {
  PROB : "prob",
  TIME : "time",
}

function startShowing() {
   PassageID = setInterval('timer_event()',100);
}

function stopShowing() {
   clearInterval( PassageID );
}

function timer_event() {
  typEnd = new Date();
  let keika = typEnd - typStart;
  let sec = Math.floor( keika/1000 );
  let mes = "";
  switch (mode) {
    case modes.PROB:
      mes = "時間："+sec+"秒"+"<br>ミス:"+miss_num+"回";
      break;
    case modes.TIME:
      remain = 60 - sec - 5 * miss_num;
      if(remain < 0){
        end_game();
        return;
      }
      mes = "残り時間："+remain+"秒"+"<br>解いた数:"+cnt;
      break;
  }
  document.getElementById("status").innerHTML = mes;
}

function xgcd(a, b) { 
   if (b == 0) {
     return [1, 0, a];
   }
   [x,y,d] = xgcd(b, a % b);
   return [y, x-y*Math.floor(a/b), d];
}

function rand(min,max){
  return Math.floor( Math.random() * (max + 1 - min) ) + min ;
}

function gen_prob(){
  lvalue = rand(2,modulo-1);
  rvalue = rand(2,modulo-1);

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
      ans = ( lvalue * rvalue ) % modulo;
      break;
    case opes.DIV:
      rvalue_inv = xgcd(rvalue,modulo)[0];
      ans = ( lvalue * ( rvalue_inv + modulo ) ) % modulo;
      break;
    case opes.POW:
      ans = 1;
      for(let i=0;i<rvalue;++i){
        ans = ans * lvalue % modulo;
      }
      break;
  }
  if(op != opes.POW){
    prob_str = String(lvalue) + opstr[op] + String(rvalue) + "=";
  }else{
    prob_str = String(lvalue) + opstr[op] + "{" +  String(rvalue) + "} =";
  }
}

function show_prob(){
  if( mode == modes.PROB ){
    document.getElementById("problemnumber").innerHTML = "No." + String(cnt+1) + "/" + String(probsize);
  }
  document.getElementById("problem").innerHTML = "$" + prob_str + input + "$" ;
  renderMathInElement(
      document.body,{
        delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "$", right: "$", display: false}]})
}

function set_game(){
  cnt=0;
  typStart = new Date();

  document.onkeydown = update_game;
  document.getElementById("start").innerHTML = "";
  elements = document.getElementsByName( "diff" ) ;
  for ( let a="", i=elements.length; i--; ) {
    if ( elements[i].checked ) {
      proboption = elements[i].value ;
      break ;
    }
  }

  elements = document.getElementsByName( "mode" ) ;
  for ( let a="", i=elements.length; i--; ) {
    if ( elements[i].checked ) {
      mode = elements[i].value ;
      break ;
    }
  }

  gen_prob();
  show_prob();
  startShowing();
}

function key2num(kc){
  if(48 <= kc && kc <= 57){
    return kc - 48;
  }else if(96 <= kc && kc <= 105){
    return kc - 96;
  }else{
    return null;
  }
}

function update_game(evt){
  let kc;
  if(document.all){
    kc = event.keyCode;
  }else{
    kc = evt.which;
  }

  if(input.length>=1 && kc == 13){
    if( Number(input) == ans ){
      cnt++;
      prob = gen_prob();
      input = "";

      if( mode == modes.PROB && cnt >= probsize ){
        end_game();
      }else{
        show_prob();
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

  knum = key2num(kc);
  if( knum != null && (( input.length == 0 ) || ( input == "1" && knum < 3 )) ){
    input += String(knum);
    show_prob();
  }
}

function end_game(){
  if( mode == modes.PROB ){
    typEnd = new Date();
    let keika = typEnd - typStart;
    let sec = Math.floor( keika/1000 );
    let fin="終了 時間："+sec+"秒"+" ミス:"+miss_num+"回";
    document.getElementById("status").innerHTML = fin;
  }else{
    let fin = "解いた数:"+cnt;
    document.getElementById("status").innerHTML = fin;
  }

  document.onkeydown = set_game;
  cnt = 0;
  miss_num = 0;
  input = "";
  prob_str = "";
  document.getElementById("start").innerHTML = "Press any key";
  stopShowing();
  typStart = typEnd;
}

