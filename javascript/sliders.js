const defaultSliders = {
    "complicite": { "name": "Complicité", "id": "complicite", "value": 50, "color": "66ffc2" },
    "conjugalite": { "name": "Conjugalité", "id": "conjugalite", "value": 50, "color": "d3d3d3" },
    "fun": { "name": "Fun", "id": "fun", "value": 50, "color": "ffff66" },
    "intimite": { "name": "Intimité", "id": "intimite", "value": 50, "color": "ccffff" },
    "physique": { "name": "Proximité physique", "id": "physique", "value": 50, "color": "ffd699" },
    "sensualite": { "name": "Sensualité", "id": "sensualite", "value": 50, "color": "bb99ff" },
    "sex": { "name": "Sexualité", "id": "sex", "value": 50, "color": "ffb3d9" },
    "intel": { "name": "Stimulation intellectuelle", "id": "intel", "value": 50, "color": "ff6666" },
    "hetero": { "name": "Heteronormativité", "id": "hetero", "value": 50, "color": "4d4dff" },
    "queerness": { "name": "Queerness", "id": "queerness", "value": 50, "color": "ffe6ff" },
};

var sliders = {};

const getUrlParameters = function (sParam) {
    var sPageURL = window.location.href.split('#')[1];

    if (sPageURL === undefined) {
        return null;
    }

    var sURLVariables = decodeURIComponent(sPageURL).split('&'),
        sParameterName,
        i,
        name,
        value,
        parameters = [];

    for (i = 0; i < sURLVariables.length; i++) {
        sParameter = sURLVariables[i].split('=');
        name = sParameter[0];
        value = sParameter[1];

        parameters[name] = value;
    }

    return parameters;
};

const slugify = function (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
};

const getRandomColor = function () {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const addSlider = function (id, name, value, color) {

    if (value === undefined) {
        value = 50;
    }

    if (color === undefined) {
        color = getRandomColor();
    }

    sliders[id] = {
        "id": id,
        "name": name,
        "value": value,
        "color": color
    };

    $("#sliders").append(
        '<div class="slidecontainer row" id="block-'+id+'">' +
            '<div class="col-3">' +
                '<label for="'+id+'">'+name+'</label>' +
                '&nbsp' +
                '<input type="button" class="remove-slider btn-outline-info" id="remove-slider-'+id+'" value="-" />' +
            '</div>' +
            '<div class="col-9">' +
                '<input type="range" min="1" max="100" value="'+value+'" class="slider" id="'+id+'" style="background-color: #'+color+';" />' +
            '</div>' +
        '</div>'
    );

    $("#"+id).change(updateSliders);
    $("#remove-slider-"+id).click(function() {
        removeSlider(id);
    });
};

const loadState = function() {
    parameters = getUrlParameters();

    if (parameters !== null) {
        $('#you').val(parameters["you"]);
        $('#other').val(parameters["other"]);

        slidersConfig = parameters["sliders"];

        if (slidersConfig === undefined) {
            for (var id in parameters) {
                if (defaultSliders[id] !== undefined) {
                    sliders[id] = {
                        "id": defaultSliders[id]["id"],
                        "name": defaultSliders[id]["name"],
                        "value": parameters[id],
                        "color": defaultSliders[id]["color"]
                    }
                }
            }
        } else {
            sliders = JSON.parse(slidersConfig);
        }        
    } else {
        sliders = defaultSliders;
    }

    displaySliders();
};

const displaySliders = function() {
    for(var id in sliders) {
        addSlider(
            sliders[id]["id"],
            sliders[id]["name"],
            sliders[id]["value"],
            sliders[id]["color"]
        );
    }

    updateSliders();
};

const newSlider = function () {
    var name = $("#new-slider-name").val();
    var id = slugify(name);

    addSlider(id, name);
    updateSliders();

    $("#new-slider-name").val("");
};

const removeSlider = function (id) {
    var confirmation = confirm("Es-tu sûr•e de vouloir supprimer ce critère ?");

    if (confirmation === true) {
        $("#block-" + id).remove();
        delete sliders[id];
        updateSliders();
    }
};

const updateSliders = function() {
    $('.slider').each(function () {
        sliders[$(this).attr('id')]["value"] = $(this).val();
    });

    var state = [
        "you=" + $("#you").val(),
        "other=" + $("#other").val(),
        "sliders=" + encodeURIComponent(JSON.stringify(sliders))
    ];

    window.location.href = 'index.html#' + state.join('&');
    $('#link').val(window.location.href);
};

const copyLink = function() {
    var copyText = document.getElementById("link");
    copyText.select();
    document.execCommand("Copy");
};
