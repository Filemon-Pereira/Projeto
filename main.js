let colunas = 20; //colunas do grid
let linhas = 20; //linhas do grid

let grid = new Array(colunas); //array de todos os pontos do mapa

let openSet = []; //array para armanezar os pontos não visitados
let closedSet = []; //array para armazenar os pontos visitados

let inicio; //ponto inicial
let fim; // ponto final
let caminho = []; //array para armanezar o caminho pecorrido

var posicaoInicial = { x:0, y:0 }; 
var posicaoFinal = { x:0, y:0 };
var estado = ["Inicío","Fim"];
var estadoIndex = 0;
var estadoInicioFim = estado[estadoIndex];
var width = 400;
var height = 400;
var rentaguloMapa = 20;
var pixel = 10;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
// função para limpar o canvas, resetar as variaveis globais
function resetarMapa(){
    grid = new Array(colunas); 
    openSet = []; 
    closedSet = [];
    inicio = undefined; 
    fim = undefined; 
    caminho = [];
    estadoIndex = 0;
    estado = ["Inicío","Fim"];
    estadoInicioFim = estado[estadoIndex];
    context.beginPath();
    context.fillStyle = "#eee";
    context.fillRect(0,0,width+pixel,height+pixel);
    desenharMapa();
    document.getElementById("opcaoInicio_Fim").innerText = estadoInicioFim;
    document.getElementById("opcaoInicio_Fim").style.color = "green"; 
}

let posicaoX = null;
let posicaoY = null;

// função para pegar o elemento clicado e posicinar o inicio e fim levando em consideração o estado
function onClick(e) {
    // obter a posição x, y e tamanho do elemento
    const rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    posicaoX = x;
    posicaoY = y;

    switch(estadoInicioFim){
        case "Inicío":
            resetarRetangulo(posicaoInicial.x,posicaoInicial.y);
            desenhaRetanculo(x,y,"green");
            var novaPosicao_X = (parseInt(((x)/rentaguloMapa).toFixed())*rentaguloMapa)+pixel;
            var novaPosicao_Y = (parseInt(((y)/rentaguloMapa).toFixed())*rentaguloMapa)+pixel;
            posicaoInicial = { x:(x > novaPosicao_X ? novaPosicao_X-pixel : (novaPosicao_X-rentaguloMapa)-pixel),y:(y > novaPosicao_Y ? novaPosicao_Y-pixel : (novaPosicao_Y-rentaguloMapa)-pixel) };
        break;
        case "Fim":
            resetarRetangulo(posicaoFinal.x,posicaoFinal.y);
            desenhaRetanculo(x,y,"red");
            var novaPosicao_X = (parseInt(((x)/rentaguloMapa).toFixed())*rentaguloMapa)+pixel;
            var novaPosicao_Y = (parseInt(((y)/rentaguloMapa).toFixed())*rentaguloMapa)+pixel;
            posicaoFinal = { x:(x > novaPosicao_X ? novaPosicao_X-pixel : (novaPosicao_X-rentaguloMapa)-pixel),y:(y > novaPosicao_Y ? novaPosicao_Y-pixel : (novaPosicao_Y-rentaguloMapa)-pixel) };
        break;
    }
}

var mouseFoiPressionado = false;

canvas.onclick = onClick;   
canvas.onmousedown = () => mouseFoiPressionado = true;
canvas.onmouseup = () => mouseFoiPressionado = false;

// função para desenhar o mapa
function desenharMapa(){
    for (var x = 0; x <= width; x += rentaguloMapa) {
        context.moveTo(0.5 + x + pixel, pixel);
        context.lineTo(0.5 + x + pixel, height + pixel);
    }

    for (var x = 0; x <= height; x += rentaguloMapa) {
        context.moveTo(pixel, 0.5 + x + pixel);
        context.lineTo(width + pixel, 0.5 + x + pixel);
    }
    context.strokeStyle = "black";
    context.stroke();
}

// função para desenhar cada retanculo mapa
function desenhaRetanculo(x,y,cor){
    var novaPosicao_X = (parseInt(((x)/rentaguloMapa).toFixed())*rentaguloMapa)+pixel;
    var novaPosicao_Y = (parseInt(((y)/rentaguloMapa).toFixed())*rentaguloMapa)+pixel;
    var _x = x > novaPosicao_X ? novaPosicao_X : (novaPosicao_X-rentaguloMapa);
    var _y = y > novaPosicao_Y ? novaPosicao_Y : (novaPosicao_Y-rentaguloMapa);
    if(_x >= 0 && _x < width && _y < height && _y >= 0){
        context.beginPath();
        context.fillStyle = cor;
        context.fillRect(_x,_y,rentaguloMapa,rentaguloMapa);
        desenharMapa();
    } 
}

