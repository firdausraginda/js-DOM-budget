dataInc = []
dataExp = []
totalInc = 0
totalExp = 0
totalBudget = 0
totalPersenExp = 0

var DOMstr = {
    inputSelect: '#selectType',
    inputNama: '.nama input',
    inputValue: '.value input',
    dateNow: '.dateNow',
    monthNow: '.monthNow',
    yearNow: '.yearNow',
    incomeList: '.income-list',
    expensesList: '.expenses-list',
    itemBox: '.item-box',
    totalBudget: '.total-budget h1',
    totalInc: '.income-bg .number',
    totalExp: '.expenses-bg .number',
    totalPersen: '.percentage-total',
    expList: '.exp-list .percentage-total',
    detailSection: '.detail-section'
}

selectEl = function (el) {
    return document.querySelector(el)
}

selectElAll = function (el) {
    return document.querySelectorAll(el)
}

getNowDate = function () {
    now = new Date()

    months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des']

    month = now.getMonth()
    year = now.getFullYear()
    date = now.getDate()

    selectEl(DOMstr.dateNow).innerHTML = date
    selectEl(DOMstr.monthNow).innerHTML = months[month]
    selectEl(DOMstr.yearNow).innerHTML = year
}

formatNumber = function (strRupiah, typeStr) {
    counter = 0
    angkaRupiah = ''
    statusRupiah = ''
    statusPersen = ''

    if (typeStr == 'budget') {
        if (strRupiah > 0) {
            statusRupiah = '+ Rp.'
        } else {
            statusRupiah = '- Rp.'
        }
    } else if (typeStr == 'inc') {
        statusRupiah = '+ Rp.'
    } else if (typeStr == 'exp') {
        statusRupiah = '- Rp.'
    } else if (typeStr == 'persen') {
        statusPersen = '%'
        strRupiah = strRupiah.toFixed(1)
        return strRupiah + '%'
    } else {
        statusRupiah = 'Rp.'
    }

    strRupiah = Math.abs(strRupiah)
    strRupiah = strRupiah.toString()

    if (strRupiah.length > 3) {
        for (var i = strRupiah.length - 1; i >= 0; i--) {
            angkaRupiah += strRupiah[i]
            counter++
            if (counter == 3 && strRupiah[i - 1] != null) {
                angkaRupiah += '.'
                counter = 0
            }
        }
        angkaRupiah = statusRupiah + angkaRupiah.split("").reverse().join("")
    } else {
        angkaRupiah = statusRupiah + strRupiah
    }
    return angkaRupiah
}

updateTotal = function () {
    temptTotalInc = 0
    tempTotalExp = 0
    tempTotalPersenExp = 0

    dataInc.forEach((current) => {
        temptTotalInc += current.valueItem
    })
    totalInc = temptTotalInc

    dataExp.forEach((current) => {
        tempTotalExp += current.valueItem
        if (totalInc > 0) {
            current.precentage = (current.valueItem / totalInc) * 100
        }else{
            current.precentage = 0
        }
        tempTotalPersenExp += current.precentage
    })
    totalExp = tempTotalExp
    totalPersenExp = tempTotalPersenExp

    totalBudget = totalInc - totalExp
}

hapusData = function (e) {
    var idHapus, tempId
    idHapus = e.target.parentNode.parentNode.id
    tempId = idHapus.split('-')

    if (tempId[0] == 'inc') {
        dataInc.forEach((current, idx) => {
            if (current.idItem == idHapus) {
                dataInc.splice(idx, 1)
            }
        })
    } else {
        dataExp.forEach((current, idx) => {
            if (current.idItem == idHapus) {
                dataExp.splice(idx, 1)
            }
        })
    }

    updateTotal()

    selectEl(DOMstr.incomeList).innerHTML = ''
    selectEl(DOMstr.expensesList).innerHTML = ''

    dataInc.forEach((current) => {
        displayAddItem(current, 'inc')
    })

    dataExp.forEach((current) => {
        displayAddItem(current, 'exp')
    })

    displayUpdateExp()

    if(dataExp.length == 0 && dataInc.length == 0){
        init()
    }else{
        displayTotal()
    }
}

