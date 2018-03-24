const getUrlParameters = function (sParam) {
    var sPageURL = window.location.href.split('#')[1];

    if (sPageURL === undefined) {
        return null;
    }

    var sURLVariables = sPageURL.split('&'),
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

const loadState = function() {
    parameters = getUrlParameters();

    if (parameters !== null) {
        for (var id in parameters) {
            $('#' + id).val(parameters[id]);
        }
    }

    updateSliders();
}

var updateSliders = function() {
    var state = [
        "you=" + $("#you").val(),
        "other=" + $("#other").val()
    ];

    $('.slider').each(function () {
        var id = $(this).attr('id');
        var value = $(this).val();

        state.push(id + '=' + value)
    });

    window.location.href = 'index.html#' + state.join('&');
    $('#link').val(window.location.href);

    console.log(state);
}