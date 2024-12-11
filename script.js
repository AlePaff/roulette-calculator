$(document).ready(function () {
    let selectedNumbers = [];

    const topRow = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
    const middleRow = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
    const bottomRow = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
    const redValues = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];


    const rouletteToggle = $('#roulette-toggle');
    const rouletteLabel = $('#roulette-label');
    const doubleZero = $('#double-zero');
    const historyContainer = $('#number-history');

    // Cuando se hace clic en un número
    $(".roulette-number").click(function () {
        const number = parseInt($(this).find(".value").text());
        const color = $(this).hasClass("red-item") ? "red" : $(this).hasClass("black-item") ? "black" : "green";

        // Llamar a la función para agregar al historial
        addNumberToHistory(number, color);
        selectedNumbers.push(number);
        calculateStatistics(selectedNumbers);

        if (selectedNumbers.length >= 3) {
            updateRecommendations(selectedNumbers);
        }
    });

    function addNumberToHistory(number, color) {
        // Crear un nuevo elemento para el número
        const numberElement = $("<div>")
            .addClass("roulette-number")
            .addClass(color) // Color dinámico (rojo, negro o verde)
            .text(number);
    
        // Agregar el número al contenedor de historial
        $("#number-history").prepend(numberElement);
    }
    

    function calculateStatistics(numbers) {
        // Variables para conteos
        const stats = {
            red: 0,
            black: 0,
            odd: 0,
            even: 0,
            low: 0,
            high: 0,
            firstDozen: 0,
            secondDozen: 0,
            thirdDozen: 0,
            top: 0,
            middle: 0,
            bottom: 0
        };

        // Contar cada categoría
        numbers.forEach((num) => {
            if (num === 0) return; // Ignorar el 0
            if (redValues.includes(num)) {
                stats.red++;
            } else {
                stats.black++;
            }

            if (num % 2 === 0) {
                stats.even++;
            } else {
                stats.odd++;
            }

            if (num >= 1 && num <= 18) {
                stats.low++;
            } else if (num >= 19 && num <= 36) {
                stats.high++;
            }

            if (num >= 1 && num <= 12) {
                stats.firstDozen++;
            } else if (num >= 13 && num <= 24) {
                stats.secondDozen++;
            } else if (num >= 25 && num <= 36) {
                stats.thirdDozen++;
            }

            if (topRow.includes(num)) stats.top++;
            else if (middleRow.includes(num)) stats.middle++;
            else if (bottomRow.includes(num)) stats.bottom++;
        });

        // Actualizar estadísticas en la tabla
        const total = numbers.length;
        $("#black-count").text(stats.black);
        $("#black-probability").text(percentage(stats.black, total));
        $("#red-count").text(stats.red);
        $("#red-probability").text(percentage(stats.red, total));

        $("#odd-count").text(stats.odd);
        $("#odd-probability").text(percentage(stats.odd, total));
        $("#even-count").text(stats.even);
        $("#even-probability").text(percentage(stats.even, total));

        $("#low-range-count").text(stats.low);
        $("#low-range-probability").text(percentage(stats.low, total));
        $("#high-range-count").text(stats.high);
        $("#high-range-probability").text(percentage(stats.high, total));

        $("#first-dozen-count").text(stats.firstDozen);
        $("#first-dozen-probability").text(percentage(stats.firstDozen, total));
        $("#second-dozen-count").text(stats.secondDozen);
        $("#second-dozen-probability").text(percentage(stats.secondDozen, total));
        $("#third-dozen-count").text(stats.thirdDozen);
        $("#third-dozen-probability").text(percentage(stats.thirdDozen, total));

        $("#top-row-count").text(stats.top);
        $("#top-row-probability").text(percentage(stats.top, total));
        $("#middle-row-count").text(stats.middle);
        $("#middle-row-probability").text(percentage(stats.middle, total));
        $("#bottom-row-count").text(stats.bottom);
        $("#bottom-row-probability").text(percentage(stats.bottom, total));
    }

    function percentage(value, total) {
        if(total === 0) return "0%";

        // si es numero entero se muestra sin decimales
        if (Number.isInteger((value / total) * 100))
            return ((value / total) * 100) + "%";
        // si no es entero se muestra con 1 decimal
        return ((value / total) * 100).toFixed(1) + "%";
    }

    function updateRecommendations(numbers) {
        const stats = {
            red: numbers.filter((n) => redValues.includes(n)).length,
            black: numbers.filter((n) => !redValues.includes(n) && n !== 0).length,
            even: numbers.filter((n) => n % 2 === 0).length,
            odd: numbers.filter((n) => n % 2 !== 0).length,
            low: numbers.filter((n) => n >= 1 && n <= 18).length,
            high: numbers.filter((n) => n >= 19 && n <= 36).length,
        };
    
        const total = numbers.length;
    
        // Calcular probabilidades "simples" (sin ajuste)
        const redProb = total === 0 ? 0 : (stats.red / total) * 100;
        const blackProb = total === 0 ? 0 : (stats.black / total) * 100;
    
        // Ajuste condicional basado en eventos recientes
        let adjustedRedProb = redProb;
        let adjustedBlackProb = blackProb;
    
        if (stats.red > stats.black) {
            // Si ha salido más rojo, la probabilidad ajustada de rojo se reduce (se favorece negro)
            adjustedBlackProb += 10; // Le damos un +10% a negro
            adjustedRedProb -= 10;   // Restamos 10% de la probabilidad de rojo
        } else if (stats.black > stats.red) {
            // Si ha salido más negro, la probabilidad ajustada de negro se reduce (se favorece rojo)
            adjustedRedProb += 10;  // Le damos un +10% a rojo
            adjustedBlackProb -= 10; // Restamos 10% de la probabilidad de negro
        }
    
        // Mostrar la recomendación ajustada
        $("#recommend-red-black").text(adjustedRedProb > adjustedBlackProb ? "Red" : "Black");
        $("#recommend-red-black-number").text((adjustedRedProb > adjustedBlackProb ? adjustedRedProb : adjustedBlackProb).toFixed(1) + "%");
    
        // Repetir ajuste para otros eventos como Odd/Even, Low/High, etc.
        const oddProb = total === 0 ? 0 : (stats.odd / total) * 100;
        const evenProb = total === 0 ? 0 : (stats.even / total) * 100;
        const adjustedOddProb = oddProb;
        const adjustedEvenProb = evenProb;
        $("#recommend-odd-even").text(adjustedOddProb > adjustedEvenProb ? "Odd" : "Even");
        $("#recommend-odd-even-number").text((adjustedOddProb > adjustedEvenProb ? adjustedOddProb : adjustedEvenProb).toFixed(1) + "%");
    
        const lowProb = total === 0 ? 0 : (stats.low / total) * 100;
        const highProb = total === 0 ? 0 : (stats.high / total) * 100;
        $("#recommend-low-high").text(lowProb > highProb ? "Low (1-18)" : "High (19-36)");
        $("#recommend-low-high-number").text((lowProb > highProb ? lowProb : highProb).toFixed(1) + "%");
    
        updateCellColors();
    }
    


    function updateCellColors() {
        // Seleccionamos las celdas de porcentaje
        const redBlackCell = document.getElementById('recommend-red-black-number');
        const oddEvenCell = document.getElementById('recommend-odd-even-number');
        const lowHighCell = document.getElementById('recommend-low-high-number');
        
        // Función para verificar y aplicar el color
        function checkAndColor(cell) {
            const value = parseInt(cell.textContent);  // Obtiene el valor numérico (en %)
            
            if (value > 95) {
                cell.style.color = 'red';  // Cambia el color a rojo si el valor supera el 95%
            } else {
                cell.style.color = '';  // Resetea el color si el valor es menor o igual a 95%
            }
        }
    
        // Llamamos a la función para cada celda de porcentaje
        checkAndColor(redBlackCell);
        checkAndColor(oddEvenCell);
        checkAndColor(lowHighCell);
    }
    


    // Función para resetear estadísticas e historial
    function resetStats() {
        $('#red-count').text(0);
        $('#black-count').text(0);
        historyContainer.empty();
        selectedNumbers = [];
        calculateStatistics(selectedNumbers);
        updateRecommendations(selectedNumbers);   
    }

    // Evento de cambio para el switch
    rouletteToggle.change(function () {
        if (this.checked) {
            // Ruleta Americana (con 0 y 00)
            rouletteLabel.text('Ruleta Americana');
            doubleZero.show();
        } else {
            // Ruleta Europea (solo 0)
            rouletteLabel.text('Ruleta Europea');
            doubleZero.hide();
        }
        resetStats(); // Reiniciar estadísticas
    });


    // Al clickear boton reiniciar
    $('#reset-button').click(function () {
        resetStats();
    });
});
    
