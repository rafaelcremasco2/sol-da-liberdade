// função para iniciar o jogo
function start() {
    // deixa o jogo em tela cheia
    document.documentElement.requestFullscreen();

    $("#inicio").hide();
	$("#fundoGame").append("<div id='jogador' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo2' class='anima2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");
    $("#fundoGame").append("<div id='botao-atirar'></div>");
    $("#fundoGame").append("<div id='botao-subir'></div>");
    $("#fundoGame").append("<div id='botao-descer'></div>");
    
    // Variáveis globais
    var LARGURA_CONTANIER = $('#container').css('width');
    var ALTURA_CONTANIER = $('#container').css('height');
    const ALTURA_MAXIMA_JOGADOR = 60;
    var ALTURA_MINIMA_JOGADOR = parseInt(parseInt(ALTURA_CONTANIER) * 0.65);
    var ALTURA_MINIMA_INIMIGO_1 = ALTURA_MINIMA_JOGADOR - 160;
    var jogo = {}
    var TECLA = { W: 38, S: 40, D: 68, ESPACO: 32 }
    var velocidade = parseInt($('#container').width()) > 768 ? 5 : 1;
    var posicaoY = parseInt(Math.random() * 334);
    var podeAtirar = true;
    var fimdejogo = false;
    var aparenciaInimigo1 = 0;
    var pontos = 0;
    var perdidos = 0;
    var energiaAtual = 3;
    var salvos = 0;
    var musica = document.getElementById("musica");
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somResgate = document.getElementById("somResgate");
    var somAcabou = document.getElementById("somAcabou");
    var somGenocida = document.getElementById("somGenocida");
    var genocida = 0;
    var acabou = 0;

    // Função que atualiza as váriáveis de posicionamento e tamanho do jogo
    function atualizaVariaveisDeControle(){
        LARGURA_CONTANIER = $('#container').width();
        ALTURA_CONTANIER = $('#container').height();
        ALTURA_MINIMA_JOGADOR = parseInt(parseInt(ALTURA_CONTANIER) * 0.65);
        ALTURA_MINIMA_INIMIGO_1 = ALTURA_MINIMA_JOGADOR - 160;
    }

    // Controlando mudanças na orientação da tela
    window.addEventListener("resize", function() {
        atualizaVariaveisDeControle();   
    }, false);

    // Empedir de arrastar a tela
    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);
    
    // Bloqueia acesso ao meno de contexto
    $(this).bind("contextmenu", function(e) {
        e.preventDefault();
    });

    jogo.timer = setInterval(loop, 30); // deixando o fundo do jogo em loop a cada 30ms
    jogo.pressionou = [];
    musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
    musica.play();

    //Verifica se o usuário pressionou alguma tecla
    $(document).keydown(function(e){
        e.preventDefault();
        jogo.pressionou[e.which] = true;
    });
        
    $(document).keyup(function(e){
        e.preventDefault();
        jogo.pressionou[e.which] = false;
    });

    // Função que controla os movimentos dos jogador
    function realizaAcaoAoPressionarControles(id, acao, intervalo) {
        var timeout;
        // Listen para o MouseDown event.
        document.getElementById(id).addEventListener('mousedown', function(ev) { 
            acao(); 
            timeout = setInterval(acao, intervalo); 
            return false; }, 
            false);
        document.getElementById(id).addEventListener('touchstart', function(ev) { 
            acao(); 
            timeout = setInterval(acao, intervalo); 
            return false; }, 
            false);
        // Listen para o mouse up events.
        document.getElementById(id).addEventListener('mouseup', function(ev) { clearInterval(timeout); return false; }, false);
        // Listen para saida de touch e events.
        document.getElementById(id).addEventListener('touchend', function(ev) { clearInterval(timeout); return false; }, false);
    }
    
    //Controla movimentos ao clicar nos botões direcionais na tela
    realizaAcaoAoPressionarControles('botao-subir', moveJogadorParaCima, 30);
    realizaAcaoAoPressionarControles('botao-descer', moveJogadorParaBaixo, 30);

    // Atirar ao clicar no botão Atirar
    $("#botao-atirar").click(function () {
        disparo();
        return false;
    });

    // função de looping
    function loop() {
        moveFundo();
        moveJogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
    }

    // define imagem do inimigo
    function defineUrlImagemInimigo(){
        let aparencia = parseInt(Math.random() * 9);
        
        while(aparencia == aparenciaInimigo1){
            aparencia = parseInt(Math.random() * 9);
        }
        // define nova aparencia na variável global
        aparenciaInimigo1 = aparencia;

        return "./src/assets/images/monster-"+ aparenciaInimigo1 +".png";
    }

    // função que movimenta o fundo do jogo
    function moveFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 1);
    }
    
    // Função que move jogador para cima
    function moveJogadorParaCima(){
        var topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top", topo - 10);

        // limitando o nave no topo da página
        if (topo <= ALTURA_MAXIMA_JOGADOR) {
            $("#jogador").css("top", topo + 10);
        }
    }


    // Função que move jogador para baixo
    function moveJogadorParaBaixo(){
        var topo = parseInt($("#jogador").css("top"));
        $("#jogador").css("top", topo + 10);

        // limitando o nave no final da página
        if (topo >= ALTURA_MINIMA_JOGADOR) {	
            $("#jogador").css("top", topo - 10);		
        }
    }

    // função para mover o nave cinza
    function moveJogador() {
        if (jogo.pressionou[TECLA.W]) {
            moveJogadorParaCima();
        }

        if (jogo.pressionou[TECLA.S]) {
            moveJogadorParaBaixo();
        }
        
        if (jogo.pressionou[TECLA.D] || jogo.pressionou[TECLA.ESPACO]) {
            disparo(); // chama função disparo	
        }
    }

    // função para mover o inimigo 1, nave amarelo
    function moveInimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);
        
        if (posicaoX <= 0) {
            novoInimigo1();        
        }
    }

    // função para mover o inimigo 2
    function moveInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
        let velocidade = parseInt($('#container').width()) > 768 ? 3 : 1;
	    $("#inimigo2").css("left", posicaoX - velocidade);
				
		if (posicaoX <= 0) {
            $("#inimigo2").css("left", LARGURA_CONTANIER);		
		}
    }

    // função para mover o amigo, o que vai ser resgatado
    function moveAmigo() {
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        if (posicaoX > LARGURA_CONTANIER) {
            $("#amigo").css("left", -30);
        }
    }

    // função que realiza o disparo da arma da nave
    function disparo() {
        if (podeAtirar == true) {
            somDisparo.play();
            podeAtirar = false;
            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            if(parseInt(LARGURA_CONTANIER) < 660 || parseInt(ALTURA_CONTANIER) < 660){
                tiroX = posicaoX + 70;
                topoTiro = topo + 22;
            } else {
                tiroX = posicaoX + 140;
                topoTiro = topo + 45;
            }
            
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 15);
        }
        
        // função que realiza o disparo da arma
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);
            
            if (posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    // função que verifica a colisão dos itens do jogo
    function colisao() {
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));
        
        // colisão do jogador (nave) com o inimigo1, nave
        if (colisao1.length > 0) {
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            // Gera novo inimigo 1
            novoInimigo1();
        }

        // colisão do jogador (nave) com o inimigo2
        if (colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);

            $("#inimigo2").remove();
            reposicionaInimigo2();
        }

        // colisão do disparo com o inimigo 1, nave	
        if (colisao3.length > 0) {
            velocidade = velocidade + 0.3;
            pontos = pontos + 100;
	        inimigo1X = parseInt($("#inimigo1").css("left"));
	        inimigo1Y = parseInt($("#inimigo1").css("top"));		
            explosao1(inimigo1X,inimigo1Y);
        
	        $("#disparo").css("left", 950);
	                  
            // Gera novo inimigo 1
            novoInimigo1();
        }

        // colisão do disparo com o inimigo 2
	    if (colisao4.length > 0) {
            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();

            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);
            reposicionaInimigo2();
        }

        // colisão do jogador (nave) com o amigo
	    if (colisao5.length > 0) {
            salvos++;
            somResgate.play();
            reposicionaAmigo();
            $("#amigo").remove();
        }

        // colisão do amigo com o inimigo 2
        if (colisao6.length > 0) {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left")) + 30;
            amigoY = parseInt($("#amigo").css("top")) - 70;
            explosao3(amigoX, amigoY);
            $("#amigo").remove();
            reposicionaAmigo();
        }
    }

    // Gera novo inimigo 1
    function novoInimigo1() {
        posicaoY = parseInt(Math.random() * ALTURA_MINIMA_INIMIGO_1) + ALTURA_MAXIMA_JOGADOR;
        $("#inimigo1").css("left", LARGURA_CONTANIER);
        $("#inimigo1").css("top", posicaoY);
        $("#inimigo1").css("background-image",'url(' + defineUrlImagemInimigo() + ')');
    }

    // função da explosão, colisão com o inimigo 1, nave
    function explosao1(inimigo1X,inimigo1Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao1'></div");
        $("#explosao1").css("background-image", "url(./src/assets/images/explosao.png)");

        var div = $("#explosao1");
        div.css("top", inimigo1Y);
        div.css("left", inimigo1X);
        div.animate({width: 225, opacity: 0}, "slow");
        
        var tempoExplosao = window.setInterval(removeExplosao, 1000);
        
        function removeExplosao() {
            div.remove();
            window.clearInterval(tempoExplosao);
            tempoExplosao = null;
        }
    }

    // função que reposiciona inimigo2
	function reposicionaInimigo2() {
        let tempoColisao4 = window.setInterval(reposiciona4, 5000);

        function reposiciona4() {
            window.clearInterval(tempoColisao4);
            tempoColisao4 = null;

            if (fimdejogo == false) {
                $("#fundoGame").append("<div id=inimigo2 class='anima2'></div");
                $("#inimigo2").css("left", LARGURA_CONTANIER);
            }
        }	
    }

    // função da explosão, colisão com o inimigo 2
	function explosao2(inimigo2X, inimigo2Y) {
        somExplosao.play();
        $("#fundoGame").append("<div id='explosao2'></div");
        $("#explosao2").css("background-image", "url(./src/assets/images/explosao.png)");

        var div2 = $("#explosao2");
        div2.css("top", inimigo2Y);
        div2.css("left", inimigo2X);
        div2.animate({width: 200, opacity: 0}, "slow");
        
        var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);
        
        function removeExplosao2() {
            div2.remove();
            window.clearInterval(tempoExplosao2);
            tempoExplosao2 = null;
        }
    }

    // função que reposiciona o amigo
	function reposicionaAmigo() {
        var tempoAmigo = window.setInterval(reposiciona6, 6000);
        
        function reposiciona6() {
            window.clearInterval(tempoAmigo);
            tempoAmigo = null;
            
            if (fimdejogo == false) {
                $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
            }
        }
    }

    // função da explosão, colisão do amigo com inimigo 2
    function explosao3(amigoX, amigoY) {
        somPerdido.play();
        $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
        $("#explosao3").css("top", amigoY);
        $("#explosao3").css("left", amigoX);

        var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000);

        function resetaExplosao3() {
            $("#explosao3").remove();
            window.clearInterval(tempoExplosao3);
            tempoExplosao3 = null;
        }
    }

    // função que soma a pontuação do jogo
    function placar() {
        if(pontos < 2000){
            if($('#container').width() > 768) {
                $("#placar").html("<h2> PONTOS: " + pontos + " AMIGOS SALVOS: " + salvos + " AMIGOS PERDIDOS: " + perdidos + "</h2>");
            } else {
                $("#placar").html("<h2> PONTOS: " + pontos + "<br> AMIGOS SALVOS: " + salvos + "<br> AMIGOS PERDIDOS: " + perdidos + "</h2>");
            }
        }
        else if(pontos > 2000 && pontos < 3000){
            if(genocida == 0)
            {
                somGenocida.play();
                genocida++;
            }
            if($('#container').width() > 768) {
                $("#placar").html('<h2> PONTOS: <b class="nivel-medio">' + pontos + "</b> AMIGOS SALVOS: " + salvos + " AMIGOS PERDIDOS: " + perdidos + "</h2>");
            } else {
                $("#placar").html('<h2> PONTOS: <b class="nivel-medio">' + pontos + "</b><br> AMIGOS SALVOS: " + salvos + "<br> AMIGOS PERDIDOS: " + perdidos + "</h2>");
            }
        }
        else if(pontos > 3000 && pontos < 4000){
            if(genocida == 1)
            {
                somGenocida.play();
                genocida++;
            }
            if($('#container').width() > 768) {
                $("#placar").html('<h2> PONTOS: <b class="nivel-alto">' + pontos + "</b> AMIGOS SALVOS: " + salvos + " AMIGOS PERDIDOS: " + perdidos + "</h2>");
            } else {
                $("#placar").html('<h2> PONTOS: <b class="nivel-alto">' + pontos + "</b><br> AMIGOS SALVOS: " + salvos + "<br> AMIGOS PERDIDOS: " + perdidos + "</h2>");
            }
        }
        else if(pontos > 4000 && pontos < 5000){
            if(genocida == 2)
            {
                somGenocida.play();
                genocida++;
            }
            if($('#container').width() > 768) {
                $("#placar").html('<h2> PONTOS: <b class="nivel-muito-alto">' + pontos + "</b> AMIGOS SALVOS: " + salvos + " AMIGOS PERDIDOS: " + perdidos + "</h2>");
            } else {
                $("#placar").html('<h2> PONTOS: <b class="nivel-muito-alto">' + pontos + "</b><br> AMIGOS SALVOS: " + salvos + "<br> AMIGOS PERDIDOS: " + perdidos + "</h2>");
            }
        }
        else if(pontos > 5000){
            if(acabou == 0)
            {
                somAcabou.play();
                acabou++;
            }
            if($('#container').width() > 768) {
                $("#placar").html('<h2> PONTOS: <b class="nivel-insano">' + pontos + "</b> AMIGOS SALVOS: " + salvos + " AMIGOS PERDIDOS: " + perdidos + "</h2>");
            } else {
                $("#placar").html('<h2> PONTOS: <b class="nivel-insano">' + pontos + "</b><br> AMIGOS SALVOS: " + salvos + "<br> AMIGOS PERDIDOS: " + perdidos + "</h2>");
            }
        }
    }

    // função que avalia a energia (vida) do jogador, nave cinza
    function energia() {
        if (energiaAtual == 3) {
            $("#energia").css("background-image", "url(./src/assets/images/energia3.png)");
        }

        if (energiaAtual == 2) {
            $("#energia").css("background-image", "url(./src/assets/images/energia2.png)");
        }

        if (energiaAtual == 1) {
            $("#energia").css("background-image", "url(./src/assets/images/energia1.png)");
        }

        if (energiaAtual == 0) {
            $("#energia").css("background-image", "url(./src/assets/images/energia0.png)");
            gameOver(); // chamando a função game over
        }
    }

    // função que avalia o fim de jogo, game over
	function gameOver() {
        fimdejogo = true;
        musica.pause();
        somGameover.play();
        window.clearInterval(jogo.timer);
        jogo.timer = null;
        
        $("#jogador").remove();
        $("#inimigo1").remove();
        $("#inimigo2").remove();
        $("#amigo").remove();
        $("#botao-subir").remove();
        $("#botao-descer").remove();
        $("#botao-atirar").remove();
        $("#fundoGame").append("<div id='fim'></div>");
        $("#fim").html("<h1 classe='gameover'>GAME OVER</h1><p>Sua pontuação foi: <b>"
             + pontos + "</b><br>Amigos Resgatados: <b>"+ salvos + "</b></p>" 
             + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3>"
             + "<br><small>Desenvolvido por Rafael Cremasco Lacerda e caricaturas Amarildo</small></div>");
    }

}

// função que reinicia o jogo novamente
function reiniciaJogo() {
    somGameover.pause();
    $("#fim").remove();
    start();
}