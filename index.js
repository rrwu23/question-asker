
class GENQ {

    static trans(s){
        return s.split(" ").join("").toLowerCase();
    }

    static opers = ['*', '/', '+', '-'];
    static questionDB = null; 

    static async load(){
        if (!GENQ.questionDB){
            try{
                var res = await fetch('./public/questions.json');
                if (!res.ok){
                    throw new Error('ahhhhhh'+res.status)
                }
                GENQ.questionDB = await res.json();
            } catch{
                console.log('failed to load questions.json');

                GENQ.questionDB = {'time': {}}
            }
        }   
    }
    //--------------------methods/ functions in sleep:------------------------//
    // static slice(idx, str)
    // {

    // }

    

    // static gen_q1(){
    //     var a = 1+Math.floor(Math.random()*1000);
    //     var b = 1+Math.floor(Math.random()*1000);
    //     var c = 1+Math.floor(Math.random()*1000);
    //     var d = 1+Math.floor(Math.random()*1000);
    //     var o = _.sampleSize(opers, 3);
    //     return `${a} ${o[0]} ${b} ${o[1]} ${c} ${o[2]} ${d}`;
        
    // }

    // static gen_q2(){

    // }

    // static filter(){
        
    // }
    //--------------------------------------------------------------------------//

    static ReplaceRepeatedItemsFromSubArr(arr, idx, replaceIdx) {
        let map = new Map();

        // First pass: remember the last occurrence of each value at idx
        for (let sub of arr) {
            map.set(sub[idx], sub[replaceIdx]);
            console.log(map)
        }
    
        // Second pass: replace repeated items with the last seen one
        for (let sub of arr) {
            if (map.has(sub[idx])) {
                sub[replaceIdx] = map.get(sub[idx]);

            }
        }

        return arr;
    }

    static RemoveRepeateditemsFromSubArr(arr, idx){
        const seen = new Set();
        return arr.filter((item)=>{
            //repeated element in sub array
            if (seen.has(item[idx])){
                return false
            } else{ // new element in sub array
                seen.add(item[idx])
                return true
            }
        })
    }
    static filterSubArray(arr, idx, val){
        var res = [];
        for (const i of arr){
            console.log('[debug]'+i)
            if (i[idx] == val){
                res.push(i)
            }
        
        }
        return res;
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

}

class question_asker {

    constructor (){
        this.question = GENQ.questionDB.time;
        this.r=[];
        this.i = 0
        this.q = Object.entries(this.question) 
        this.correctness = '"cannot calculate" ';
        this.attempt = new Map();
    }
    //the class constructor

    cal(){
        if(this.r.length != 0){
            this.correctness = Math.round(GENQ.filterSubArray(this.r, 1, 1).length/this.r.length*100);
        }
        
    }

    setA(){
        if (this.attempt.has(this.i)){
            this.attempt.set(this.i, this.attempt.get(this.i) + 1)
        } else{
            this.attempt.set(this.i, 1)
        }
        console.log(this.attempt);
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
        this.setA();
        this.removeExtra()
        up(this.i+1);
        
        console.log('attempt set success!')
        
    }


    removeExtra(){

        const data = GENQ.ReplaceRepeatedItemsFromSubArr(this.r, 0, 2);
        console.log('data: '+JSON.stringify(data))
        this.r = GENQ.RemoveRepeateditemsFromSubArr(data, 0)
        
    }

    update(){
        //if statements and complex UI
        //init for the status circle
        $('.wc').removeClass('red');
        $('.wc').removeClass('green');
        $('.wc').removeClass('white');

        //updates the radar bar UI
        $('.questiona').html(this.q[this.i][0])
        //debugs:
        // console.log(this.q.length)
        // console.log(GENQ.find(this.r, this.i, 0));
        $('#null').val(GENQ.find(this.r, this.i, 0)[2]);
        $('#null').css('color', 'white').css('background', 'black');
        this.cal();
        $('.correctness').html('correctness: ' + q.correctness + '%');
        $('.qd').html('questions done: ' + this.r.length);
        //debug
        console.log('loading attempt: '+this.attempt.get(this.i));

        $('.trys').html('attempt: ' + (this.attempt.get(this.i)||0));

        //processes anwser and dynamic UI
        if (JSON.stringify(GENQ.filterSubArray(this.r, 0, this.i)) != JSON.stringify([])){ //make sure that anwser is not empty
            if (GENQ.filterSubArray(this.r, 0, this.i)[0][1] === 1){ // anwser correct
                $('.gb').html('status: correct');
                $('.wc').addClass('green')
            } else{ //anwser incorrect
                $('.gb').html('correct anwser: ' + this.q[this.i][1])
                $('.wc').addClass('red');
            }

            
        } else{
            $('.gb').html('status: none');
            $('.wc').addClass('white')
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
    //make sure that data is loaded before use 
    up(0)
});


$('.submit').click(()=>{
    const result = show();
    if (result != ''){
        q.checkanwser(result)
    }
});

//--------------------------------------//
function up(n){
    if (Number.isNaN(n) || !Number.isInteger(n)){
        return;
    }
    $('.questiona').html('');
    if (n > (q.q.length-1)){
        n = q.q.length-1
    } else if (n < 0){
        n = 0
    }


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
//---------------------------------------//


//asings each day button with a eventlistner
$('#d1').click(()=>{
    up(0)

})

$('#d2').click(()=>{
    up(20);

})

$('#d3').click(()=>{
    up(40);

})

$('#d4').click(()=>{
    up(60)

})

$('#d5').click(()=>{
    up(80)

})

$('.go').click(()=>{
    up(Number($('.interval').val())-1)
    $('.interval').val('')
})

function go_back(){
    up(q.i-1)
}

function go_next(){
    up(q.i+1)
}



function reset(){
    if (confirm('reset ?')){
        q.r = [];
        q.correctness = 100;

        up(0)

    } else{
        return
    }
}

