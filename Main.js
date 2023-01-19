let textArea = document.querySelector('#textArea-ed'); //Variable para tener el string que el usuario ingresa
let btnEncriptar = document.querySelector('#btn-encrypt');  //Tener la accion del boton de encriptar
let btnDesencriptar = document.querySelector('#btn-decrypt'); //Tener la accion del boton de desencriptar
let btnCopiar = document.querySelector('#btn-copy'); //Tener la accion del boton de copiar
let mostrarMensaje = document.querySelector('#message-ed');  //Para mostrar la frase encriptada o desencriptada
let illustrationFlat = document.querySelector('.illustration-flat'); //Activar o desactivar imagen
let mensajeTitulo = document.querySelector('.no-message-t'); //Activar o desactivar texto en el recuadro donde sale la frase encripta o desencriptada
let mensajeDescripcion = document.querySelector('.no-message-d'); //Lo mismo del anterior
const noMensajeNotify = document.querySelector('.no-mensaje');
const tieneAcentoNotify = document.querySelector('.tiene-acento');
const textoCopiadoNotify = document.querySelector('.texto-copiado');

//Variables globales
let cumple = false;
let estaMostrandoNotify = false;
let letra_codificada = ["ai","enter","imes","ober","ufat"];
let frase_para_copiar = "";

//Para activar, las funciones dependiendo de las acciones que haga el usuario.
textArea.addEventListener("input",Corregir);
btnEncriptar.addEventListener("click", Encriptar);
btnCopiar.addEventListener("click",Copiar);
btnDesencriptar.addEventListener("click",Desencriptar)

/*Funcion para pasar de mayuscula a minuscula en tiempo real*/
function minus(e) {
    e.value = e.value.toLowerCase();
}

// Ayuda a verificar que cumpla con los requisitos de no tener caracteres, esto es sacado de stackoverflow.

function caracteresPermitidos(texto){
    return texto ? !/[^A-Z\sa-z ñ,.¡!¿?]/.test(texto) : true;
}

//Sirve para marcar en rojo si hay un signo que no corresponde, por el contrario lo quita.
function Corregir(){

    let frase = textArea.value;
    if(caracteresPermitidos(frase) === false){  // Si no cumple marca en rojo
        cumple = false;
        document.querySelector('.info-text').classList.add('shake')     //Esta de esta forma, porque si lo pongo con el style.animation no me funciona. en el stylesheet esta el shake
        setTimeout(function () {
            document.querySelector('.info-text').classList.remove('shake');
        },800);
        document.querySelector('.info-text').style.color = "#e93f3f";

    }
    else { // SI cumple sale normal
        cumple = true;
        document.querySelector('.info-text').style.color = null;
    }

}


function Encriptar(){

   let frase = textArea.value;
    let frase_codificada = "";

    if((cumple) && (textArea.value !== null) && (textArea.value !=="")){  // Encripta con un switch, las frases esstan en un array,
        for(let i = 0; i < frase.length; i++){
            switch (frase.charAt(i)){
                case "a":
                    frase_codificada+= letra_codificada[0];
                    break;

                case "e":
                    frase_codificada+= letra_codificada[1];
                    break;

                case "i":
                    frase_codificada+= letra_codificada[2];
                    break;

                case "o":
                    frase_codificada+= letra_codificada[3];
                    break;

                case "u":
                    frase_codificada+= letra_codificada[4];
                    break;

                default:
                    frase_codificada+= frase.charAt(i);
                    break;

            }

        }
        // Activar y desactivar funciones a la hora de mostrar el mensaje encriptado.
        btnCopiar.classList.add("active");
        mostrarMensaje.classList.add("active");
        illustrationFlat.classList.add("inactive");
        mensajeTitulo.classList.add("inactive");
        mensajeDescripcion.classList.add("inactive");



        //Animacion para ver como si se estuviera escribiendo
        let i = 0;
        const text = frase_codificada;

        function animateText() {
            mostrarMensaje.value = text.substring(0, i);
            i++;
            if (i > text.length) {
                clearInterval(animation);
            }
        }

        const animation = setInterval(animateText, 50);



        frase_para_copiar = frase_codificada; //Pasa a una variable global para despues usar el boton de copiar.
    }
    else{  //Salta la alerta de no haber cumplido las condiciones
        if(textArea.value === ""){
            MostrarNotificacion(noMensajeNotify)
        }
        else if(caracteresPermitidos(textArea.value) === false){
            MostrarNotificacion(tieneAcentoNotify);
        }
    }
}

function Desencriptar(){

    if((cumple) && (textArea.value !== null) && (textArea.value !=="")){

        let frase_desencriptada = textArea.value;
        frase_desencriptada = frase_desencriptada.replace(/ai|enter|imes|ober|ufat/g, function(match) {
            switch (match) {
                case "ai": return "a";
                case "enter": return "e";
                case "imes": return "i";
                case "ober": return "o";
                case "ufat": return "u";
            }
        });

        // Activar y desactivar funciones a la hora de mostrar el mensaje encriptado.
        mostrarMensaje.classList.add("active");
        illustrationFlat.classList.add("inactive");
        mensajeTitulo.classList.add("inactive");
        mensajeDescripcion.classList.add("inactive");
        btnCopiar.classList.add("show");

        //Animacion para ver como si se estuviera escribiendo
        let i = 0;
        const text = frase_desencriptada;

        function animateText() {
            mostrarMensaje.value = text.substring(0, i);
            i++;
            if (i > text.length) {
                clearInterval(animation);
            }
        }

        const animation = setInterval(animateText, 50);



        frase_para_copiar = frase_desencriptada; //Pasa a una variable global para despues usar el boton de copiar.
    }
    else{
        if(textArea.value === ""){
            MostrarNotificacion(noMensajeNotify)
        }
        else if(caracteresPermitidos(textArea.value) === false){
            MostrarNotificacion(tieneAcentoNotify);
        }
    }
}



//Copia lo que sale por pantalla
function Copiar(){
    copyText(frase_para_copiar);
    MostrarNotificacion(textoCopiadoNotify);
}
async function copyText(text) {
    try {
        await navigator.permissions.query({name: 'clipboard-write'});
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}


//Mostrar mensajes en la pantalla de los diferentes errores, personalizados.
function MostrarNotificacion(notify){
    if(!estaMostrandoNotify){
        estaMostrandoNotify = true;
        notify.style.display = 'flex';
        notify.style.animation = 'notificar-entrada 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000) both';
        setTimeout(()=>{
            notify.style.animation = 'notificar-salida 0.5s cubic-bezier(0.550, 0.055, 0.675, 0.190) both';
        }, 2000);
        setTimeout(()=>{
            notify.style.animation = '';
            notify.style.display = 'none';
            estaMostrandoNotify = false;
        }, 2500);
    }
}

