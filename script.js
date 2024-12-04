$(document).ready(function () {
    let selectedNumbers = [];

    // Cuando se hace clic en un número
    $(".roulette-number").click(function () {
        const number = parseInt($(this).find(".value").text());
        const color = $(this).hasClass("red-item") ? "red" : $(this).hasClass("black-item") ? "black" : "green";

        // Llamar a la función para agregar al historial
        addNumberToHistory(number, color);

        selectedNumbers.push(number);

        if (selectedNumbers.length >= 3) {
            calculateStatistics(selectedNumbers);
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
        };

        // Contar cada categoría
        numbers.forEach((num) => {
            if (num === 0) return; // Ignorar el 0
            if ([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num)) {
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
        });

        // Actualizar estadísticas en la tabla
        const total = numbers.length;
        $("#black-count").text(stats.black);
        $("#black-probability").text(((stats.black / total) * 100).toFixed(2) + "%");
        $("#red-count").text(stats.red);
        $("#red-probability").text(((stats.red / total) * 100).toFixed(2) + "%");

        $("#odd-count").text(stats.odd);
        $("#odd-probability").text(((stats.odd / total) * 100).toFixed(2) + "%");
        $("#even-count").text(stats.even);
        $("#even-probability").text(((stats.even / total) * 100).toFixed(2) + "%");

        $("#low-range-count").text(stats.low);
        $("#low-range-probability").text(((stats.low / total) * 100).toFixed(2) + "%");
        $("#high-range-count").text(stats.high);
        $("#high-range-probability").text(((stats.high / total) * 100).toFixed(2) + "%");

        $("#first-dozen-count").text(stats.firstDozen);
        $("#first-dozen-probability").text(((stats.firstDozen / total) * 100).toFixed(2) + "%");
        $("#second-dozen-count").text(stats.secondDozen);
        $("#second-dozen-probability").text(((stats.secondDozen / total) * 100).toFixed(2) + "%");
        $("#third-dozen-count").text(stats.thirdDozen);
        $("#third-dozen-probability").text(((stats.thirdDozen / total) * 100).toFixed(2) + "%");
    }

    function updateRecommendations(numbers) {
        const stats = {
            red: numbers.filter((n) => [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(n)).length,
            black: numbers.filter((n) => ![1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(n) && n !== 0).length,
            even: numbers.filter((n) => n % 2 === 0).length,
            odd: numbers.filter((n) => n % 2 !== 0).length,
            low: numbers.filter((n) => n >= 1 && n <= 18).length,
            high: numbers.filter((n) => n >= 19 && n <= 36).length,
        };

        const total = numbers.length;

        // Recomendaciones
        const redProb = (stats.red / total) * 100;
        const blackProb = (stats.black / total) * 100;
        $("#recommend-red-black").text(redProb > blackProb ? "Red" : "Black");
        $("#recommend-red-black-number").text((redProb > blackProb ? redProb : blackProb).toFixed(2) + "%");

        const oddProb = (stats.odd / total) * 100;
        const evenProb = (stats.even / total) * 100;
        $("#recommend-odd-even").text(oddProb > evenProb ? "Odd" : "Even");
        $("#recommend-odd-even-number").text((oddProb > evenProb ? oddProb : evenProb).toFixed(2) + "%");

        const lowProb = (stats.low / total) * 100;
        const highProb = (stats.high / total) * 100;
        $("#recommend-low-high").text(lowProb > highProb ? "Low (1-18)" : "High (19-36)");
        $("#recommend-low-high-number").text((lowProb > highProb ? lowProb : highProb).toFixed(2) + "%");
    }
});
    
