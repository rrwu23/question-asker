let timer;
class GENQ {

    static trans(s){
        return s.split(" ").join("").toLowerCase();
    }

    static opers = ['*', '/', '+', '-'];
    static questionDB = null; 

    static async load(){
        if (!GENQ.questionDB){
            const file = 'questionBetter.json';
            try{
                var res = await fetch('./public/' + file);
                if (!res.ok){
                    throw new Error('ahhhhhh'+ res.status)
                }
                GENQ.questionDB = await res.json();
                console.log('success')
            } catch{
                console.log('failed to load ' + file);

                GENQ.questionDB = {'time': {}}
            }
        }   
    }
    //--------------------methods/ functions in sleep:----------------------//
    static slice(idx, str)
    {

    }

    

    static gen_q1(){
        var a = 1+Math.floor(Math.random()*1000);
        var b = 1+Math.floor(Math.random()*1000);
        var c = 1+Math.floor(Math.random()*1000);
        var d = 1+Math.floor(Math.random()*1000);
        var o = _.sampleSize(GENQ.opers, 3);
        return `${a} ${o[0]} ${b} ${o[1]} ${c} ${o[2]} ${d}`;
        
    }

    static gen_q2(){

    }

    static filter(){
        
    }
    //----------------------------------------------------------------------//

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

    static inInterval(n, arr){
        if (n <= arr[1] && n >= arr[0]){
            return n;
        }

        else{
            if (n > arr[1]){
                return arr[1]
            } else{
            return arr[0];
            }
        }
    }

}

class question_asker {

    constructor (){
        this.qLoc = 'time';
        this.mode = 'practice';
        this.quizTime = 300 //in seconds
        this.r=[];
        this.quiz_r = new Map();
        this.i = 0;
        this.q = Object.entries(GENQ.questionDB.time);
        this.selq = this.q;
        this.correctness = '"cannot calculate" ';
        this.attempt = new Map();
        this.quizResult = []
        this.data = {'time': []}
    }
    //the class constructor

    saveData(){
        this.data[this.qLoc] = this.r
    }

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

    pre(){
        //set attempt first
        this.setA();
        //clean this.r
        this.removeExtra()
    }

    checkanwser(a){
        if (this.mode == 'practice'){
        if (GENQ.trans(a) == GENQ.trans(this.q[this.i][1])){
            
                this.r.push([this.i, 1, $('#null').val()])
                this.saveData()
                var audio = new Audio('./assets/good.mp3');
                audio.play();
            } else{
                this.r.push([this.i, 0, $('#null').val()]) 
                this.saveData();
                
                var audio = new Audio('./assets/bad.mp3');
                audio.play();
            }

        this.pre(); //prepare for up()

         //moves upward by one
        }

        else if (this.mode == 'quiz'){
            this.quiz_r.set(this.i, a)
        }
        up(this.i+1, this);
    }


    removeExtra(){

        const data = GENQ.ReplaceRepeatedItemsFromSubArr(this.r, 0, 2);
        console.log('data: '+JSON.stringify(data))
        this.r = GENQ.RemoveRepeateditemsFromSubArr(data, 0)
        this.saveData()
        
    }

    update_static_ui(){
        
        //inits question 
        $('.questiona').html('');
        $('#ok').html(`question : ${this.i + 1}/${this.selq.length}`);
        console.log(this.i)
        //updates the radar bar UI
        console.log('current question: ' + this.selq[this.i],"i: " + this.i);
        $('.questiona').html(this.selq[this.i][0])
        //debugs:
        // console.log(this.q.length)
        // console.log(GENQ.find(this.r, this.i, 0));
        
        $('#null').css('color', 'white').css('background', 'black');
        this.cal();
        $('.correctness').html('correctness: ' + this.correctness + '%');
        $('.qd').html('questions done: ' + this.r.length);
        //debug
        //console.log('loading attempt: '+this.attempt.get(this.i));

        $('.trys').html('attempt: ' + (this.attempt.get(this.i)||0));

        if (this.mode == 'quiz'){
            $('.g').css('visibility', 'visible');
            $('.restart').css('display', 'none');
            $('.nav').css('display', 'none');
            $('.wc').css('display', 'none')
            $('.qd').css('display', 'none');
            $('.trys').css('display', 'none');
            
        } else if (this.mode == 'practice'){
            $('.g').css('visibility', 'hidden');
            $('.restart').css('display', 'block');
            $('.nav').css('display', 'block');
            $('.wc').css('display', 'block');
            $('.qd').css('display', 'block');
            $('.trys').css('display', 'block');

        }

    } 
    