addItem = function (dataType, nama, value, typeStr) {
    if (dataType.length == 0) {
        dataType.push({
            idItem: `${typeStr}-0`,
            namaItem: nama,
            valueItem: parseInt(Math.abs(value)),
            precentage: 0
        })
    } else {
        idxTemp = dataType.length - 1
        idTemp = dataType[idxTemp].idItem
        temp = idTemp.split('-')
        idTemp = parseInt(temp[1]) + 1
        dataType.push({
            idItem: `${typeStr}-${idTemp}`,
            namaItem: nama,
            valueItem: parseInt(Math.abs(value)),
            precentage: 0
        })
    }

    updateTotal()
}

displayTotal = function () {
    selectEl(DOMstr.totalBudget).innerHTML = formatNumber(totalBudget, 'budget')
    selectEl(DOMstr.totalExp).innerHTML = formatNumber(totalExp, 'exp')
    selectEl(DOMstr.totalInc).innerHTML = formatNumber(totalInc, 'inc')
    selectEl(DOMstr.totalPersen).innerHTML = formatNumber(totalPersenExp, 'persen')
}

displayUpdateExp = function () {
    var arrListEl
    arrPersen = []
    dataExp.forEach((current) => {
        arrPersen.push(current.precentage)
    })
    arrListEl = selectElAll(DOMstr.expList)
    arrListEl.forEach((current, idx) => {
        current.innerHTML = formatNumber(arrPersen[idx], 'persen')
    })
}

displayAddItem = function (item, typeStr) {
    if (typeStr == 'inc') {
        element = DOMstr.incomeList
        html =
            `
        <div class="item-box" id="%idItem%">
            <p class="nama-item">%namaItem%</p>
            <p class="harga-item">%valueItem%
                <span class="hapus-item">hapus</span>
            </p>
        </div>
        `
    } else {
        element = DOMstr.expensesList
        html =
            `
        <div class="item-box exp-list" id="%idItem%">
            <p class="nama-item">%namaItem%</p>
            <p class="harga-item">%valueItem%
                <span class="percentage-total">%percentage%</span>
                <span class="hapus-item">hapus</span>
            </p>
        </div>
        `
    }

    newHtml = html.replace('%idItem%', item.idItem)
    newHtml = newHtml.replace('%namaItem%', item.namaItem)
    newHtml = newHtml.replace('%valueItem%', formatNumber(item.valueItem, typeStr))
    newHtml = newHtml.replace('%percentage%', formatNumber(item.precentage, 'persen'))

    selectEl(element).insertAdjacentHTML('beforeend', newHtml)
}

getInputVal = function () {

    selectVal = selectEl(DOMstr.inputSelect).value
    inputNamaVal = selectEl(DOMstr.inputNama).value
    inputValVal = selectEl(DOMstr.inputValue).value

    if (inputNamaVal != '' && inputValVal != '') {
        if (selectVal == 'inc') {
            addItem(dataInc, inputNamaVal, inputValVal, 'inc')
            displayAddItem(dataInc[dataInc.length - 1], 'inc')
        } else {
            addItem(dataExp, inputNamaVal, inputValVal, 'exp')
            displayAddItem(dataExp[dataExp.length - 1], 'exp')
        }
        displayUpdateExp()
        displayTotal()

        selectEl(DOMstr.inputNama).value = ''
        selectEl(DOMstr.inputValue).value = ''

        selectEl(DOMstr.inputNama).focus()
    } else {
        if (inputNamaVal == '' && inputValVal == '') {
            alert('deskripsi dan value tidak boleh kosong')
        } else if (inputNamaVal == '') {
            alert('deskripsi tidak boleh kosong')
        } else if (inputValVal == '') {
            alert('value tidak boleh kosong')
        }
    }
}

init = function () {
    getNowDate()
    selectEl(DOMstr.totalInc).innerHTML = formatNumber(0, '')
    selectEl(DOMstr.totalExp).innerHTML = formatNumber(0, '')
    selectEl(DOMstr.totalBudget).innerHTML = formatNumber(0, '')
    selectEl(DOMstr.totalPersen).innerHTML = formatNumber(0, 'persen')
}

init()

// input data baru
selectEl(DOMstr.inputValue).addEventListener('keypress', (event) => {
    if (event.keyCode === 13 || event.which === 13) {
        getInputVal()
    }
})

// hapus data
selectEl(DOMstr.detailSection).addEventListener('click', hapusData)

// outline pada kolom input
var inputan

selectEl(DOMstr.inputSelect).addEventListener('change', () => {
    inputan = selectElAll(DOMstr.inputSelect + ',' + DOMstr.inputNama + ',' + DOMstr.inputValue)
    inputan.forEach((current) => {
        current.classList.toggle('red-focus')
    })
})