// função para resetar o retangulo do mapa
function resetarRetangulo(x,y){
    var novaPosicao_X = (parseInt(((x)/rentaguloMapa).toFixed())*rentaguloMapa)+pixel;
    var novaPosicao_Y = (parseInt(((y)/rentaguloMapa).toFixed())*rentaguloMapa)+pixel;
    context.clearRect(novaPosicao_X,novaPosicao_Y,rentaguloMapa,rentaguloMapa);
}

function verificarEstado(){
    estadoIndex = (estadoIndex+1) % 2;
    estadoInicioFim = estado[estadoIndex];
    switch (estadoInicioFim){
        case "Inicío":
            document.getElementById("opcaoInicio_Fim").innerText = estadoInicioFim;
            document.getElementById("opcaoInicio_Fim").style.color = "green"; 
            break;
        case "Fim":
            document.getElementById("opcaoInicio_Fim").innerText = estadoInicioFim;
            document.getElementById("opcaoInicio_Fim").style.color = "red";
            break;
    }
}

desenharMapa();

function desenharCaminho(list){
    for(var i=1; i<(list.length-1); i++){
        desenhaRetanculo((list[i].y+1)*rentaguloMapa,(list[i].x+1)*rentaguloMapa,"blue");
    }
}

//função heurística utilizando a distância de Manhattan
function heuristica(posicao0, posicao1) {
    let d1 = Math.abs(posicao1.x - posicao0.x);
    let d2 = Math.abs(posicao1.y - posicao0.y);
    return d1 + d2;
}

//função construtora para criar todos os pontos do mapa, objetos com os dados para cada ponto
function PontosdoMapa(x, y) {
    this.x = x; // localização do ponto x
    this.y = y; // localização do ponto y
    this.f = 0; // total do custo da função
    this.g = 0; // função de custo desde o início até o ponto atual da mapa
    this.h = 0; // função de custo estimado, heurística do ponto do mapa atual até o objetivo
    this.vizinhos = []; // vizinhos do ponto de grade atual
    this.pai = undefined; // fonte imediata do ponto de grade atual

    // atualizar o array de vizinhos para um determinado ponto do grid
    this.atualizarVizinhos = function (grid) {
        let i = this.x;
        let j = this.y;
        if (i < colunas - 1) {
            this.vizinhos.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.vizinhos.push(grid[i - 1][j]);
        }
        if (j < linhas - 1) {
            this.vizinhos.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.vizinhos.push(grid[i][j - 1]);
        }
    };
}

// inicializar o grid linhas e colunas
function inicializarGridSetandoLinhasEColunas() {
    // criando um array bidimensional
    for (let i = 0; i < colunas; i++) {
        grid[i] = new Array(linhas);
    }

    for (let i = 0; i < colunas; i++) {
        for (let j = 0; j < linhas; j++) {
            grid[i][j] = new PontosdoMapa(i, j);
        }
    }

    for (let i = 0; i < colunas; i++) {
        for (let j = 0; j < linhas; j++) {
            grid[i][j].atualizarVizinhos(grid);
        }
    }
    
    inicio = grid[(posicaoInicial.y/rentaguloMapa)][(posicaoInicial.x/rentaguloMapa)];
    fim = grid[(posicaoFinal.y/rentaguloMapa)][(posicaoFinal.x/rentaguloMapa)];

    openSet.push(inicio);
}

