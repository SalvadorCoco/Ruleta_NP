const array_concursantes = [ 
    'Microbrush',
    'solución hemostática',
    'compresas',
    'guantes',
    'turbina TEALTH',
    'ionomero de cementacion',
    'abrebocas',
    'espejo',
    'cuaderno 3M',
    'mini fresero DOCHEM'
];

let canvas = document.getElementById("idcanvas");
let context = canvas.getContext("2d");

function ajustarCanvas() {
    let width = Math.min(window.innerWidth * 0.9, 600); // Ajusta el ancho del canvas al 90% del ancho de la ventana o 600px máximo
    let height = width; // Mantén la relación de aspecto cuadrada
    canvas.width = width;
    canvas.height = height;
}

let center;
let movement;
let maxSpeed = 15; // Velocidad máxima de giro
let currentSpeed = maxSpeed;
let deceleration = 0.995; // Controla la desaceleración
let isSpinning = false; // Para controlar que solo se pueda girar una vez a la vez
let rotationAngle = 0; // Ángulo de rotación actual
let coloresSegmentos = []; // Almacena los colores de los segmentos

// Genera y almacena los colores una sola vez
function generarColores() {
    for (let i = 0; i < array_concursantes.length; i++) {
        coloresSegmentos[i] = random_color(); // Almacena un color para cada segmento
    }
}

// Función para mezclar el array de concursantes
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function dibujarRuleta() {
    center = canvas.width / 2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(center, center);
    context.arc(center, center, center, 0, 2 * Math.PI);
    context.fillStyle = '#33333333';
    context.fill();

    context.beginPath();
    context.moveTo(center, center);
    context.arc(center, center, center - 10, 0, 2 * Math.PI);
    context.fillStyle = 'black';
    context.fill();

    // Mezclar los nombres cada vez que se dibuja la ruleta
    mezclarArray(array_concursantes);

    for (let i = 0; i < array_concursantes.length; i++) {
        context.beginPath();
        context.moveTo(center, center);
        context.arc(center, center, center - 20, i * 2 * Math.PI / array_concursantes.length, (i + 1) * 2 * Math.PI / array_concursantes.length);
        context.fillStyle = coloresSegmentos[i]; // Usar el color almacenado
        context.fill();

        context.save();
        context.translate(center, center);
        context.rotate(3 * 2 * Math.PI / (5 * array_concursantes.length) + i * 2 * Math.PI / array_concursantes.length);
        context.translate(-center, -center);
        context.font = "13px Comic Sans MS";
        context.textAlign = "right";
        context.fillStyle = "white";
        context.fillText(array_concursantes[i], canvas.width - 30, center);
        context.restore();
    }
}

function girarRuleta() {
    if (isSpinning) return; // Evitar múltiples giros simultáneos

    isSpinning = true;
    currentSpeed = maxSpeed; // Reiniciar la velocidad al valor máximo
    // Genera un giro aleatorio que es un múltiplo de 360 más un giro adicional
    let giroAleatorio = Math.floor(Math.random() * 360 + 3600); // Al menos 10 giros completos
    let totalRotation = giroAleatorio + rotationAngle;

    movement = setInterval(function () {
        if (currentSpeed > 0.1) { // Mientras la velocidad sea significativa, continuar girando
            rotationAngle += currentSpeed; // Incrementar el ángulo de rotación
            canvas.style.transform = 'rotate(' + rotationAngle + 'deg)';
            
            // Desacelerar gradualmente
            currentSpeed *= deceleration;
        } else {
            clearInterval(movement); // Detener el giro cuando la velocidad es muy baja
            rotationAngle = rotationAngle % 360; // Asegurarse de que el ángulo esté entre 0 y 360 grados
            isSpinning = false; // Permitir otro giro
            
        }
    }, 10); // 10ms intervalo para actualizar la rotación (puedes aumentar para mayor suavidad)
}

document.getElementById("logo").addEventListener("click", girarRuleta); // Hacer clic en el logo

function agregarConcursante() {
    let nombre = prompt("Ingresa el nombre del concursante:");
    if (nombre) {
        array_concursantes.push(nombre);
        generarColores(); // Genera nuevos colores si se agrega un nuevo concursante
        dibujarRuleta();
    }
}

function borrarConcursantes() {
    if (confirm("¿Estás seguro de que quieres borrar todos los participantes?")) {
        array_concursantes.length = 0; // Limpiar el array de concursantes
        dibujarRuleta();
    }
}

function random_color() {
    let ar_digit = ['2', '3', '4', '5', '6', '7', '8', '9'];
    let color = '';
    let i = 0;
    while (i < 6) {
        let pos = Math.round(Math.random() * (ar_digit.length - 1));
        color = color + '' + ar_digit[pos];
        i++;
    }
    return '#' + color;
}

// Dibuja la ruleta inicialmente y ajusta el canvas al tamaño de la ventana
window.onload = function() {
    ajustarCanvas();
    generarColores(); // Genera los colores al inicio
    dibujarRuleta();
};

window.onresize = function() {
    ajustarCanvas();
    dibujarRuleta();
};