    update_dynamic_ui(){
        console.log('outer' + this.mode , this.mode == 'practice')
        //processes anwser and dynamic UI
        //not placed in check anwser because the purpose of status is to see what you got first try and tell if you are correct or not//
        if (this.mode == 'practice'){
        $('#null').val(GENQ.find(this.r, this.i, 0)[2]);
        if (JSON.stringify(GENQ.filterSubArray(this.r, 0, this.i)) != JSON.stringify([])){ //make sure that anwser is not empty
            if (GENQ.filterSubArray(this.r, 0, this.i)[0][1] === 1){ // anwser correct

                $('.wc').addClass('green')
            } else{ //anwser incorrect

                $('.wc').addClass('red');
            }

        } else{

            $('.wc').addClass('white')
        }

        } else if (this.mode == 'quiz'){
            $('#null').val(this.quiz_r.get(this.i));
            console.log(this.mode)
        }
    }

    update(){
        //init for the status circle
        $('.wc').removeClass('red');
        $('.wc').removeClass('green');
        $('.wc').removeClass('white');
        console.log('called')
        //updates the ui after q is updated
        this.update_static_ui();
        this.update_dynamic_ui();

    }

    
    initForQuiz(){
        var seconds = this.quizTime;
        updateTime(seconds, this);
        if (!timer){
            timer = setInterval(()=>{
                seconds --
                console.log(seconds)
                updateTime(seconds, this)
                if (seconds == 0){
                    clearTimer()
                    console.log('time up')
                    console.log(this)
                    checkAllAnswer(this);
                } 

            }, 1000)
        }

        //make sure to init UIs
        $('.sheet').html('').css('visibility', 'hidden');
        $('.sheet').css('display', 'grid');
        $('.g').css('visibility', 'visible')
        $('.submit').css('visibility', 'visible');
        $('.timedisplay').css('visibility', 'visible');
        //init all variables
        this.i = 0;
        this.correctness = '"cannot calculate"';
        this.quiz_r.clear();
        this.quizResult = [];
        this.selq = _.sampleSize(this.q, 10)
    }

    initForPractice(){
        
        //update ui
        $('.sheet').css('display', 'none');
        $('sheet').html('');
        $('.submit').css('visibility', 'visible')
        $('.timedisplay').css('visibility', 'hidden');
        //init all variables
        this.i = 0;
        this.correctness = '"cannot calculate"';
        this.selq = this.q;
        clearTimer();

    }

    changeModule(module){
        console.log('called')
        
        this.q = Object.entries(GENQ.questionDB[module]);
        this.qLoc = module
        changeMode(this.mode, q)
        this.r = (this.data[this.qLoc] || []);
        this.initForPractice();
        up(0, this)
        console.log(this.q)
    }

}

//--------------------------------------//
function up(n, q){
    
    // if n is a float: 8.9, 1.4 or NaN up will return nothing and stop
    if (Number.isNaN(n) || !Number.isInteger(n)){
        return;
    }

    //make sure that cannot exceed limit
    
    n = GENQ.inInterval(n, [0, q.selq.length-1])

    q.i = n;

    //hides back and next button if on mininum index or maximum index
    if (n===0){
        $('.back').css('visibility', 'hidden')
    } else{
        $('.back').css('visibility', 'visible')
    }
    //debug
    console.log([n, q.selq.length-1])
    if (n === (0 + q.selq.length-1)){
        $('.next').css('visibility', 'hidden')
    } else{
        $('.next').css('visibility', 'visible')
    }

    
/*    update<-______
        |           |
        \/          \
        render _____|

*/
    //updates
    q.update();


}

