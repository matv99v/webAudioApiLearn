const volumeElement = document.getElementById('volume');
const canvas        = document.getElementById('myCanvas');
const videoElement  = document.getElementById('myVideo');

const context  = new window.AudioContext();
const gainNode = context.createGain();

let buffer, source, destination;
let data;


function loadSoundFile(url) { // функция для подгрузки файла в буфер
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer'; // важно
    xhr.onload = function(e) {
        context.decodeAudioData(
            this.response, // декодируем бинарный ответ

            function(decodedArrayBuffer) {
                buffer = decodedArrayBuffer;
            },

            function(err) {
                console.log('Error decoding file', err);
            });
    };
    xhr.send();
}

function play() {
    source = context.createBufferSource();
    source.buffer = buffer;

    data = source.buffer.getChannelData(0);
    drawFloatArray(data, canvas);
    destination = context.destination;
    source.connect(gainNode);
    gainNode.connect(destination);
    videoElement.volume = 0;
    videoElement.play();
    source.start(0);
}

function stop() {
    source.stop(0);
    videoElement.pause();
    videoElement.currentTime = 0;
}

loadSoundFile('assets/snowboard.mp4');

function handleVolumeChange() {
    gainNode.gain.value = volumeElement.value / 100;
}

function drawFloatArray(samples, canvas) { // eslint-disable-line
    let i;
    const n = samples.length;
    const dur = (n / 44100 * 1000)>>0; // eslint-disable-line

    const width       = canvas.width;
    const height      = canvas.height;
    const ctx         = canvas.getContext('2d');

    ctx.strokeStyle = 'yellow';
    ctx.fillStyle   = 'black';

    ctx.fillRect(0, 0, width, height);

    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    let x, y;
    for (i = 0; i < n; i++) {
        x = ( (i * width) / n);
        y = ( (samples[i] * height / 2 ) + height / 2 );
        ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.closePath();
}
