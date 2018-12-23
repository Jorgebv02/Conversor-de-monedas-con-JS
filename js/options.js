// Shows/hides the sidebar.
function toggleMenu(){    
    $('.menu-bar').on('click', function() {
        $('.contents').toggleClass('open');
    });
}

// Adds currencies from a JSON file into the dropdown lists.
function addCurrenciesIntoDropdown(){    
    $.ajax({
        url: "https://raw.githubusercontent.com/JuanEscobar066/CurrencyConverter/master/Currency%20converter/currencies.json?token=AZHbxaZ-kmWeLFCL4lZxW2Q9xWSDo7U1ks5cJstBwA%3D%3D",
        success: function(data) {            
            $.each(JSON.parse(data), function (i, val) {
                // Adds the currencies to the dropdown lists.
                let currency = "<option value="
                + i
                + ">"
                + val.name
                + "</option>";
                $(currency).appendTo(".currenciesBox");                      
            });
            $("#currencies1").val("USD"); // Default currency to be converted.
            $("#currencies2").val("CRC"); // Default currency converted.           
        },
        error: function() {
            console.error("Error showing the available currencies.");
        }
    });
}

// Adds currencies from a JSON file into the sidebar menu.
function addCurrenciesSidebar(){    
    $.ajax({
        url: "https://raw.githubusercontent.com/JuanEscobar066/CurrencyConverter/master/Currency%20converter/currencies.json?token=AZHbxaZ-kmWeLFCL4lZxW2Q9xWSDo7U1ks5cJstBwA%3D%3D",
        success: function(data) {                 
            let currencies = JSON.parse(data); 
            
            $.each(JSON.parse(data), function (i, val) {  
                const currency = currencies[i]; 
                // Adds the currencies to the sidebar menu.
                $("#slidebar ul").append(
                    '<li><input type="checkbox" class="star" name="chk" id="' 
                    + val.name + '" value="' 
                    + i + '"/> <img src="img/Flags/' + i + '.png" alt="" class="menu-bar"><label for="' 
                    + val.name + '" style="font-size: 14px;">' 
                    + val.name + ' (' + i + ' '+ currency.symbol + ')</label></li>');                  
            });
            $("input[value='CRC']").prop("checked", true);  // Selects CRC as default.
            $("input[value='CRC']").attr("disabled", true); // Always disabled, but still selected.
        },
        error: function() {
            console.error("Error adding currencies");
        }
    });
}

// Converts a value of one currency to the favorite currencies.
function convertFavorites(){
    $.ajax({
        url: "https://raw.githubusercontent.com/JuanEscobar066/CurrencyConverter/master/Currency%20converter/currencies.json?token=AZHbxaZ-kmWeLFCL4lZxW2Q9xWSDo7U1ks5cJstBwA%3D%3D",
        success: function(data) {            
            var favoriteCurrencies = [];
            let currencies = JSON.parse(data);    
            $("#tblBody tr").remove(); // To refresh the table.

            // Inserts into an array the currencies selected as favorite.
            $.each($("input[name='chk']:checked"), function(){            
                favoriteCurrencies.push($(this).val());
            });

            // Converts the value typed in the input to every favorite currency.        
            for(let i = 0; i < favoriteCurrencies.length; i++){                
                // Gets the information of a specific currency depending of the code (e.g., CRC).
                const currency = currencies[favoriteCurrencies[i]]; 
                // Creates a string like "CRC_USD".
                let conversion = "CRC_" + favoriteCurrencies[i];        
                //if(favoriteCurrencies[i] !== "CRC"){
                $.ajax({
                    url: "http://free.currencyconverterapi.com/api/v5/convert?q=" + conversion + "&compact=y",                           
                    success: function(response) {
                        let value = response[conversion].val * parseFloat($("#inputAmountFav").val());                        
                        // Adds the conversions to the table.
                        let currencyRow = "<tr>"
                        + '<td><img src="img/Flags/' + currency.code + '.png" alt="" class="menu-bar"></td>'
                        + "<td>" + currency.code + "</td>"
                        + "<td>" + currency.name + "</td>"
                        + "<td>" + value + currency.symbol + "</td>"
                        + "</tr>";
                        $(currencyRow).appendTo("#tblBody");
                    },
                    error: function() {
                        console.error("Error fetching exchange rate.");
                    }
                });
                //}
            }
        },
        error: function() {
            console.error("Error converting currencies");
        }
    });
}

// Converts a value of one currency to another.
function convert(){
    $.ajax({
        url: "https://raw.githubusercontent.com/JuanEscobar066/CurrencyConverter/master/Currency%20converter/currencies.json?token=AZHbxaZ-kmWeLFCL4lZxW2Q9xWSDo7U1ks5cJstBwA%3D%3D",
        success: function(data) {
            let conversion = $("#currencies1").val() + "_" + $("#currencies2").val(); 
            $.ajax({
                url: "http://free.currencyconverterapi.com/api/v5/convert?q=" + conversion + "&compact=y",                           
                success: function(response) {
                    let value = response[conversion].val * parseFloat($("#inputAmount1").val());
                    document.getElementById("inputAmount2").value = value; // Shows the conversion result in the second input.           
                },
                error: function() {
                    console.error("Error fetching exchange rate.");
                }
            });
        },
        error: function() {
            console.error("Error converting currencies");
        }
    });
}

// Executes when the value of an input is changed.
function conversionOnInputChange(){
    $("#inputAmount1").on('input', function() {
        if(jQuery.isNumeric($("#inputAmount1").val()) === true){
            convert();            
        }
    });
}

// Executes when the value of the favorite currency input is changed.
function conversionOnInputFavoriteChange(){
    $("#inputAmountFav").on('input', function() {
        if(jQuery.isNumeric($("#inputAmountFav").val()) === true){            
            convertFavorites();
        }
    });
}

// -------------------------------------------------------------
// Executes when the value of a dropdown list is changed.
function conversionOnCurrency1Change(){
    $("#currencies1").change(function () {
        if(jQuery.isNumeric($("#inputAmount1").val()) === true){
            convert();
        }
    });
}

function conversionOnCurrency2Change(){
    $("#currencies2").change(function () {
        if(jQuery.isNumeric($("#inputAmount1").val()) === true){
            convert();
        }
    });
}
//---------------------------------------------------------------

// Executes when any checkbox is selected/deselected.
function conversionOncheckboxChange(){
    $(document).ready(function(){
        $('input[type="checkbox"]').click(function(){            
            if(jQuery.isNumeric($("#inputAmountFav").val()) === true){
                convertFavorites();
            }
        });
    });
}

jQuery(
    addCurrenciesSidebar(),
    addCurrenciesIntoDropdown(),
    conversionOnInputChange(),
    conversionOnCurrency1Change(),
    conversionOnCurrency2Change(),
    conversionOnInputFavoriteChange(),
    conversionOncheckboxChange(),
    toggleMenu()
);