function go_back(q){
    up(q.i-1, q)
}

function go_next(q){
    up(q.i+1, q)
}

function renderChart(threeDArray, q){
    $('.sheet').css('visibility', 'visible')
    for (var i of threeDArray){
        for (var j of i){
            $('.sheet').append(`<div class="cell">${j}</div>`)
        }
    }
    $('.correctness')
        .html(`final score: ${GENQ.filterSubArray(threeDArray, 2, '✔').length*10} out of 100`);
    $('.submit').css('visibility', 'hidden')
    $('.g').css('visibility', 'hidden')
    $('.timedisplay').css('visibility', 'hidden');

    q.mode = 'static'
    
}

function updateTime(seconds, q){
    if (q.mode = 'quiz'){
        let mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        let secs = String(seconds % 60).padStart(2, '0');
        $('.timedisplay').html(`Remaining time: ${mins}:${secs}`) 
    }
}

function checkAllAnswer(q){
    if (q.mode == 'quiz'){
        if (timer){
            clearTimer()
        }
        console.log('run')
        if (q.quiz_r.size === q.selq.length){
            
            console.log([...q.quiz_r])
            for (var i = 0; i<q.selq.length; i++){
                console.log(i)
                console.log([...q.quiz_r]);
                if (GENQ.trans(String([...q.quiz_r][i][1])) == GENQ.trans(String(q.selq[i][1]))){
                    console.log('hi: ' + [...q.quiz_r][i])
                    q.quizResult.push([i+1, [...q.quiz_r][i][1], '✔'])
                } else{
                    console.log('hi: ' + [...q.quiz_r][i])
                    q.quizResult.push([i+1, [...q.quiz_r][i][1], `correct anwser: ${String(q.selq[i][1])}`])
                }
            }
        } else{
            console.log('adding blank elements because undone')
            for (var i = q.quiz_r.size; i < q.selq.length; i++){
                console.log('setting...')
                q.quiz_r.set(i, 'blank');
                
            }

            return checkAllAnswer(q)
        }
    } else{
        console.log('check_all_anwser can only be used in quiz mode', q.mode)
        return '';
    }
    console.log(q.quizResult);
    renderChart(q.quizResult, q);
    return q.quizResult;
}

function reset(q){
    if (confirm('reset ?')){
        q.initForPractice();
        q.r = [];
        q.i = 0;

        up(0, q)

    } else{
        return
    }
}



function clearTimer(){
    clearInterval(timer);
    timer = null;
}

async function main(){
    await GENQ.load();
    const q = new question_asker();
    window.q = q
    return q;
}

function changeMode(mode, q){
    q.mode = mode;
    up(q.i, q)
}


//---------------------------------------//



//make sure that data is loaded before use 
main().then((q)=>{
    q.initForPractice();
    changeMode('practice', q)
    //debug
    //
    up(0, q)
    clearTimer()

    $('.submit').click(()=>{
        var result = $('#null').val()
        if (GENQ.trans(result) != ''){
            q.checkanwser(result)
        }
    });


    $('.go').click(()=>{
        up(Number($('.interval').val())-1, q)
        $('.interval').val('')
    });

    $('.back').click(()=>{
        go_back(q);
    });

    $('.next').click(()=>{
        go_next(q);
    });

    $('.restart').click(()=>{
        reset(q)
    })

    $('.g').click(()=>{
        console.log(q.quiz_r)
        checkAllAnswer(q);
    })

    $('.practice').click(()=>{
        //Make sure UIs and Properties are initialized before use
        q.initForPractice();
        changeMode('practice', q)
    });

    $('.quiz').click(()=>{
        //make sure UIs and Properties are initialized before use
        q.initForQuiz();
        changeMode('quiz', q)
        
    });
    $('.sheet').css('visibility', 'hidden')

    $('.module').children().each(function (){
        $(this).click(function(){
            q.changeModule($(this).text());
        })
    })

});