// Implementando o algoritmo, referencia abaixo:
// https://dev.to/codesphere/pathfinding-with-javascript-the-a-algorithm-3jlb
async function search() {
    inicializarGridSetandoLinhasEColunas();
    while (openSet.length > 0) {
        // supondo que o índice mais baixo é o primeiro a começar
        let lowestIndex = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }
        let current = openSet[lowestIndex];
        // verificamos se o indice atual chegou ao fim
        if (current === fim) {
            let temp = current;
            caminho.push(temp);
            while (temp.pai) {
                caminho.push(temp.pai);
                temp = temp.pai;
            }
            // Esfera coletada
            let esferaEncontrada = {
                status: 'coletado',
                coordenada: {
                    x: fim.x,
                    y: fim.y
                },
                custo: fim.g
            }
            esferaColetadaInserirNaTela.push(esferaEncontrada);
            esferaColetada()
            // retornar o caminho rastreado
            var result = caminho.reverse();
            setTimeout(() => {
                desenharCaminho(result);
            }, (50));
            return result;
        }

        // remover corrente do openSet
        openSet.splice(lowestIndex, 1);
        // adiciona o indice corrente ao vizinhos visitados
        closedSet.push(current);

        let vizinhos = current.vizinhos;
        for (let i = 0; i < vizinhos.length; i++) {
            let vizinho = vizinhos[i];

            if (!closedSet.includes(vizinho)) {
                let possibleG = current.g + 1;

                if (!openSet.includes(vizinho)) {
                    openSet.push(vizinho);
                } else if (possibleG >= vizinho.g) {
                    continue;
                }

                vizinho.g = possibleG;
                vizinho.h = heuristica(vizinho, fim); // distancia
                vizinho.f = vizinho.g + vizinho.h;
                vizinho.pai = current;
                if(current != inicio){
                    var promise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            desenhaRetanculo((current.y+1)*rentaguloMapa,(current.x+1)*rentaguloMapa,"#c2c2c2");
                            resolve("Esfera não encontrada!");
                        },1000 / 60);
                    });
                    await promise;
                }
            }
        }
    }
    //no solution by default
    return [];
}

