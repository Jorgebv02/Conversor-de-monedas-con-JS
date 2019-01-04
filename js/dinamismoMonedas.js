// Agrega las monedas al dropdown del cambio individual.
function agregaMonedasAlDropdown(){    
    $.ajax({
        url: "https://raw.githubusercontent.com/Jorgebv02/Laboratorio-02-web/master/currencies.json",
        success: function(data) {            
            $.each(JSON.parse(data), function (i, val) {

                // Agrega cada una de las monedas a las listas.
                let moneda = "<option value="
                + i
                + ">"
                + val.name
                + "</option>";
                $(moneda).appendTo(".cajaMonedas");                      
            });                      
        },
        error: function() {
            console.error("Error.");
        }
    });
}

// Agrega las monedas a la lista de checkbox.
function agregaMonedasAlCheckbox(){    
    $.ajax({
        url: "https://raw.githubusercontent.com/Jorgebv02/Laboratorio-02-web/master/currencies.json",
        success: function(data) {                 
            let currencies = JSON.parse(data); 

            $.each(JSON.parse(data), function (i, val) {  
                const currency = currencies[i]; 

                // Agrega cada una junto al checkbox.
                $("#list1").append(
                    '<a href="#" class="list-group-item"><input name="chk" type="checkbox" class="pull-right" id="' + val.name + '" value="' + i + '"/>' + ' <img src="img/Flags/' + i + '.png" alt="" class="menu-bar"> ' + val.name + ' (' + i + ') '+ currency.symbol +'</a>');                  
            });
            $("input[value='CRC']").prop("checked", true);
        },
        error: function() {
            console.error("Error.");
        }
    });
}

// Convierte una hacia las demás. 
function convierteSeleccionadas(){
    $.ajax({
        url: "https://raw.githubusercontent.com/Jorgebv02/Laboratorio-02-web/master/currencies.json",
        success: function(data) {            
            var favoriteCurrencies = [];
            let currencies = JSON.parse(data);

            // Refresca la tabla.
            $("#tbl tr").remove(); 

            // Inserta en el arreglo todas las seleccionadas.
            $.each($("input[name='chk']:checked"), function(){                      
                favoriteCurrencies.push($(this).val());                
            });

            // Mediante un ciclo va haciendo el cambio de cada una hacia las demás.         
            for(let i = 0; i < favoriteCurrencies.length; i++){                

                // Atrapa la información de una en específico. 
                const currency = currencies[favoriteCurrencies[i]]; 

                // La convierte en un string de la forma: "CNY_USD".
                let conversion = $("#listaMonedas").val() + "_" + favoriteCurrencies[i];        

                // Hace la solicitud al API.
                $.ajax({
                    url: "http://free.currencyconverterapi.com/api/v5/convert?q=" + conversion + "&compact=y",                           
                    success: function(response) {
                        let value = response[conversion].val * parseFloat($("#inputCantidad").val());                       

                        // Agrega la conversión al resultado.
                        let currencyRow = "<tr>"
                        + '<td><img src="img/Flags/' + currency.code + '.png" alt="" class="menu-bar"></td>'
                        + "<td>" + currency.code + "</td>"
                        + "<td>" + currency.name + "</td>"
                        + "<td>" + value + currency.symbol + "</td>"
                        + "</tr>";
                        $(currencyRow).appendTo("#tbl");
                    },
                    error: function() {
                        console.error("Error.");
                    }
                });

            }
        },
        error: function() {
            console.error("Error.");
        }
    });
}

// Siempre que haya un cambio en el input esta dos función lo detecta.
function conversionSobreLasFavoritas(){
    $("#inputCantidad").on('input', function() {
        if(jQuery.isNumeric($("#inputCantidad").val()) === true){                 
            convierteSeleccionadas();
        }
    });
}


//---------------------------------------------------------------

// Esta función verifica cuando uno de los checbox cambia y hace el llamado a la conversión de todas. 
function conversionCajaResultadoCambia(){
    $(document).ready(function(){        
        $('input[type="checkbox"]').click(function(){                        
            if(jQuery.isNumeric($("#inputCantidad").val()) === true){
                convierteSeleccionadas();
            }
        });
    });
}

// Esta función detecta cuando hay un cambio de moneda.
function detectaCambioMoneda(){
    $("#listaMonedas").change(function() {
        if(jQuery.isNumeric($("#inputCantidad").val()) === true){
            convierteSeleccionadas();
        }
    });
}

jQuery(
    detectaCambioMoneda(),
    agregaMonedasAlCheckbox(),
    agregaMonedasAlDropdown(),    
    conversionSobreLasFavoritas(),
    conversionCajaResultadoCambia(),    
);
