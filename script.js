var runningTotalMap = new Map();

function submitValues() {
    var leftValue = document.getElementById('left-input').value;
    var rightValue = parseInt(document.getElementById('right-input').value);

    if (!validateLeftInput(leftValue)) {
        alert('Please enter a 3-digit number (000-999) for 3ตัว.');
        return;
    }

    if (runningTotalMap.has(leftValue)) {
        var currentTotal = runningTotalMap.get(leftValue);
        var updatedTotal = currentTotal + rightValue;
        runningTotalMap.set(leftValue, updatedTotal);
        updateOutputTable(leftValue, rightValue, updatedTotal);
    } else {
        runningTotalMap.set(leftValue, rightValue);
        updateOutputTable(leftValue, rightValue, rightValue);
    }

    document.getElementById('left-input').value = '';
    document.getElementById('right-input').value = '';
}

function validateLeftInput(value) {
    var pattern = /^[0-9]{3}$/;
    return pattern.test(value);
}

function updateOutputTable(leftValue, rightValue, totalValue) {
    var outputTableBody = document.getElementById('output-table-body');
    var existingRow = findRowByLeftValue(outputTableBody, leftValue);

    if (existingRow) {
        existingRow.cells[1].innerHTML = totalValue;
        existingRow.cells[2].innerHTML = Math.min(rightValue, 5000);
        existingRow.cells[3].innerHTML = Math.max(totalValue - 5000, 0);
        existingRow.cells[4].innerHTML = `<button class="view-more-button" onclick="openViewMoreModal('${leftValue}')">View More</button>`;
    } else {
        var newRowPosition = findRowPositionToInsert(outputTableBody, leftValue);
        var newRow = outputTableBody.insertRow(newRowPosition);

        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);

        cell1.innerHTML = leftValue;
        cell2.innerHTML = totalValue;
        cell3.innerHTML = Math.min(rightValue, 5000);
        cell4.innerHTML = Math.max(totalValue - 5000, 0);
        cell5.innerHTML = `<button class="view-more-button" onclick="openViewMoreModal('${leftValue}')">View More</button>`;
    }
}

function findRowByLeftValue(tableBody, leftValue) {
    for (var i = 0; i < tableBody.rows.length; i++) {
        if (tableBody.rows[i].cells[0].innerHTML === leftValue) {
            return tableBody.rows[i];
        }
    }
    return null;
}

function findRowPositionToInsert(tableBody, leftValue) {
    for (var i = 0; i < tableBody.rows.length; i++) {
        var currentLeftValue = tableBody.rows[i].cells[0].innerHTML;
        if (leftValue < currentLeftValue) {
            return i;
        }
    }
    return tableBody.rows.length;
}

function openViewMoreModal(leftValue) {
    var viewMoreList = document.getElementById('viewMoreList');
    viewMoreList.innerHTML = '';

    var runnings = runningTotalMap.get(leftValue);
    var uniquePrices = [...new Set(runnings)];

    uniquePrices.forEach(price => {
        var count = runnings.filter(item => item === price).length;
        var listItem = document.createElement('li');
        listItem.textContent = `${leftValue} ${price} (จำนวนครั้งที่ได้เลขซ้ำ: ${count})`;
        viewMoreList.appendChild(listItem);
    });

    document.getElementById('viewMoreModal').style.display = 'block';
}

function closeViewMoreModal() {
    document.getElementById('viewMoreModal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('viewMoreModal')) {
        closeViewMoreModal();
    }
};
