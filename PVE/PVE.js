$(document).ready(function() {
    let txt = ""; // Player's move, 'X' or 'O'
    let counter = 0; // Move counter

    // Set the current player
    function setPlayer(player) {
        txt = player;
        $("#X").toggleClass("picked1", player === "X");
        $("#O").toggleClass("picked2", player === "O");
    }

    $("#X").click(() => {
        if (txt === "" && counter % 2 === 0) {
            $(".borders").removeClass("disabled");
            setPlayer("X");
            console.log(txt);
        }
    });

    $("#O").click(() => {
        if (txt === "" && counter % 2 === 0) {
            $(".borders").removeClass("disabled");
            setPlayer("O");
            console.log(txt);
        }
    });

    $("#reset").click(() => {
        $("#X").removeClass("picked1");
        $("#O").removeClass("picked2");

        $("#reset").addClass("reset");

        setTimeout(function() {
            $("#reset").removeClass("reset");
        }, 100);

        txt = ""; 
        console.log(txt);
        resetGame();
    });

    function resetGame() {
        counter = 0;
        txt = "";  // Ensure txt is an empty string
        $(".borders").removeClass("X O disabled");
        $(".borders").text("");
        $("#frame").slideDown();
        $("h1").text("Tic Tac Toe!");

        // Reattach click event handler after resetting
        $(".borders").off('click').on('click', handleBorderClick);
    }

    function play() {
        if (checkwin('X')) {
            $("h1").text("Winner is: X");
            $(".borders").addClass("disabled"); // Disable further clicks
            return;
        }

        if (checkwin('O')) {
            $("h1").text("Winner is: O");
            $(".borders").addClass("disabled"); // Disable further clicks
            return;
        }

        counter++;

        if (counter === 9) {
            $("h1").text("DRAW");
            return;
        }

        // Switch turn
        txt = (txt === "O") ? "X" : "O";

        if (txt === "O") {
            $("h1").text("AI Turn");
            setTimeout(aiMove, 500); // Delay AI move for realism
        } else {
            $("h1").text("Player 1");
        }
    }

    function aiMove() {
        let moveMade = false;

        // Block opponent's winning move or take winning move
        $(".borders").each(function() {
            if (!$(this).hasClass('X') && !$(this).hasClass('O')) {
                let cell = $(this);
                cell.addClass('temp-O'); // Temporarily set the AI move
                if (checkwin('O')) {
                    cell.removeClass('temp-O').addClass('O').text('O');
                    moveMade = true;
                    return false; // Exit loop
                }
                cell.removeClass('temp-O'); // Undo move

                cell.addClass('temp-X'); // Temporarily set opponent move
                if (checkwin('X')) {
                    cell.removeClass('temp-X').addClass('O').text('O');
                    moveMade = true;
                    return false; // Exit loop
                }
                cell.removeClass('temp-X'); // Undo move
            }
        });

        if (!moveMade) {
            // Take center if available
            if (!$(".bord-5").hasClass('X') && !$(".bord-5").hasClass('O')) {
                $(".bord-5").addClass('O').text('O');
                moveMade = true;
            }

            // Random available move
            if (!moveMade) {
                let availableMoves = [];
                $(".borders").each(function() {
                    if (!$(this).hasClass('X') && !$(this).hasClass('O')) {
                        availableMoves.push($(this));
                    }
                });

                if (availableMoves.length > 0) {
                    let randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
                    randomMove.addClass('O').text('O');
                    moveMade = true;
                }
            }
        }

        // Ensure AI move is registered and turn is updated
        if (moveMade) {
            play(); // Continue to the next turn
        } else {
            $("h1").text("Player 1");
        }
    }

    function handleBorderClick() {
        console.log(txt);
        if (txt && !$(this).hasClass("X") && !$(this).hasClass("O")) {
            $(this).addClass(txt);
            $(this).text(txt);
            play();
        }
    }

    function checkwin(player) {
        var winningPatterns = [
            ["bord-1", "bord-2", "bord-3"],
            ["bord-4", "bord-5", "bord-6"],
            ["bord-7", "bord-8", "bord-9"],
            ["bord-1", "bord-4", "bord-7"],
            ["bord-2", "bord-5", "bord-8"],
            ["bord-3", "bord-6", "bord-9"],
            ["bord-1", "bord-5", "bord-9"],
            ["bord-7", "bord-5", "bord-3"]
        ];

        for (var i = 0; i < winningPatterns.length; i++) {
            var pattern = winningPatterns[i];

            if (pattern.every(function (cell) {
                return $("." + cell).hasClass(player);
            })) {
                return true; // Return true if a winning pattern is found
            }
        }

        return false; // Return false if no winning pattern is found
    }
});