let esferaColetadaInserirNaTela = []
let esfera_wrapper = document.querySelector('.esfera_wrapper')
function esferaColetada(){
    if (esferaColetadaInserirNaTela.length === 1 ) {
    console.log("Esfera 1 coletado", esferaColetadaInserirNaTela[0])
    // criar um novo elemento div com a classe "esfera"
    let divEsfera = document.createElement("div");
    divEsfera.classList.add("esfera");

    // criar um novo elemento div com a classe "esfera_item" e o texto "Esfera 1"
    let divEsferaItem = document.createElement("div");
    divEsferaItem.classList.add("esfera_item");
    divEsferaItem.textContent = `Esfera ${esferaColetadaInserirNaTela.length}`;

    // criar um novo elemento div com a classe "esfera_status" e o texto "status: "
    let divEsferaStatus = document.createElement("div");
    divEsferaStatus.classList.add("esfera_status");
    divEsferaStatus.textContent = "status: ";

    // criar um novo elemento span com a classe "esfera_coletada" e o texto do status
    let spanEsferaColetada = document.createElement("span");
    spanEsferaColetada.classList.add("esfera_coletada");
    spanEsferaColetada.textContent = esferaColetadaInserirNaTela[0].status;

    // criar um novo elemento div com a classe "esfera_coordenada" e os textos "coordenada: ", "x: " e "y: "
    let divEsferaCoordenada = document.createElement("div");
    divEsferaCoordenada.classList.add("esfera_coordenada");
    divEsferaCoordenada.textContent = "coordenada: ";

    let spanEsferaCoordenadaX = document.createElement("span");
    spanEsferaCoordenadaX.classList.add("esfera_coordenada_x");
    spanEsferaCoordenadaX.textContent = `x:${esferaColetadaInserirNaTela[0].coordenada.x} `;

    let spanEsferaCoordenadaY = document.createElement("span");
    spanEsferaCoordenadaY.classList.add("esfera_coordenada_y");
    spanEsferaCoordenadaY.textContent = `y:${esferaColetadaInserirNaTela[0].coordenada.y} `;

    // criar um novo elemento div com a classe "esfera_custo" e o texto "custo do caminho: "
    let divEsferaCusto = document.createElement("div");
    divEsferaCusto.classList.add("esfera_custo");
    divEsferaCusto.textContent = "custo do caminho: ";

    // criar um novo elemento span com a classe "esfera_custo_caminho" e o texto do custo
    let spanEsferaCustoCaminho = document.createElement("span");
    spanEsferaCustoCaminho.classList.add("esfera_custo_caminho");
    spanEsferaCustoCaminho.textContent = esferaColetadaInserirNaTela[0].custo;

    // adicionar os elementos filhos ao elemento "esfera"
    divEsferaStatus.appendChild(spanEsferaColetada);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaX);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaY);
    divEsferaCusto.appendChild(spanEsferaCustoCaminho);

    divEsfera.appendChild(divEsferaItem);
    divEsfera.appendChild(divEsferaStatus);
    divEsfera.appendChild(divEsferaCoordenada);
    divEsfera.appendChild(divEsferaCusto);

    // adicionar o elemento "esfera" como filho do body
    esfera_wrapper.append(divEsfera);
        setTimeout(() => {
            resetarMapa();
            desenhaRetanculo(posicaoX,posicaoY,"red");
        }, 3000);
    } 
    if (esferaColetadaInserirNaTela.length === 2 ) {
    console.log("Esfera 2 coletado", esferaColetadaInserirNaTela[1])
    // criar um novo elemento div com a classe "esfera"
    let divEsfera = document.createElement("div");
    divEsfera.classList.add("esfera");

    // criar um novo elemento div com a classe "esfera_item" e o texto "Esfera 2"
    let divEsferaItem = document.createElement("div");
    divEsferaItem.classList.add("esfera_item");
    divEsferaItem.textContent = `Esfera ${esferaColetadaInserirNaTela.length}`;

    // criar um novo elemento div com a classe "esfera_status" e o texto "status: "
    let divEsferaStatus = document.createElement("div");
    divEsferaStatus.classList.add("esfera_status");
    divEsferaStatus.textContent = "status: ";

    // criar um novo elemento span com a classe "esfera_coletada" e o texto do status
    let spanEsferaColetada = document.createElement("span");
    spanEsferaColetada.classList.add("esfera_coletada");
    spanEsferaColetada.textContent = esferaColetadaInserirNaTela[1].status;

    // criar um novo elemento div com a classe "esfera_coordenada" e os textos "coordenada: ", "x: " e "y: "
    let divEsferaCoordenada = document.createElement("div");
    divEsferaCoordenada.classList.add("esfera_coordenada");
    divEsferaCoordenada.textContent = "coordenada: ";

    let spanEsferaCoordenadaX = document.createElement("span");
    spanEsferaCoordenadaX.classList.add("esfera_coordenada_x");
    spanEsferaCoordenadaX.textContent = `x:${esferaColetadaInserirNaTela[1].coordenada.x} `;

    let spanEsferaCoordenadaY = document.createElement("span");
    spanEsferaCoordenadaY.classList.add("esfera_coordenada_y");
    spanEsferaCoordenadaY.textContent = `y:${esferaColetadaInserirNaTela[1].coordenada.y} `;

    // criar um novo elemento div com a classe "esfera_custo" e o texto "custo do caminho: "
    let divEsferaCusto = document.createElement("div");
    divEsferaCusto.classList.add("esfera_custo");
    divEsferaCusto.textContent = "custo do caminho: ";

    // criar um novo elemento span com a classe "esfera_custo_caminho" e o texto do custo
    let spanEsferaCustoCaminho = document.createElement("span");
    spanEsferaCustoCaminho.classList.add("esfera_custo_caminho");
    spanEsferaCustoCaminho.textContent = esferaColetadaInserirNaTela[1].custo;

    // adicionar os elementos filhos ao elemento "esfera"
    divEsferaStatus.appendChild(spanEsferaColetada);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaX);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaY);
    divEsferaCusto.appendChild(spanEsferaCustoCaminho);

    divEsfera.appendChild(divEsferaItem);
    divEsfera.appendChild(divEsferaStatus);
    divEsfera.appendChild(divEsferaCoordenada);
    divEsfera.appendChild(divEsferaCusto);

    // adicionar o elemento "esfera" como filho do body
    esfera_wrapper.append(divEsfera);
        setTimeout(() => {
            resetarMapa();
            desenhaRetanculo(posicaoX,posicaoY,"red");
        }, 3000);
    } 
    if (esferaColetadaInserirNaTela.length === 3 ) {
    console.log("Esfera 3 coletado", esferaColetadaInserirNaTela[2])
    // criar um novo elemento div com a classe "esfera"
    let divEsfera = document.createElement("div");
    divEsfera.classList.add("esfera");

    // criar um novo elemento div com a classe "esfera_item" e o texto "Esfera 3"
    let divEsferaItem = document.createElement("div");
    divEsferaItem.classList.add("esfera_item");
    divEsferaItem.textContent = `Esfera ${esferaColetadaInserirNaTela.length}`;

    // criar um novo elemento div com a classe "esfera_status" e o texto "status: "
    let divEsferaStatus = document.createElement("div");
    divEsferaStatus.classList.add("esfera_status");
    divEsferaStatus.textContent = "status: ";

    // criar um novo elemento span com a classe "esfera_coletada" e o texto do status
    let spanEsferaColetada = document.createElement("span");
    spanEsferaColetada.classList.add("esfera_coletada");
    spanEsferaColetada.textContent = esferaColetadaInserirNaTela[2].status;

    // criar um novo elemento div com a classe "esfera_coordenada" e os textos "coordenada: ", "x: " e "y: "
    let divEsferaCoordenada = document.createElement("div");
    divEsferaCoordenada.classList.add("esfera_coordenada");
    divEsferaCoordenada.textContent = "coordenada: ";

    let spanEsferaCoordenadaX = document.createElement("span");
    spanEsferaCoordenadaX.classList.add("esfera_coordenada_x");
    spanEsferaCoordenadaX.textContent = `x:${esferaColetadaInserirNaTela[2].coordenada.x} `;

    let spanEsferaCoordenadaY = document.createElement("span");
    spanEsferaCoordenadaY.classList.add("esfera_coordenada_y");
    spanEsferaCoordenadaY.textContent = `y:${esferaColetadaInserirNaTela[2].coordenada.y} `;

    // criar um novo elemento div com a classe "esfera_custo" e o texto "custo do caminho: "
    let divEsferaCusto = document.createElement("div");
    divEsferaCusto.classList.add("esfera_custo");
    divEsferaCusto.textContent = "custo do caminho: ";

    // criar um novo elemento span com a classe "esfera_custo_caminho" e o texto do custo
    let spanEsferaCustoCaminho = document.createElement("span");
    spanEsferaCustoCaminho.classList.add("esfera_custo_caminho");
    spanEsferaCustoCaminho.textContent = esferaColetadaInserirNaTela[2].custo;

    // adicionar os elementos filhos ao elemento "esfera"
    divEsferaStatus.appendChild(spanEsferaColetada);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaX);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaY);
    divEsferaCusto.appendChild(spanEsferaCustoCaminho);

    divEsfera.appendChild(divEsferaItem);
    divEsfera.appendChild(divEsferaStatus);
    divEsfera.appendChild(divEsferaCoordenada);
    divEsfera.appendChild(divEsferaCusto);

    // adicionar o elemento "esfera" como filho do body
    esfera_wrapper.append(divEsfera);
        setTimeout(() => {
            resetarMapa();
            desenhaRetanculo(posicaoX,posicaoY,"red");
        }, 3000);
    } 
    if (esferaColetadaInserirNaTela.length === 4 ) {
    console.log("Esfera 4 coletado", esferaColetadaInserirNaTela[3])
    // criar um novo elemento div com a classe "esfera"
    let divEsfera = document.createElement("div");
    divEsfera.classList.add("esfera");

    // criar um novo elemento div com a classe "esfera_item" e o texto "Esfera 4"
    let divEsferaItem = document.createElement("div");
    divEsferaItem.classList.add("esfera_item");
    divEsferaItem.textContent = `Esfera ${esferaColetadaInserirNaTela.length}`;

    // criar um novo elemento div com a classe "esfera_status" e o texto "status: "
    let divEsferaStatus = document.createElement("div");
    divEsferaStatus.classList.add("esfera_status");
    divEsferaStatus.textContent = "status: ";

    // criar um novo elemento span com a classe "esfera_coletada" e o texto do status
    let spanEsferaColetada = document.createElement("span");
    spanEsferaColetada.classList.add("esfera_coletada");
    spanEsferaColetada.textContent = esferaColetadaInserirNaTela[3].status;

    // criar um novo elemento div com a classe "esfera_coordenada" e os textos "coordenada: ", "x: " e "y: "
    let divEsferaCoordenada = document.createElement("div");
    divEsferaCoordenada.classList.add("esfera_coordenada");
    divEsferaCoordenada.textContent = "coordenada: ";

    let spanEsferaCoordenadaX = document.createElement("span");
    spanEsferaCoordenadaX.classList.add("esfera_coordenada_x");
    spanEsferaCoordenadaX.textContent = `x:${esferaColetadaInserirNaTela[3].coordenada.x} `;

    let spanEsferaCoordenadaY = document.createElement("span");
    spanEsferaCoordenadaY.classList.add("esfera_coordenada_y");
    spanEsferaCoordenadaY.textContent = `y:${esferaColetadaInserirNaTela[3].coordenada.y} `;

    // criar um novo elemento div com a classe "esfera_custo" e o texto "custo do caminho: "
    let divEsferaCusto = document.createElement("div");
    divEsferaCusto.classList.add("esfera_custo");
    divEsferaCusto.textContent = "custo do caminho: ";

    // criar um novo elemento span com a classe "esfera_custo_caminho" e o texto do custo
    let spanEsferaCustoCaminho = document.createElement("span");
    spanEsferaCustoCaminho.classList.add("esfera_custo_caminho");
    spanEsferaCustoCaminho.textContent = esferaColetadaInserirNaTela[3].custo;

    // adicionar os elementos filhos ao elemento "esfera"
    divEsferaStatus.appendChild(spanEsferaColetada);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaX);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaY);
    divEsferaCusto.appendChild(spanEsferaCustoCaminho);

    divEsfera.appendChild(divEsferaItem);
    divEsfera.appendChild(divEsferaStatus);
    divEsfera.appendChild(divEsferaCoordenada);
    divEsfera.appendChild(divEsferaCusto);

    // adicionar o elemento "esfera" como filho do body
    esfera_wrapper.append(divEsfera);
        setTimeout(() => {
            resetarMapa();
            desenhaRetanculo(posicaoX,posicaoY,"red");
        }, 3000);
    } 
    if (esferaColetadaInserirNaTela.length === 5 ) {
    console.log("Esfera 5 coletado", esferaColetadaInserirNaTela[4])
    // criar um novo elemento div com a classe "esfera"
    let divEsfera = document.createElement("div");
    divEsfera.classList.add("esfera");

    // criar um novo elemento div com a classe "esfera_item" e o texto "Esfera 5"
    let divEsferaItem = document.createElement("div");
    divEsferaItem.classList.add("esfera_item");
    divEsferaItem.textContent = `Esfera ${esferaColetadaInserirNaTela.length}`;

    // criar um novo elemento div com a classe "esfera_status" e o texto "status: "
    let divEsferaStatus = document.createElement("div");
    divEsferaStatus.classList.add("esfera_status");
    divEsferaStatus.textContent = "status: ";

    // criar um novo elemento span com a classe "esfera_coletada" e o texto do status
    let spanEsferaColetada = document.createElement("span");
    spanEsferaColetada.classList.add("esfera_coletada");
    spanEsferaColetada.textContent = esferaColetadaInserirNaTela[4].status;

    // criar um novo elemento div com a classe "esfera_coordenada" e os textos "coordenada: ", "x: " e "y: "
    let divEsferaCoordenada = document.createElement("div");
    divEsferaCoordenada.classList.add("esfera_coordenada");
    divEsferaCoordenada.textContent = "coordenada: ";

    let spanEsferaCoordenadaX = document.createElement("span");
    spanEsferaCoordenadaX.classList.add("esfera_coordenada_x");
    spanEsferaCoordenadaX.textContent = `x:${esferaColetadaInserirNaTela[4].coordenada.x} `;

    let spanEsferaCoordenadaY = document.createElement("span");
    spanEsferaCoordenadaY.classList.add("esfera_coordenada_y");
    spanEsferaCoordenadaY.textContent = `y:${esferaColetadaInserirNaTela[4].coordenada.y} `;

    // criar um novo elemento div com a classe "esfera_custo" e o texto "custo do caminho: "
    let divEsferaCusto = document.createElement("div");
    divEsferaCusto.classList.add("esfera_custo");
    divEsferaCusto.textContent = "custo do caminho: ";

    // criar um novo elemento span com a classe "esfera_custo_caminho" e o texto do custo
    let spanEsferaCustoCaminho = document.createElement("span");
    spanEsferaCustoCaminho.classList.add("esfera_custo_caminho");
    spanEsferaCustoCaminho.textContent = esferaColetadaInserirNaTela[4].custo;

    // adicionar os elementos filhos ao elemento "esfera"
    divEsferaStatus.appendChild(spanEsferaColetada);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaX);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaY);
    divEsferaCusto.appendChild(spanEsferaCustoCaminho);

    divEsfera.appendChild(divEsferaItem);
    divEsfera.appendChild(divEsferaStatus);
    divEsfera.appendChild(divEsferaCoordenada);
    divEsfera.appendChild(divEsferaCusto);

    // adicionar o elemento "esfera" como filho do body
    esfera_wrapper.append(divEsfera);
        setTimeout(() => {
            resetarMapa();
            desenhaRetanculo(posicaoX,posicaoY,"red");
        }, 3000);
    } 
    if (esferaColetadaInserirNaTela.length === 6 ) {
    console.log("Esfera 6 coletado", esferaColetadaInserirNaTela[5])
    // criar um novo elemento div com a classe "esfera"
    let divEsfera = document.createElement("div");
    divEsfera.classList.add("esfera");

    // criar um novo elemento div com a classe "esfera_item" e o texto "Esfera 6"
    let divEsferaItem = document.createElement("div");
    divEsferaItem.classList.add("esfera_item");
    divEsferaItem.textContent = `Esfera ${esferaColetadaInserirNaTela.length}`;

    // criar um novo elemento div com a classe "esfera_status" e o texto "status: "
    let divEsferaStatus = document.createElement("div");
    divEsferaStatus.classList.add("esfera_status");
    divEsferaStatus.textContent = "status: ";

    // criar um novo elemento span com a classe "esfera_coletada" e o texto do status
    let spanEsferaColetada = document.createElement("span");
    spanEsferaColetada.classList.add("esfera_coletada");
    spanEsferaColetada.textContent = esferaColetadaInserirNaTela[5].status;

    // criar um novo elemento div com a classe "esfera_coordenada" e os textos "coordenada: ", "x: " e "y: "
    let divEsferaCoordenada = document.createElement("div");
    divEsferaCoordenada.classList.add("esfera_coordenada");
    divEsferaCoordenada.textContent = "coordenada: ";

    let spanEsferaCoordenadaX = document.createElement("span");
    spanEsferaCoordenadaX.classList.add("esfera_coordenada_x");
    spanEsferaCoordenadaX.textContent = `x:${esferaColetadaInserirNaTela[5].coordenada.x} `;

    let spanEsferaCoordenadaY = document.createElement("span");
    spanEsferaCoordenadaY.classList.add("esfera_coordenada_y");
    spanEsferaCoordenadaY.textContent = `y:${esferaColetadaInserirNaTela[5].coordenada.y} `;

    // criar um novo elemento div com a classe "esfera_custo" e o texto "custo do caminho: "
    let divEsferaCusto = document.createElement("div");
    divEsferaCusto.classList.add("esfera_custo");
    divEsferaCusto.textContent = "custo do caminho: ";

    // criar um novo elemento span com a classe "esfera_custo_caminho" e o texto do custo
    let spanEsferaCustoCaminho = document.createElement("span");
    spanEsferaCustoCaminho.classList.add("esfera_custo_caminho");
    spanEsferaCustoCaminho.textContent = esferaColetadaInserirNaTela[5].custo;

    // adicionar os elementos filhos ao elemento "esfera"
    divEsferaStatus.appendChild(spanEsferaColetada);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaX);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaY);
    divEsferaCusto.appendChild(spanEsferaCustoCaminho);

    divEsfera.appendChild(divEsferaItem);
    divEsfera.appendChild(divEsferaStatus);
    divEsfera.appendChild(divEsferaCoordenada);
    divEsfera.appendChild(divEsferaCusto);

    // adicionar o elemento "esfera" como filho do body
    esfera_wrapper.append(divEsfera);
        setTimeout(() => {
            resetarMapa();
            desenhaRetanculo(posicaoX,posicaoY,"red");
        }, 3000);
    } 
    if (esferaColetadaInserirNaTela.length === 7 ) {
    console.log("Esfera 7 coletado", esferaColetadaInserirNaTela[6])
    // criar um novo elemento div com a classe "esfera"
    let divEsfera = document.createElement("div");
    divEsfera.classList.add("esfera");

    // criar um novo elemento div com a classe "esfera_item" e o texto "Esfera 7"
    let divEsferaItem = document.createElement("div");
    divEsferaItem.classList.add("esfera_item");
    divEsferaItem.textContent = `Esfera ${esferaColetadaInserirNaTela.length}`;

    // criar um novo elemento div com a classe "esfera_status" e o texto "status: "
    let divEsferaStatus = document.createElement("div");
    divEsferaStatus.classList.add("esfera_status");
    divEsferaStatus.textContent = "status: ";

    // criar um novo elemento span com a classe "esfera_coletada" e o texto do status
    let spanEsferaColetada = document.createElement("span");
    spanEsferaColetada.classList.add("esfera_coletada");
    spanEsferaColetada.textContent = esferaColetadaInserirNaTela[6].status;

    // criar um novo elemento div com a classe "esfera_coordenada" e os textos "coordenada: ", "x: " e "y: "
    let divEsferaCoordenada = document.createElement("div");
    divEsferaCoordenada.classList.add("esfera_coordenada");
    divEsferaCoordenada.textContent = "coordenada: ";

    let spanEsferaCoordenadaX = document.createElement("span");
    spanEsferaCoordenadaX.classList.add("esfera_coordenada_x");
    spanEsferaCoordenadaX.textContent = `x:${esferaColetadaInserirNaTela[6].coordenada.x} `;

    let spanEsferaCoordenadaY = document.createElement("span");
    spanEsferaCoordenadaY.classList.add("esfera_coordenada_y");
    spanEsferaCoordenadaY.textContent = `y:${esferaColetadaInserirNaTela[6].coordenada.y} `;

    // criar um novo elemento div com a classe "esfera_custo" e o texto "custo do caminho: "
    let divEsferaCusto = document.createElement("div");
    divEsferaCusto.classList.add("esfera_custo");
    divEsferaCusto.textContent = "custo do caminho: ";

    // criar um novo elemento span com a classe "esfera_custo_caminho" e o texto do custo
    let spanEsferaCustoCaminho = document.createElement("span");
    spanEsferaCustoCaminho.classList.add("esfera_custo_caminho");
    spanEsferaCustoCaminho.textContent = esferaColetadaInserirNaTela[6].custo;

    // adicionar os elementos filhos ao elemento "esfera"
    divEsferaStatus.appendChild(spanEsferaColetada);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaX);
    divEsferaCoordenada.appendChild(spanEsferaCoordenadaY);
    divEsferaCusto.appendChild(spanEsferaCustoCaminho);

    divEsfera.appendChild(divEsferaItem);
    divEsfera.appendChild(divEsferaStatus);
    divEsfera.appendChild(divEsferaCoordenada);
    divEsfera.appendChild(divEsferaCusto);

    // adicionar o elemento "esfera" como filho do body
    esfera_wrapper.append(divEsfera);
        setTimeout(() => {
            resetarMapa();
            desenhaRetanculo(210,210, "pink")
        }, 3000);
    resultado();

    } 
}

