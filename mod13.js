
Game = function(probsize,sec,modulo) {
  this.probsize = probsize;
  this.sec = sec;
  this.modulo = modulo;
  this.cnt = 0;
  this.typStart = 0;
  this.typEnd = 0;

  this.op = 0;
  this.opstr = new Array("+","-","\\times","\\div","^");
  this.opes = {
    ADD : 0,
    SUB : 1,
    MUL : 2,
    DIV : 3,
    POW : 4
  };

  this.modes = {
    PROB : "prob",
    TIME : "time",
  };
  this.mode = "";

  this.lvalue = 0;
  this.rvalue = 0;

  this.cnt = 0;
  this.prob_str = "";

  this.input = "";
  this.ans = 0;
  this.miss_num = 0;
  this.proboption = "";

  this.PassageID = 0;
};


Game.prototype.start_timer = function(){
   this.PassageID = setInterval(function(){ game.timer_event(); },100);
};

Game.prototype.stop_timer = function(){
   clearInterval( this.PassageID );
};

Game.prototype.timer_event = function(){
  this.typEnd = new Date();
  let keika = this.typEnd - this.typStart;
  let sec = Math.floor( keika/1000 );
  let mes = "";
  switch (this.mode) {
    case this.modes.PROB:
      mes = "時間："+sec+"秒"+"<br>ミス:"+this.miss_num+"回";
      break;
    case this.modes.TIME:
      remain = this.sec - sec - 5 * this.miss_num;
      if(remain < 0){
        this.end_game();
        return;
      }
      mes = "残り時間："+remain+"秒"+"<br>解いた数:"+this.cnt;
      break;
  }
  document.getElementById("status").innerHTML = mes;
};

function xgcd(a, b) { 
   if (b == 0) {
     return [1, 0, a];
   }
   [x,y,d] = xgcd(b, a % b);
   return [y, x-y*Math.floor(a/b), d];
};

function rand(min,max){
  return Math.floor( Math.random() * (max + 1 - min) ) + min ;
};

Game.prototype.gen_prob = function(){
  this.lvalue = rand(2,this.modulo-1);
  this.rvalue = rand(2,this.modulo-1);

  switch (this.proboption){
    case "arithmetic":
      this.op = rand(0,3);
      break;
    case "all":
      this.op = rand(0,4);
      break;
    case "muldivpow":
      this.op = rand(2,4);
      break;
  }

  switch (this.op) {
    case this.opes.ADD:
      this.ans = ( this.lvalue + this.rvalue ) % this.modulo;
      break;
    case this.opes.SUB:
      this.ans = ( this.lvalue - this.rvalue + this.modulo ) % this.modulo;
      break;
    case this.opes.MUL:
      this.ans = ( this.lvalue * this.rvalue ) % this.modulo;
      break;
    case this.opes.DIV:
      rvalue_inv = xgcd(this.rvalue,this.modulo)[0];
      this.ans = ( this.lvalue * ( rvalue_inv + this.modulo ) ) % this.modulo;
      break;
    case this.opes.POW:
      this.ans = 1;
      for(let i=0;i<this.rvalue;++i){
        this.ans = this.ans * this.lvalue % this.modulo;
      }
      break;
  }
  if(this.op != this.opes.POW){
    this.prob_str = String(this.lvalue) + this.opstr[this.op] + String(this.rvalue) + "=";
  }else{
    this.prob_str = String(this.lvalue) + this.opstr[this.op] + "{" +  String(this.rvalue) + "} =";
  }
};

function render_math(){
  renderMathInElement(
      document.body,{
        delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "$", right: "$", display: false}]})
}

Game.prototype.show_prob = function(){
  if( this.mode == this.modes.PROB ){
    document.getElementById("problemnumber").innerHTML = "No." + String(this.cnt+1) + "/" + String(this.probsize);
  }
  document.getElementById("problem").innerHTML = "$" + this.prob_str + this.input + "$" ;
  render_math();
};

function selected_radio_element(elemid){
  let elements = document.getElementsByName( elemid ) ;
  for ( let a="", i=elements.length; i--; ) {
    if ( elements[i].checked ) {
      return elements[i].value;
    }
  }
  return null;
}

Game.prototype.hoge = function(){
  return this.cnt;
};

Game.prototype.init_game = function(evt){
  console.log("hello");
  let kc;
  if(document.all){
    kc = event.keyCode;
  }else{
    kc = evt.which;
  }
  if( kc != 13 ) return;

  console.log(this.hoge());
  this.cnt=0;
  this.typStart = new Date();

  document.onkeydown = function(evt){
    game.update_game(evt);
  }
  document.getElementById("start").innerHTML = "";

  this.proboption = selected_radio_element( "diff" );
  this.mode = selected_radio_element( "mode" );

  this.gen_prob();
  this.show_prob();
  this.start_timer();
};

function key2num(kc){
  if(48 <= kc && kc <= 57){
    return kc - 48;
  }else if(96 <= kc && kc <= 105){
    return kc - 96;
  }else{
    return null;
  }
}

Game.prototype.validinput = function(knum){
  let num = Number(this.input + String(knum));
  return this.input !== "0" && 0 <= num && num < this.modulo;
}

Game.prototype.update_game = function(evt){
  let kc;
  if(document.all){
    kc = event.keyCode;
  }else{
    kc = evt.which;
  }

  if(this.input.length>=1 && kc == 13){
    if( Number(this.input) == this.ans ){
      this.cnt++;
      this.gen_prob();
      this.input = "";

      if( this.mode == this.modes.PROB && this.cnt >= this.probsize ){
        this.end_game();
      }else{
        this.show_prob();
      }

    }else{
      this.miss_num++;
      this.input = "";
      this.show_prob();
    }
  }
  if(kc == 8 && this.input.length >= 1){
    this.input = this.input.substr(0,this.input.length-1);
    this.show_prob();
  }

  knum = key2num(kc);
  if( knum != null && this.validinput( knum ) ){
    this.input += String(knum);
    this.show_prob();
  }
};

Game.prototype.end_game = function(){
  if( this.mode == this.modes.PROB ){
    this.typEnd = new Date();
    let keika = this.typEnd - this.typStart;
    let sec = Math.floor( keika/1000 );
    let fin="終了 時間："+sec+"秒"+" ミス:"+this.miss_num+"回";
    document.getElementById("status").innerHTML = fin;
  }else{
    let fin = "解いた数:"+this.cnt;
    document.getElementById("status").innerHTML = fin;
    document.getElementById("problem").innerHTML = "$" + this.prob_str + this.ans + "$" ;
    render_math();
  }

  document.onkeydown = function(evt){
    game.init_game(evt);
  }
  this.cnt = 0;
  this.miss_num = 0;
  this.input = "";
  this.prob_str = "";
  document.getElementById("start").innerHTML = "Press Enter to start";
  this.stop_timer();
  this.typStart = this.typEnd;
};

let game = new Game(10,60,13);
document.onkeydown = function(evt){
  game.init_game(evt); 
}


