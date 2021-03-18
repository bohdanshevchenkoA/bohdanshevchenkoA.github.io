
$(document).ready(function () {
    $(function () {
        $('#slider').slider();
    });
    $(function () {
        $('input').checkboxradio();
    });

    $('#rad-background').click(() => {
        $('#slider').slider('value', RGBToHSL($('#preview').css('background-color')))
    });
    $('#rad-text').click(() => {
        $("#slider").slider('value', RGBToHSL($('#preview').css('color')));
    });

    $('#slider').slider(
        {
            value: RGBToHSL($('#preview').css('background-color')),
            min: 0,
            max: 250,
            slide: function (event, ui) {
                let color = `hsl(${ui.value}, 100%, 50%)`;
                $('#rad-background').prop('checked')
                    ? $('#preview').css({ 'background': color })
                    : $('#preview').css({ 'color': color });
            }
        }
    );
});


function RGBToHSL(rgb) {
    let [color, r, g, b] = rgb.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);

    // Make r, g, and b fractions of 1
    r = +r / 255;
    g = +g / 255;
    b = +b / 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0;
        
    // Calculate hue
    if (delta == 0) { // No difference
        h = 0;
    } else if (cmax == r) { // Red is max
        h = ((g - b) / delta) % 6;
    } else if (cmax == g) { // Green is max
        h = (b - r) / delta + 2;
    } else { // Blue is max
        h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    // Make negative hues positive behind 360
    if (h < 0) {
        h += 360;
    }

    return h;
}