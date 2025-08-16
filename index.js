

var opers = ['*', '/', '+', '-'];

var correctness = 100;

class GENQ {

    static trans(s){
        return s.split(" ").join("").toLowerCase();
    }


    static questionDB = null; 

    static async load(){
        if (!GENQ.questionDB){
          var res = await fetch('./public/questions.json');
          GENQ.questionDB = await res.json();
          GENQ.questionDB = GENQ.questionDB.time
        }   
    }
    static slice(idx, str)
    {

    }

    static find(arr, e, idx, op=0){
        var result = [];
        for (const i of arr){
            if (i[idx] === e){
                 result.push(i)
            }
        }
        if (result.length===0){
            return [''];
        }
        return result[op]
    }

    static gen_q1(){
        var a = 1+Math.floor(Math.random()*1000);
        var b = 1+Math.floor(Math.random()*1000);
        var c = 1+Math.floor(Math.random()*1000);
        var d = 1+Math.floor(Math.random()*1000);
        var o = _.sampleSize(opers, 3);
        return `${a} ${o[0]} ${b} ${o[1]} ${c} ${o[2]} ${d}`;
        
    }

    static gen_q2(){

    }

    static filter(){
        
    }

    static hasAndRemoveSUB(arr, idx){
        console.log([Array.isArray(arr), arr])
        var set = new Set();
        return arr.filter(i =>{
            if (set.has(i[idx])){

                return false
            } else{
                set.add(i[idx])
                return true;
            }
        })
    }

    static selAllSubEl(arr, idx){
        var res = [];
        for (const i of arr){
            console.log('[debug]'+i)
            res.push(i[idx]);
        }
        return res;
    }

    static sum(arr){
        return arr.reduce((t, e)=>t+e, 0);
    }
}

class question_asker {

    static async init(){
        await GENQ.init();
        GENQ.questionDB.time;
        
    }

    constructor (){
        this.question = GENQ.questionDB;
        this.r=[];
        this.i = 0
        this.q = Object.entries(this.question) 
    }
    //the class constructor

    cal(){
        if(this.r.length != 0){
            correctness = Math.round(GENQ.sum(GENQ.selAllSubEl(this.r, 1))/this.r.length*100);
        }
        
    }

    checkanwser(a){
        if (a == GENQ.trans(this.q[this.i][1])){
                this.r.push([this.i, 1, $('#null').val()])
                var audio = new Audio('./assets/good.mp3');
                
                audio.play();
                
            } else{
                this.r.push([this.i, 0, $('#null').val()])  
                var audio = new Audio('./assets/bad.mp3');

                audio.play();
            }
        this.removeExtra()
        up(this.i+1);
    }


    removeExtra(){

        //console.log(GENQ.selAllSubEl(this.r , 0));
        this.r = GENQ.hasAndRemoveSUB(this.r, 0)
        
    }

    update(){
        $('.wc').removeClass('red');
        $('.wc').removeClass('green');
        $('.wc').removeClass('white');
        console.log(q)
        if (this.r[this.i] != undefined){
            if (this.r[this.i][1] == 0){
                $('.wc').addClass('red');
            }

            else{
                $('.wc').addClass('green')
            }
        } else{
            $('.wc').addClass('white')
        }


        $('.questiona').html(this.q[this.i][0])
        console.log(this.q.length)
        console.log(GENQ.find(this.r, this.i, 0));
        $('#null').val(GENQ.find(this.r, this.i, 0)[2]);
        $('#null').css('color', 'white').css('background', 'black');
        this.cal()
        $('.correctness').html('correctness: ' + correctness + '%')
        $('.qd').html('questions done: ' + this.r.length)
        if (this.r[this.i]){
            if (this.r[this.i][1] == 1){
                $('.gb').html('status: correct');
            } else{
                $('.gb').html('correct anwser: ' + this.q[this.i][1])
            }

            
        }

        else{
            $('.gb').html('status: none');
        }
        
    }

}
var q;
async function main(){
    await GENQ.load();
    q = new question_asker();

}

function show(){
    let txt = $('#null').val();
    let result = GENQ.trans(txt)
    console.log(result)
    return result;
}

main().then(()=>{
    up(0)
})
$('.submit').click(()=>{
    const result = show();
    if (! result == ''){
        q.checkanwser(result)
    }
});

function up(n){
    $('.questiona').html('');
    q.i = n;
    
    if (n===0){
        $('.back').css('visibility', 'hidden')
    } else{
        $('.back').css('visibility', 'visible')
    }
    console.log([n, q.q.length])
    if (n === (q.q.length-1)){
        $('.next').css('visibility', 'hidden')
    } else{
        $('.next').css('visibility', 'visible')
    }

    $('#ok').html(`question : ${q.i+1}/${q.q.length}`)
    q.update();
}

$('#d1').click(()=>{
    up(0)
})

$('#d2').click(()=>{
    up(20)
})

$('#d3').click(()=>{
    up(40)
})

$('#d4').click(()=>{
    up(60)
})

$('#d5').click(()=>{
    up(80)
})

function go_back(){
    up(q.i-1)
}

function go_next(){
    up(q.i+1)
}



function reset(){
    if (confirm('reset ?')){
        q.i = 0;
        q.r = [];
        correctness = 0;

        q.update();

    } else{
        return
    }
}

