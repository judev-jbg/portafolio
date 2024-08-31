// Llamada a todos los elementos con la clase '.sheet-write'
const sheetsWrite = document.querySelectorAll('.sheet-write');
sheetsWrite.forEach(sheetWrite => {
    const dataSet = sheetWrite.dataset;
    let words = JSON.parse(dataSet.words);
    // Reducir elementos para evitar valores indefinidos o repetidos
    let clean_words = words.reduce((acc, cur) => {
        if (cur && cur.trim() != "") {
            acc.push(cur);
        }
        return acc
    }, [])
    let all_words = clean_words.filter((el, index) => {
        let reduce_words = [];
        if (index >= 0) {
            if (clean_words.length > 1) {
                if (words[index - 1] != words[index] && el) {
                    reduce_words.push(el)
                    return reduce_words
                }
            } else {
                reduce_words.push(el)
                return reduce_words
            }

        }
    });
    let all_words_length = all_words.length;
    // Si el array se encuentra vacio no se ejecuta nada
    if (!all_words) return;
    // Crear cursor parpadeante al final del texto
    let blinkTxtCursor = document.createElement('span');
    blinkTxtCursor.classList.add('blink-cursor');
    blinkTxtCursor.textContent = '|';
    sheetWrite.parentElement.appendChild(blinkTxtCursor);
    // Datasets
    let init_delay = dataSet.initdelay ? dataSet.initdelay : 10,
        write_speed = dataSet.writespeed ? dataSet.writespeed : 100,
        delete_speed = dataSet.deletespeed ? dataSet.deletespeed : 40,
        delay_delete = dataSet.delaydelete ? dataSet.delaydelete : 1500,
        infinite = dataSet.infinite ? false : true;
    let continue_interval = true,
        continue_loop = true,
        limit_back = 0,
        counter_interval = 0,
        current_word = 0;
    // Intervalo de tiempo para crear el efecto de maquina de escribir
    setInterval(function () {
        if (continue_interval) {
            counter_interval++;
        }
        if (counter_interval >= init_delay * current_word) {
            continue_interval = false;
            let letters = all_words[current_word].split(''),
                letters_lenght = letters.length,
                letter_index = 0;
            // Intervalo de escritura
            let write = setInterval(function () {
                if (letter_index >= limit_back) {
                    sheetWrite.innerHTML += letters[letter_index];
                }
                letter_index++;
                if (letter_index >= letters_lenght) {
                    blinkTxtCursor.classList.add('stop-write');

                    document.querySelector(".finalPoint").innerHTML = ".";

                    if (current_word >= all_words_length && !infinite || all_words_length <= 1) {
                        continue_loop = false;
                    }
                    if (continue_loop) {
                        // Después de que termine el tiempo asignado en la variable ( delay_delete ) se ejecuta el siguiente proceso
                        setTimeout(function () {
                            // Remueve la clase 'stop-write' para quitar el parpadeo al elemento ( blinkTxtCursor )
                            blinkTxtCursor.classList.remove('stop-write');
                            let deleteInterval = setInterval(function () {
                                // Comparar la letra anterior con la letra actual
                                let current_compare_letters = '',
                                    prev_compare_letters = '';
                                if (current_word >= all_words_length) {
                                    current_compare_letters = all_words[current_word - 1].split('');
                                    prev_compare_letters = all_words[0].split('');
                                }
                                if (current_word > 0 && current_word < all_words_length) {
                                    current_compare_letters = all_words[current_word].split('');
                                    prev_compare_letters = all_words[current_word - 1].split('');
                                }
                                limit_back = 0;
                                let a = 0;
                                while (true) {
                                    if (prev_compare_letters[a] == current_compare_letters[a]) {
                                        limit_back++;
                                    } else {
                                        break;
                                    }
                                    a++;
                                }
                                // Eliminar letra por letra 
                                if (letter_index >= limit_back) {
                                    document.querySelector(".finalPoint").innerHTML = "";
                                    sheetWrite.innerHTML = all_words[current_word - 1].slice(0, letter_index);
                                }
                                letter_index--;
                                if (letter_index < 0) {
                                    if (current_word >= all_words_length) {
                                        // Reiniciar valores
                                        setTimeout(function () {
                                            current_word = 0;
                                            counter_interval = 0;
                                            continue_interval = true;
                                        }, write_speed)
                                    } else {
                                        continue_interval = true;
                                    }
                                    clearInterval(deleteInterval);
                                }
                            }, delete_speed);
                        }, delay_delete)
                    }
                    clearInterval(write);
                }
            }, write_speed);
            current_word++;
        }
    });
})