function createUrlsTable(urls) {
    var col = [];
    var table = document.createElement("table");
    table.setAttribute('class', 'table table-striped');
    var tr = table.insertRow(-1);
    for (var i = 0; i < 2; i++) {
        var th = document.createElement("th");
        if (i == 0) {
            var chkbox = document.createElement('input');
            chkbox.type = "checkbox";
            chkbox.class = "select-all checkbox";
            chkbox.id = "selectAll";
            th.appendChild(chkbox);
        }
        if (i == 1) {
            th.innerHTML = 'Available Websites';
        }
        tr.appendChild(th);
    }

    var tr;
    for (var i = 0; i < urls.length; i++) {
        tr = table.insertRow(-1);
        var tabCell1 = tr.insertCell(-1);
        var tabCell2 = tr.insertCell(-1);
        var chkbox = document.createElement('input');
        chkbox.type = "checkbox";
        chkbox.id = "chk" + i;
        chkbox.class = "allChecked";
        chkbox.name = "sport";
        chkbox.value = urls[i].url;
        tabCell1.appendChild(chkbox);

        var myLink = document.createElement('a');
        var href = document.createAttribute('href');
        myLink.setAttribute('href', urls[i].url);
        myLink.innerText = urls[i].text;
        tabCell2.appendChild(myLink);
    }

    var submitButton = document.createElement('input');
    submitButton.type = "button";
    submitButton.id = "submitButton";
    submitButton.value = "Process";
    submitButton.onclick = processSelectedUrl;
    var divContainer = document.getElementById("showData");
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
    divContainer.appendChild(submitButton);
}


function processSelectedUrl() {
    var favorite = [];
    $.each($("input[name='sport']:checked"), function () {
        favorite.push($(this).val());
    });
    var selectedUrl = favorite[0];
    $.ajax({
        url: 'http://52CQYX1J:8080/entities/?url=' + selectedUrl,
        method: "GET",

        success: function (result) {
            console.log(JSON.stringify(result));
            drawTableAndGraph(result);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(thrownError);
        }
    });
}

function drawTableAndGraph(myObj) {
    var allPersons = '';
    var allLocs = '';
    var allProds = '';

    var chartDataPersons = [];
    for (var j = 0; j < myObj.persons.length; j++) {
        if (allPersons == '') {
            allPersons += myObj.persons[j].mention + '(' + myObj.persons[j].count + ')';
        } else {
            allPersons += ',' + myObj.persons[j].mention + '(' + myObj.persons[j].count + ')';
        }
        chartDataPersons.push([myObj.persons[j]['mention'], myObj.persons[j]['count']])
    }

    var chartDataProd = [];
    for (var j = 0; j < myObj.products.length; j++) {
        if (allProds == '') {
            allProds += myObj.products[j].mention + '(' + myObj.products[j].count + ')';
        } else {
            allProds += ',' + myObj.products[j].mention + '(' + myObj.products[j].count + ')';
        }
        chartDataProd.push([myObj.products[j]['mention'], myObj.products[j]['count']]);
    }


    var chartDataLoc= [];
    for (var j = 0; j < myObj.locations.length; j++) {
        if (allLocs == '') {
            allLocs += myObj.locations[j].mention + '(' + myObj.locations[j].count + ')';
        } else {
            allLocs += ',' + myObj.locations[j].mention + '(' + myObj.locations[j].count + ')';
        }
        chartDataLoc.push([myObj.locations[j]['mention'], myObj.locations[j]['count']]);
    }

    var table = document.createElement("table");
    table.setAttribute('class', 'table table-striped');
    var tr = table.insertRow(-1);
    for (var i = 0; i < 2; i++) {
        var th = document.createElement("th");
        if (i == 0) {
            th.innerHTML = 'Category';
        } else if (i == 1) {
            th.innerHTML = 'Entities';
        }
        tr.appendChild(th);
    }

    var tr;
    for (var i = 0; i < 3; i++) {
        tr = table.insertRow(-1);
        var tabCell1 = tr.insertCell(-1);
        var tabCell2 = tr.insertCell(-1);
        if (i == 0) {
            tabCell1.innerHTML = 'Person';
            tabCell2.innerHTML = allPersons;
        } else if (i == 1) {
            tabCell1.innerHTML = 'Product';
            tabCell2.innerHTML = allProds;
        } else if (i == 2) {
            tabCell1.innerHTML = 'Location';
            tabCell2.innerHTML = allLocs;
        }
    }

    var divContainer = document.getElementById("showTables");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    $('#graphcontainer1').highcharts({
        chart: {
            renderTo: 'graphcontainer1',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Persons chart'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Persons',
            colorByPoint: true,
            data: chartDataPersons
        }]
    });

    $('#graphcontainer2').highcharts({
        chart: {
            renderTo: 'graphcontainer2',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Product chart'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Products',
            colorByPoint: true,
            data: chartDataProd
        }]
    });

    $('#graphcontainer3').highcharts({
        chart: {
            renderTo: 'graphcontainer3',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Location chart'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        },
        series: [{
            name: 'Locations',
            colorByPoint: true,
            data: chartDataLoc
        }]
    });



}
