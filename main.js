document.addEventListener("DOMContentLoaded", function(event) { 

    const options = ['rock', 'paper', 'scissors'];
    const net = new brain.recurrent.LSTM();
    const buffer = ['scissors', 'rock', 'paper', 'scissors'];
    let data = [buffer.slice()];
    const domMyMove = document.getElementById('you');
    const domCpuMove = document.getElementById('rnn');
    const domOpts = document.getElementById('options');
    const domResult = document.getElementById('result');
    const myMoveOrig = domMyMove.innerHTML;
    let cpuNextMove = calcNextMove();
    const cpuWinLoss = [0.3, 0.3, 0.3];


    options.forEach(optId => {
        document.getElementById(optId).addEventListener('click', evt => {
            const myMoveIdx = options.indexOf(optId);
            const scoreValues = {
                [options[myMoveIdx]]: 0.3,         // tie
                [options[(myMoveIdx + 1) % 3]]: 1, // cpu wins
                [options[(myMoveIdx + 2) % 3]]: 0  // cpu loses
            };
            cpuWinLoss.push(scoreValues[cpuNextMove]);

            if (scoreValues[cpuNextMove] === 0) {
                domResult.innerHTML = '<div>YOU WON!</div>';
                domResult.className = 'win';
            } else if (scoreValues[cpuNextMove] === 1) {
                domResult.innerHTML = '<div>YOU LOSE!</div>';
                domResult.className = 'lose';
            } else {
                domResult.innerHTML = '<div>TIED!</div>';
                domResult.className = 'tie';
            }
            buffer.push(optId);
            data.push(buffer.slice(-4));
            data = data.slice(-13);
            domMyMove.innerHTML = optId;
            domCpuMove.innerHTML = cpuNextMove;
            domOpts.className += ' disabled';
            setTimeout(() => {
                cpuNextMove = calcNextMove();
                setTimeout(() => {
                    domMyMove.innerHTML = optId;
                    domCpuMove.innerHTML = cpuNextMove;
                    domOpts.className = '';
                    domResult.className = '';
                    const cpuScore = cpuWinLoss.reduce((t, s) => t + Math.floor(s), 0);
                    const myScore = cpuWinLoss.reduce((t, s) => t + Math.floor(Math.abs(s - 1)), 0);
                    const youScoreCount = document.getElementById('you-score');
                    const rnnScoreCount = document.getElementById('rnn-score');
                    
                    youScoreCount.innerHTML = `
                        ${myScore}
                    `;
                    rnnScoreCount.innerHTML = `
                        ${cpuScore}
                    `;
                }, 0);
            }, 0);
        });
    });
    function calcNextMove() {
        net.train(data, {iterations: 200, errorThresh: 0.025});
        const nextMove = net.run(buffer.slice(-3));
        const nextMoveIdx = options.indexOf(nextMove);
        const cpuMoveIdx = (nextMoveIdx + 1) % 3;
        return options[cpuMoveIdx];
    }
});

