class CalcController {

    /*Metodo construtor é chamado automaticamente quando existe a instancia de uma classe. */
    constructor() {
        /* displayCalc Adiciona o display dos números do app.*/
        /* this. faz referência ao objeto que foi instanciado na classe. */
        /*Como vamos usar (pt-BR) em varios lugares, devemos criar um atributo*/
        this._lastOperator = '';
        this.lastNumber = '';
        this._operation = []; /* atributo para armazenar as operações. */
        this._locale = 'pt-BR'; 
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this.currentDate;
        this.initialize();
        this.initButtonsEvents()
        this.initKeyboard();
        this._audioOnOff = false;
        this._audio = new Audio('click.mp3');


    }   

        
            /* Criado com a intenção de substituir o addEventListener que só executa um evento por vez. */
    /* elements corresponde à btn, events à click, drag e fn à função e=>{}. */
    
    pasteFromClipbard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('text');

            this.displayCalc = parseFloat(text);

            console.log(text);
        });

    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc; 

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");
        // copia tudo que for selecionado

        input.remove();
    }

    initialize() {

    

        this.setDisplayDateTime();

        /* Set interval - Define o intervalo para ele ficar executando em milesegundos. */
        /* => - Arrow Functions servem para definir uma função sem usar a palavra function */
        setInterval(() =>{

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipbard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{

                this.toggleAudio();

            });
        });
        
    }

    toggleAudio(){
        /* Mesma funcionalidade do código abaixo, porém menos linhas de códigos.
       this._audioOnOff = (this._audioOnOff) ? false : true;  */
       
       // Mesma funcionalidade do código acima, porém menos linhas ainda.
       this._audioOnOff = !this._audioOnOff;

       /* if(this._audioOnOff){  
            this._audioOnOff = false;
        } else {
            this._audioOnOff = true;
        }*/

    }

    playAudio(){

        if(this._audioOnOff){

            this._audio.currentTime = 0;
            // Faz com que o audio do click não fique com atraso.

            this._audio.play();
        }
        
    }

    initKeyboard(){

        document.addEventListener('keyup', e =>{
           
            this.playAudio();

            switch(e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;

                case '.':
                case ',':
                    this.addDot();
                    break;
                
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':               /* parseInt analisa o valor em string e retorna um inteiro na base especificada. */
                    this.addOperation(parseInt(e.key));  /* irá adicionar na array o valor recebido pelo botão.*/
                    break;


                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
    
            }  

        });

    }

            /* Criado com a intenção de substituor o addEventListener que só executa um evento por vez. */
    /* elements corresponde à btn, events à click, drag e fn à função e=>{}. */

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });



    }

    /* São métodos de ação dos botões da calculadora. */
    clearAll(){
        this._operation = []; /*clearall recebe um array vazio para retornar a calculadora do zero.*/
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    
    }

    clearEntry(){

        this._operation.pop(); /* clear entry recebe opeartion.pop, que remove o Último item adicionado à array. */
        this.setLastNumberToDisplay();
    }

    /* Método que vai adicionar uma operação. */

    getLastOperation(){
        /**Esse método irá pegar sempre a última operação. length-1 retornará sempre o último elemento de uma array */
        return this._operation[this._operation.length -1];
    }

    setLastOperation(value){

        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value){ //Esse método irá analisar se existe o valor dentro array.

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }


    pushOperation(value){
        this._operation.push(value);

        if (this._operation.length > 3){

            
            
            this.calc();

            //console.log(this._operation);
        }
    }

    getResult(){

        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
        }, 1);

        }
    }

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length <3){

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){

            last = this._operation.pop();
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3){
            

            this._lastNumber = this.getLastItem(false);
        }


        let result =  this.getResult();

        if (last == '%'){

            result /= 100;

            this._operation = [result];

        } else {
            

            this._operation = [result];

            if(last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._operation.length -1; i >= 0; i--){

            if (this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
      
        }

        if(!lastItem){
                                    // ? = então  /  : = senão
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;

    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);
        
        if(!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    }

    addOperation(value) {

        /* isNaN = is not a number e essa condição if irá verficar se o último botão clicado não é ńumerico. */
        //console.log('A', value, isNaN(this.getLastOperation()));

        if (isNaN(this.getLastOperation())) { //Se for string

            if (this.isOperator(value)) {
                // Esse método irá trocar o operador selecionado se for preciso.
                this.setLastOperation(value);
                

            } else {//else if(isNaN(value)) {
                  //Outra coisa selecionada ex: igual ou ponto. 
                //console.log(value);
            


                this.pushOperation(value);
                this.setLastNumberToDisplay();
                
            }
            

        } else { //Se for número
            
            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

            //toString é usado para converter os valores númericos em strings para que possam ser concatenados.
            //esse método também precisa ser armazenado em uma variavel para depois ser adicionado à uma array.
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(newValue);/* Método .push adiciona um item na array (matriz) */
            }
            
            // atualizar display
            this.setLastNumberToDisplay();
        }
            
        //console.log(this._operation);

    }

    setError(){

        this.displayCalc = "Error"; /* informa a palavra error quando necessário.*/
    }

    addDot(){

        let lastOperation = this.getLastOperation();
        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        } else {
            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();


    }


    execBtn(value){

        this.playAudio();

        switch(value){

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;
            
            case 'soma':
                this.addOperation("+");
                break;

            case 'subtracao':
                this.addOperation("-");
                break;

            case 'divisao':
                this.addOperation("/")
                break;

            case 'multiplicacao':
                this.addOperation("*");
                break;
            
            case 'porcento':
                this.addOperation("%");
                break;
            
            case 'igual':
                this.calc();
                break;

            case 'ponto':
                this.addDot();
                break;
            

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':               /* parseInt analisa o valor em string e retorna um inteiro na base especificada. */
                this.addOperation(parseInt(value));  /* irá adicionar na array o valor recebido pelo botão.*/
                break;

            default:
                this.setError();
                break;

        }   

    }

    initButtonsEvents(){

        /* usando o .querySelector ele trará apenas o primeiro elemento encontrado, caso hajam mais elementos
        utilizamoso o .querySelectorALL*/

        let buttons = document.querySelectorAll("#buttons > g, #parts >g");


        /* no for each se usarmos mais de um parâmetro, devemos deixa-lo entre parênteses!
        ex: forEach(btn => {})  forEach(btn, index )=>{}) */

        buttons.forEach((btn, index)=>{

                   /* Recebe eventos do tipo click ou function e o for each irá percorrer o html para 
       encontrar cada tag com o valor "btn" */
       /* btn.addEventListener é substituindo por uma classe feita pelo dev para executar mais de uma evento.
       uma vez que o addEventListener só executa um evento por vez. */

            this.addEventListenerAll(btn,'click drag ', e => {

                
                this.execBtn(btn.className.baseVal.replace("btn-",""));
                //console.log(btn.className.baseVal.replace("btn-", ""));
                
    
            });

            /* esse metedo criado aplica o estilo do mouse quando ele é passado por cima de algum botão. */

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{

                btn.style.cursor = "pointer";

            });

        });
    }
        


            
            /* displayDate e displayTame usando locale pegará a data atual do local que o usário está usando o app.*/ 
            
            /* esse this.setDisplayDateTime(); pode ser usado para chamar as duas linhas acima, deixando o código mais simplificado. 
         
            
            this.displayDate = this.currentDate.toLocaleDateString(this._locale)
            this.displayTime = this.currentDate.toLocaleTimeString(this._locale) */


        /* Função setTimeout serve para programar a hora de algo aparecer ou finalizar no script 
        setTimeout(() =>{   (A função setInterval deverá ser colocada dentro de uma variavel. 
        Ex let interval =  setInterval(() =>{)

            clearInterval(interval);

        }, 10000) */

        /*código refatorado que depois pode ser removido também, a partir do setter e getter definido
        this._dateEl.innerHTML = "06/08/2019";
    
        /*código comum
        dateEl.innerHTML = "01/05/2020";
        timeEl.innerHTML = "00:00"; */
    
    /* Esse método foi criado por ser usado mais de uma vez, sendo assim basta chamato com this.setDisplay...*/
    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit", /** personaliza o dia em 2 dígitos */
            month: "long", /** personaliza o mês completo ou short para abreviar */
            year: "numeric" /** personaliza o ano com 4 dígitos */
        })
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale)

    }

    get displayTime(){
        return this._timeEl.innerHTML;
    }

    set displayTime(value){
        return this._timeEl.innerHTML = value;

    }

    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }

    /* get retorna o valor que esta guardado em _displayCalc que são valores diferentes. */
    get displayCalc() {
        /* return serve para registrar (log) quantas vezes e de onde veio essa chamada. */
        return this._displayCalcEl.innerHTML

    }
    /* Set serveria para mudar o atributo displayCalc. */
    /* toda vez que você criar um atributo privado, você precisa usar o geter e seter dele. */
    set displayCalc(value) {

        if(value.toString().length > 10){
            this.setError();
            return false;
        }

        this._displayCalcEl.innerHTML = value;
    }
    

    get currentDate() {
        return new Date(); /*this._currentDate; é modificado por new data (); para entregar a data atual */
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}

