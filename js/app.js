const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const paginacion = document.querySelector("#paginacion");
let termino;

const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual;



window.onload = () => {
    formulario.addEventListener('submit', enviarFormulario);
}


function enviarFormulario(e){
    termino = document.querySelector("#termino").value;
    e.preventDefault();
    //validamos
    if(termino === ''){
        mensajes("Escriba algo en el campo", "error")

        return;
    }
    paginaActual =1;
    consultarAPI(termino);
}



function consultarAPI(termino){
    const apiKey = "18853414-7099f5715b2113ce39ab36112";
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);
            if(resultado.totalHits === 0){
                mensajes("No hay registros", "error");
                return;
            }
             mostrarResultado(resultado.hits);
        })
   

}

function *crearPaginador(total){
    for (let i = 1; i <= total; i++ ){
        yield i;
    }
}


function calcularPaginas(total){
    return parseInt( Math.ceil( total / registrosPorPagina));
}

function mostrarResultado(reg){
    
    limpiarLista();
    reg.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;
        resultado.innerHTML += `
                    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                        <div class="bg-white">
                            <img class="w-full" src="${previewURL}"> 
                            <div class="p-4">
                                <p class="font-bold">${views} <span class="font-light"> Vistas </span> </p>
                                <p class="font-bold">${likes} <span class="font-light"> Me gusta </span> </p>

                                <a  class="block w-full bg-blue-800 hover:bg-blue-500 text-white font-bold text-center rounded mt-5 p-1"
                                href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                                > 
                                VER IMAGEN
                                </a>
                            </div>
                        </div>
                    </div>       
        `;
    });

    while(paginacion.firstChild){
        paginacion.removeChild(paginacion.firstChild);
    }
    imprimirPaginador();
    
}


function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value, done } = iterador.next();

        if(done) return;
        //caso contrario , creara un boton der la pagina
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded');
        boton.onclick = () =>{
            paginaActual = value; 
             consultarAPI(termino);
        }
        paginacion.appendChild(boton);
    }
}


function mensajes(mensaje, tipo){

    const alerta = document.querySelector(".alerta");
    if(!alerta){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('bg-red-100',  'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center', 'alerta')

        if(tipo === 'error'){
            divMensaje.innerHTML=`<strong class="font-bold">Error!</strong>
                                <span class="block sm:inline">${mensaje}</span>`;
        }else{
            
        }

        formulario.appendChild(divMensaje);

        setTimeout(() =>{
            divMensaje.remove();
        },2000);
    }    
}

function limpiarLista(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}