function resultado(){
    const esferaWrapper = document.createElement('div');
    esferaWrapper.classList.add('esfera', 'esfera_resultado_wrapper');

    const esferaResultado = document.createElement('div');
    esferaResultado.classList.add('esfera_resultado');
    esferaResultado.textContent = 'Resultado';

    const esferaQuantidade = document.createElement('div');
    esferaQuantidade.classList.add('esfera_quantidade');
    esferaQuantidade.textContent = 'esferas coletadas: ';

    const resultadoQuantidade = document.createElement('span');
    resultadoQuantidade.classList.add('resultado_quantidade');
    resultadoQuantidade.textContent = `${esferaColetadaInserirNaTela.length}`;
    esferaQuantidade.appendChild(resultadoQuantidade);

    const total = esferaColetadaInserirNaTela.reduce((acumulador, item) => {
        return acumulador + item.custo;
      }, 0);

    const esferaCustoTotal = document.createElement('div');
    esferaCustoTotal.classList.add('esfera_custo_total');
    esferaCustoTotal.textContent = 'custo total: ';

    const resultadoCusto = document.createElement('span');
    resultadoCusto.classList.add('resultado_custo');
    resultadoCusto.textContent = `${total}`;
    esferaCustoTotal.appendChild(resultadoCusto);

    esferaWrapper.appendChild(esferaResultado);
    esferaWrapper.appendChild(esferaQuantidade);
    esferaWrapper.appendChild(esferaCustoTotal);

    esfera_wrapper.append(esferaWrapper);
}

function data(){
    const dataAtual = new Date();
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataAtual.getFullYear().toString();
    const hora = dataAtual.getHours().toString().padStart(2, '0');
    const minutos = dataAtual.getMinutes().toString().padStart(2, '0');
    
    const dataFormatada = `${dia}/${mes}/${ano}`;
    const horaFormatada = `${hora}:${minutos}`;
    
    const dataElement = document.querySelector('.data');
    const horaElement = document.querySelector('.hora');
    
    dataElement.textContent = dataFormatada;
    horaElement.textContent = horaFormatada;

}
setInterval(() => {
    data()
}, 1000);


