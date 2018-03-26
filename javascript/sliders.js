const defaultSliders = {
    "complicite": { "name": "Complicité", "value": 50, "expectedValue": 50, "color": "66ffc2" },
    "conjugalite": { "name": "Conjugalité", "value": 50, "expectedValue": 50, "color": "d3d3d3" },
    "fun": { "name": "Fun", "value": 50, "expectedValue": 50, "color": "ffff66" },
    "intimite": { "name": "Intimité", "value": 50, "expectedValue": 50, "color": "ccffff" },
    "physique": { "name": "Proximité physique", "value": 50, "expectedValue": 50, "color": "ffd699" },
    "sensualite": { "name": "Sensualité", "value": 50, "expectedValue": 50, "color": "bb99ff" },
    "sex": { "name": "Sexualité", "value": 50, "expectedValue": 50, "color": "ffb3d9" },
    "intel": { "name": "Stimulation intellectuelle", "value": 50, "expectedValue": 50, "color": "ff6666" },
    "hetero": { "name": "Heteronormativité", "value": 50, "expectedValue": 50, "color": "4d4dff" },
    "queerness": { "name": "Queerness", "value": 50, "expectedValue": 50, "color": "ffe6ff" },
};

const tooltips = {
    "complicite": "On partage des références, on a des private jokes, \"on se connaît par coeur\"",
    "conjugalite": "On vit ensemble, on se voit souvent, on partage des cercles communs",
    "fun": "On s’amuse, joue, rigole ensemble",
    "intimite": "On aborde ensemble des sujets intimes, on parle de soi",
    "physique": "On se tient la main, on se fait des câlins, on peut dormir ensemble",
    "sensualite": "On s’embrasse, on se câline, on peut être nu.e.s ensemble, j’ai envie de te toucher",
    "sex": "On a des rapports sexuels",
    "intel": "On se rend curieux, on crée ensemble, on discute, on se nourrit",
    "hetero": "Notre relation correspond au stéréotype de la relation homme/femme monogame",
    "queerness": "Notre relation remet en question, subvertit les normes sexuelles, genrées...",
};

var sliders = {};

const getUrlParameters = function () {
    var sPageURL = window.location.href.split('#')[1];

    if (sPageURL === undefined) {
        return null;
    }

    var sURLVariables = decodeURIComponent(sPageURL).split('&'),
        sParameter,
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

const addSlider = function (id, name, value, expectedValue, color) {

    if (value === undefined) {
        value = 50;
    }

    if (expectedValue === undefined) {
        expectedValue = value;
    }

    if (color === undefined) {
        color = getRandomColor();
    }

    sliders[id] = {
        "name": name,
        "value": value,
        "expectedValue": expectedValue,
        "color": color
    };

    var tooltip = (id in tooltips) ? ' data-toggle="tooltip" title="' + tooltips[id] + '"':'';

    $("#sliders").append(
        '<div class="slidecontainer row" id="block-'+id+'">' +
            '<div class="col-3">' +
                '<label for="'+id+'"'+ tooltip + '>'+name+'</label>' +
                '&nbsp' +
                '<input type="button" class="remove-slider btn-outline-info" id="remove-slider-'+id+'" value="-" />' +
            '</div>' +
            '<div class="col-9">' +
                '<div class="row">' +
                    '<div class="col-2">Actuel :</div>' +
                    '<div class="col-10"><input type="range" min="1" max="100" value="'+value+'" class="slider actual" id="'+id+'" style="background-color: #'+color+';" /></div>' +
                '</div>' +
                '<div class="row">' +
                    '<div class="col-2">Souhaité :</div>' +
                    '<div class="col-10"><input type="range" min="1" max="100" value="'+expectedValue+'" class="slider expected" id="expected-'+id+'" ref="'+id+'" style="background-color: #'+color+';" /></div>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<hr/>'
    );

    $("#"+id).change(updateSliders);
    $("#expected-"+id).change(updateSliders);
    $("#remove-slider-"+id).click(function() {
        removeSlider(id);
    });
};

const loadState = function() {
    var parameters = getUrlParameters();

    if (parameters !== null) {
        $('#you').val(parameters["you"]);
        $('#other').val(parameters["other"]);

        var slidersConfig = parameters["sliders"];

        if (slidersConfig === undefined) {
            for (var id in parameters) {
                if (defaultSliders[id] !== undefined) {
                    sliders[id] = {
                        "name": defaultSliders[id]["name"],
                        "value": parameters[id],
                        "expectedValue": parameters[id],
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

    $('[data-toggle="tooltip"]').tooltip();
};

const displaySliders = function() {
    for(var id in sliders) {
        addSlider(
            id,
            sliders[id]["name"],
            sliders[id]["value"],
            ("expectedValue" in sliders[id]) ? sliders[id]["expectedValue"] : sliders[id]["value"],
            sliders[id]["color"]
        );
    }

    updateSliders();
};

const newSlider = function () {
    var slider = $("#new-slider-name");
    var name = slider.val();
    var id = slugify(name);

    addSlider(id, name);
    updateSliders();

    slider.val("");
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
    $('.actual').each(function () {
        sliders[$(this).attr('id')]["value"] = $(this).val();
    });

    $('.expected').each(function () {
        sliders[$(this).attr('ref')]["expectedValue"] = $(this).val();
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
