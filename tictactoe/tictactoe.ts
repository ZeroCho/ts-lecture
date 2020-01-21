const table: HTMLTableElement = document.createElement('table');
const rows: HTMLTableRowElement[] = [];
const cells: HTMLTableCellElement[][] = [];
let turn: 'O' | 'X' = 'X';
const result: HTMLDivElement = document.createElement('div');
let count: number = 0;

function callback(event: MouseEvent) {
    const rowIndex: number = rows.indexOf((event.currentTarget as HTMLTableCellElement).parentNode as HTMLTableRowElement);
    const cellIndex: number = cells[rowIndex].indexOf(event.currentTarget as HTMLTableCellElement);
    count++;

    if (cells[rowIndex][cellIndex].textContent !== '') {
        console.log('빈 칸이 아닙니다.');
    } else {
        cells[rowIndex][cellIndex].textContent = turn;

        let full: boolean = false;
        if (
            cells[rowIndex][0].textContent === turn &&
            cells[rowIndex][1].textContent === turn &&
            cells[rowIndex][2].textContent === turn
        ) {
            full = true;
        }
        if (
            cells[0][cellIndex].textContent === turn &&
            cells[1][cellIndex].textContent === turn &&
            cells[2][cellIndex].textContent === turn
        ) {
            full = true;
        }
        if (
            cells[0][0].textContent === turn &&
            cells[1][1].textContent === turn &&
            cells[2][2].textContent === turn
        ) {
            full = true;
        }
        if (
            cells[0][2].textContent === turn &&
            cells[1][1].textContent === turn &&
            cells[2][0].textContent === turn
        ) {
            full = true;
        }
        if (full) {
            result.textContent = `${turn}님이 승리!`;
            turn = 'X';
            cells.forEach((row) => {
                row.forEach((cell) => {
                    cell.textContent = '';
                });
            })
        } else if (count === 9) {
            result.textContent = `무승부!`;
            turn = 'X';
            cells.forEach((row) => {
                row.forEach((cell) => {
                    cell.textContent = '';
                });
            })
        } else {
            turn = turn === 'O' ? 'X' : 'O';
        }
    }
}

for (let i: number = 1; i <= 3; i++) {
    const row: HTMLTableRowElement = document.createElement('tr');
    rows.push(row);
    cells.push([]);
    for (let j: number = 1; j <= 3; j++) {
        const cell: HTMLTableCellElement = document.createElement('td');
        cell.addEventListener('click', callback);
        cells[i - 1].push(cell);
        row.appendChild(cell);
    }
    table.appendChild(row);
}
document.body.appendChild(table);
document.body.appendChild(result);
